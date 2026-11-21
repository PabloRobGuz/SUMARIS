'use strict';
/**
 * CAPA DE DATOS DEL MOTOR ADAPTATIVO (MySQL).
 * Todas las funciones reciben una conexión de mysql2/promise ya abierta,
 * así que se pueden probar con una conexión simulada.
 */
const motor = require('./motor-adaptativo');

const { ESTADOS } = motor;

function errorHttp(estado, mensaje) {
  const e = new Error(mensaje);
  e.estadoHttp = estado;
  return e;
}

/** Nodos y aristas del grafo de conocimiento (tablas nodo_conocimiento y prerrequisito_nodo). */
async function cargarGrafo(conn) {
  const [nodos] = await conn.execute('SELECT id_nodo, titulo_nodo, descripcion FROM nodo_conocimiento ORDER BY id_nodo');
  const [aristas] = await conn.execute('SELECT id_nodo, id_nodo_requerido, dominio_minimo FROM prerrequisito_nodo');
  return {
    nodos,
    aristas: aristas.map((a) => ({
      id_nodo: Number(a.id_nodo), id_nodo_requerido: Number(a.id_nodo_requerido), dominio_minimo: Number(a.dominio_minimo)
    }))
  };
}

/**
 * Garantiza que el estudiante tenga una fila de progreso por cada nodo: los nodos sin prerrequisitos
 * empiezan "Desbloqueado" y el resto "Bloqueado". No depende de ningún trigger de la base de datos.
 */
async function asegurarProgreso(conn, idUsuario, grafo) {
  const [usuario] = await conn.execute('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [idUsuario]);
  if (!usuario.length) throw errorHttp(404, 'El usuario no existe.');
  const conPrerrequisitos = new Set(grafo.aristas.map((a) => a.id_nodo));
  for (const n of grafo.nodos) {
    await conn.execute(
      'INSERT IGNORE INTO progreso_usuario (id_usuario, id_nodo, porcentaje_dominio, estado_nodo) VALUES (?, ?, 0, ?)',
      [idUsuario, n.id_nodo, conPrerrequisitos.has(Number(n.id_nodo)) ? ESTADOS.BLOQUEADO : ESTADOS.DESBLOQUEADO]
    );
  }
}

/** Mapa id_nodo → { dominio, estado } del estudiante. */
async function leerProgreso(conn, idUsuario) {
  const [filas] = await conn.execute(
    'SELECT id_nodo, porcentaje_dominio, estado_nodo FROM progreso_usuario WHERE id_usuario = ?', [idUsuario]
  );
  return new Map(filas.map((f) => [Number(f.id_nodo), { dominio: Number(f.porcentaje_dominio), estado: f.estado_nodo }]));
}

/** "Foto" completa del grafo del estudiante: nodos con estado/dominio/estrellas, repasos pendientes y siguiente paso. */
async function construirRuta(conn, idUsuario, grafo) {
  const g = grafo || await cargarGrafo(conn);
  const progreso = await leerProgreso(conn, idUsuario);
  const [resumenFilas] = await conn.execute(
    'SELECT id_nodo, COUNT(*) AS sesiones, MAX(puntaje) AS mejor_puntaje FROM evaluacion_sesion WHERE id_usuario = ? GROUP BY id_nodo', [idUsuario]
  );
  const [refuerzos] = await conn.execute(
    'SELECT id_nodo_origen, id_nodo_refuerzo, motivo FROM refuerzo_pendiente WHERE id_usuario = ? AND resuelto = 0 ORDER BY fecha_creacion, id_nodo_origen', [idUsuario]
  );
  const resumen = new Map(resumenFilas.map((r) => [Number(r.id_nodo), { sesiones: Number(r.sesiones), mejor_puntaje: Number(r.mejor_puntaje) }]));
  return motor.armarRuta({
    nodos: g.nodos, aristas: g.aristas, progreso, resumen,
    refuerzos: refuerzos.map((r) => ({ id_nodo_origen: Number(r.id_nodo_origen), id_nodo_refuerzo: Number(r.id_nodo_refuerzo), motivo: r.motivo }))
  });
}

/** Ruta del estudiante para GET /api/ruta/:id_usuario (crea el progreso inicial si hace falta). */
async function obtenerRuta(conn, idUsuario) {
  const grafo = await cargarGrafo(conn);
  await asegurarProgreso(conn, idUsuario, grafo);
  return construirRuta(conn, idUsuario, grafo);
}

/**
 * Evalúa una sesión: calcula puntaje y dominio, actualiza el progreso, desbloquea nodos hijos,
 * registra o resuelve repasos y devuelve la decisión del motor junto con la ruta actualizada.
 * Todo el guardado ocurre en una transacción.
 * @param intento salida de motor.normalizarIntento(...).valor
 */
async function evaluarSesion(conn, intento) {
  const { idUsuario, idNodo } = intento;
  const grafo = await cargarGrafo(conn);
  const nodo = grafo.nodos.find((n) => Number(n.id_nodo) === idNodo);
  if (!nodo) throw errorHttp(404, 'El nodo de conocimiento no existe.');
  await asegurarProgreso(conn, idUsuario, grafo);

  const progreso = await leerProgreso(conn, idUsuario);
  const [previas] = await conn.execute(
    'SELECT puntaje, origen, aciertos, errores FROM evaluacion_sesion WHERE id_usuario = ? AND id_nodo = ? ORDER BY fecha_evaluacion DESC, id_evaluacion DESC LIMIT 2',
    [idUsuario, idNodo]
  );

  // 1) Desempeño de la sesión y dominio resultante (promedio ponderado de las últimas 3 sesiones)
  const calculo = motor.calcularPuntaje(intento);
  const historial = [
    { puntaje: calculo.puntaje, origen: intento.origen, intentos: calculo.intentos },
    ...previas.map((p) => ({ puntaje: Number(p.puntaje), origen: p.origen, intentos: Number(p.aciertos) + Number(p.errores) }))
  ];
  const dominio = motor.calcularDominio(historial);
  const indicador = motor.clasificarDominio(dominio);

  // 2) Grafo: desbloquear hijos y decidir la ruta
  progreso.set(idNodo, { dominio, estado: indicador });
  const desbloqueados = motor.calcularDesbloqueos(progreso, grafo.aristas);
  const prerrequisitos = motor.prerrequisitosDe(idNodo, grafo.aristas, progreso);
  const decision = motor.decidirRuta({ idNodo, dominio, prerrequisitos, desbloqueados });

  const titulo = (id) => grafo.nodos.find((n) => Number(n.id_nodo) === id)?.titulo_nodo ?? '';
  const motivo = decision.idNodoRefuerzo
    ? `Dominio de «${nodo.titulo_nodo}»: ${dominio}%. Se recomienda repasar «${titulo(decision.idNodoRefuerzo)}».`
    : null;

  // 3) Persistencia atómica
  await conn.beginTransaction();
  try {
    await conn.execute(
      `INSERT INTO evaluacion_sesion
         (id_usuario, id_nodo, origen, aciertos, errores, tiempo_invertido_segundos, pistas_usadas, completada, puntaje, dominio_resultante, indicador, accion_sugerida)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idUsuario, idNodo, intento.origen, intento.aciertos, intento.errores, intento.tiempo, intento.pistas,
        intento.completada ? 1 : 0, calculo.puntaje, dominio, indicador, decision.accion]
    );
    await conn.execute(
      'UPDATE progreso_usuario SET porcentaje_dominio = ?, estado_nodo = ? WHERE id_usuario = ? AND id_nodo = ?',
      [dominio, indicador, idUsuario, idNodo]
    );
    for (const id of desbloqueados) {
      await conn.execute(
        "UPDATE progreso_usuario SET estado_nodo = 'Desbloqueado' WHERE id_usuario = ? AND id_nodo = ? AND estado_nodo = 'Bloqueado'",
        [idUsuario, id]
      );
    }
    if (decision.idNodoRefuerzo) {
      await conn.execute('DELETE FROM refuerzo_pendiente WHERE id_usuario = ? AND id_nodo_origen = ?', [idUsuario, idNodo]);
      await conn.execute(
        'INSERT INTO refuerzo_pendiente (id_usuario, id_nodo_origen, id_nodo_refuerzo, motivo, resuelto) VALUES (?, ?, ?, ?, 0)',
        [idUsuario, idNodo, decision.idNodoRefuerzo, motivo]
      );
    }
    if (indicador === ESTADOS.DOMINADO) {
      // Dominar un nodo resuelve los repasos que nacieron de él o que lo tenían como repaso
      await conn.execute(
        'UPDATE refuerzo_pendiente SET resuelto = 1 WHERE id_usuario = ? AND resuelto = 0 AND (id_nodo_origen = ? OR id_nodo_refuerzo = ?)',
        [idUsuario, idNodo, idNodo]
      );
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  }

  const ruta = await construirRuta(conn, idUsuario, grafo);
  const nodoRuta = ruta.nodos.find((n) => n.id_nodo === idNodo);
  return {
    puntaje: calculo.puntaje,
    componentes: calculo.componentes,
    indicador,
    dominio,
    estrellas: nodoRuta ? nodoRuta.estrellas : 0,
    accion: decision.accion,
    codigo_mensaje: decision.codigo,
    sesion_destacada: calculo.puntaje >= 90,
    nodo: { id_nodo: idNodo, titulo: nodo.titulo_nodo },
    nodos_desbloqueados: desbloqueados.map((id) => ({ id_nodo: id, titulo: titulo(id) })),
    nodo_refuerzo: decision.idNodoRefuerzo ? { id_nodo: decision.idNodoRefuerzo, titulo: titulo(decision.idNodoRefuerzo) } : null,
    ruta
  };
}

/** Comprobación al arrancar el servidor: avisa si el grafo tiene ciclos o aristas rotas (no detiene el servidor). */
async function verificarGrafo(conn) {
  const grafo = await cargarGrafo(conn);
  return motor.validarGrafo(grafo.nodos.map((n) => Number(n.id_nodo)), grafo.aristas);
}

module.exports = { cargarGrafo, asegurarProgreso, leerProgreso, construirRuta, obtenerRuta, evaluarSesion, verificarGrafo, errorHttp };
