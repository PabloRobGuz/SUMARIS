'use strict';
/**
 * MOTOR ADAPTATIVO
 * Todo lo que decide el motor está aquí.
 */

const CONFIG = Object.freeze({
  DOMINIO_MINIMO: 70,            // % de dominio para considerar un nodo "Dominado" (y valor por defecto de cada prerrequisito)
  UMBRAL_REFUERZO: 40,           // por debajo de este % el nodo "Necesita refuerzo"
  PENALIZACION_PISTAS: 0.15,     // máx. 15 % del puntaje si se usan pistas en todos los intentos
  PENALIZACION_LENTITUD: 0.10,   // máx. 10 % del puntaje si se tarda 3 veces o más el tiempo esperado
  FACTOR_NO_COMPLETADA: 0.8,     // si la sesión se abandona o se pierden las vidas
  SEGUNDOS_POR_EJERCICIO: 35,    // tiempo esperado por intento
  PESOS_HISTORIAL: Object.freeze([0.5, 0.3, 0.2]),             // dominio = promedio ponderado de las últimas 3 sesiones (más reciente primero)
  PESO_ORIGEN: Object.freeze({ leccion: 1, mixta: 0.5 }),      // la práctica mixta pesa la mitad que una lección
  INTENTOS_EVIDENCIA_COMPLETA: 5,                              // con menos intentos, la sesión pesa proporcionalmente menos
  MAX_INTENTOS: 1000,
  MAX_SEGUNDOS: 86400
});

const INDICADORES = Object.freeze({ DOMINADO: 'Dominado', EN_PROCESO: 'En proceso', REFUERZO: 'Necesita refuerzo' });
const ESTADOS = Object.freeze({ BLOQUEADO: 'Bloqueado', DESBLOQUEADO: 'Desbloqueado', ...INDICADORES });
const ACCIONES = Object.freeze({
  AVANZAR: 'avanzar',
  PRACTICAR: 'practicar_mas',
  REFORZAR_PRERREQUISITO: 'reforzar_prerrequisito',
  REPETIR: 'repetir_nodo'
});

const redondear = (n) => Math.round(n * 100) / 100;
const acotar = (n, min, max) => Math.min(max, Math.max(min, n));

// ---------------------------------------------------------------------------
// 1. VALIDACIÓN DE ENTRADA
// ---------------------------------------------------------------------------
function normalizarIntento(cuerpo) {
  const c = cuerpo || {};
  const primero = (...claves) => { for (const k of claves) if (c[k] !== undefined && c[k] !== null) return c[k]; return undefined; };
  const numero = (v, porDefecto) => {
    if (v === undefined) return porDefecto;
    if (v === '' || typeof v === 'boolean') return NaN;
    return Number(v);
  };

  const origen = primero('origen') === undefined ? 'leccion' : String(primero('origen'));
  const completadaCruda = primero('completada');
  const completada = completadaCruda === undefined ? true : (completadaCruda === true || completadaCruda === 1 || completadaCruda === '1' || completadaCruda === 'true');

  const campos = {
    idUsuario: numero(primero('usuario_id', 'id_usuario')),
    idNodo: numero(primero('nodo_id', 'id_nodo')),
    aciertos: numero(primero('aciertos')),
    errores: numero(primero('errores')),
    tiempo: numero(primero('tiempo_invertido_segundos', 'tiempo_invertido'), 0),
    pistas: numero(primero('pistas_usadas', 'pistas_solicitadas'), 0)
  };
  const maximos = { idUsuario: 2147483647, idNodo: 2147483647, aciertos: CONFIG.MAX_INTENTOS, errores: CONFIG.MAX_INTENTOS, tiempo: CONFIG.MAX_SEGUNDOS, pistas: CONFIG.MAX_INTENTOS };
  for (const [nombre, valor] of Object.entries(campos)) {
    if (!Number.isInteger(valor) || valor < 0 || valor > maximos[nombre]) {
      return { ok: false, error: `El campo «${nombre}» es obligatorio y debe ser un entero válido (≥ 0).` };
    }
  }
  if (campos.idUsuario < 1 || campos.idNodo < 1) return { ok: false, error: 'Usuario o nodo inválido.' };
  if (campos.aciertos + campos.errores === 0) return { ok: false, error: 'La sesión no tiene intentos que evaluar (aciertos + errores = 0).' };
  if (!Object.prototype.hasOwnProperty.call(CONFIG.PESO_ORIGEN, origen)) {
    return { ok: false, error: `Origen desconocido: «${origen}». Usa «leccion» o «mixta».` };
  }
  return { ok: true, valor: { ...campos, origen, completada } };
}

// ---------------------------------------------------------------------------
// 2. EVALUACIÓN DE DESEMPEÑO
// ---------------------------------------------------------------------------
/**
 * puntaje = 100 · precisión · (1 − 0.15·dependenciaDePistas − 0.10·lentitud) · (completada ? 1 : 0.8)
 *  - precisión: aciertos / (aciertos + errores)
 *  - dependenciaDePistas: pistas / intentos (máx. 1)
 *  - lentitud: 0 si se tardó lo esperado (35 s por intento), 1 si se tardó 3 veces o más
 */
function calcularPuntaje({ aciertos, errores, tiempo = 0, pistas = 0, completada = true }) {
  const intentos = aciertos + errores;
  if (intentos <= 0) return { puntaje: 0, intentos: 0, componentes: { precision: 0, dependenciaPistas: 0, lentitud: 0 } };
  const precision = aciertos / intentos;
  const dependenciaPistas = acotar(pistas / intentos, 0, 1);
  const esperado = intentos * CONFIG.SEGUNDOS_POR_EJERCICIO;
  const lentitud = tiempo > esperado ? acotar((tiempo - esperado) / (2 * esperado), 0, 1) : 0;
  const factor = 1 - CONFIG.PENALIZACION_PISTAS * dependenciaPistas - CONFIG.PENALIZACION_LENTITUD * lentitud;
  const puntaje = 100 * precision * factor * (completada ? 1 : CONFIG.FACTOR_NO_COMPLETADA);
  return {
    puntaje: redondear(acotar(puntaje, 0, 100)),
    intentos,
    componentes: { precision: redondear(precision), dependenciaPistas: redondear(dependenciaPistas), lentitud: redondear(lentitud) }
  };
}

function clasificarDominio(dominio) {
  if (dominio >= CONFIG.DOMINIO_MINIMO) return INDICADORES.DOMINADO;
  if (dominio >= CONFIG.UMBRAL_REFUERZO) return INDICADORES.EN_PROCESO;
  return INDICADORES.REFUERZO;
}

function estrellasDe(dominio) {
  if (dominio >= 90) return 3;
  if (dominio >= CONFIG.DOMINIO_MINIMO) return 2;
  if (dominio >= CONFIG.UMBRAL_REFUERZO) return 1;
  return 0;
}

/**
 * Dominio de un nodo = promedio ponderado de sus últimas 3 evaluaciones (la más reciente primero).
 * Cada sesión pesa: peso de posición · peso de origen · evidencia (intentos / 5, máx. 1).
 * @param {{puntaje:number, origen?:string, intentos:number}[]} historial
 */
function calcularDominio(historial) {
  let suma = 0;
  let pesos = 0;
  historial.slice(0, CONFIG.PESOS_HISTORIAL.length).forEach((sesion, i) => {
    const origen = CONFIG.PESO_ORIGEN[sesion.origen] ?? 1;
    const evidencia = acotar(sesion.intentos / CONFIG.INTENTOS_EVIDENCIA_COMPLETA, 0, 1);
    const peso = CONFIG.PESOS_HISTORIAL[i] * origen * evidencia;
    suma += peso * sesion.puntaje;
    pesos += peso;
  });
  return pesos === 0 ? 0 : redondear(suma / pesos);
}

// ---------------------------------------------------------------------------
// 3. GRAFO DE CONOCIMIENTO
// ---------------------------------------------------------------------------
/** Comprueba que las aristas sean coherentes: nodos existentes, sin bucles y sin ciclos. Devuelve también un orden topológico. */
function validarGrafo(idsNodos, aristas) {
  const ids = new Set(idsNodos);
  const problemas = [];
  const grado = new Map(idsNodos.map((id) => [id, 0]));
  const hijos = new Map(idsNodos.map((id) => [id, []]));
  for (const a of aristas) {
    if (!ids.has(a.id_nodo) || !ids.has(a.id_nodo_requerido)) { problemas.push(`Arista con nodo inexistente: ${a.id_nodo_requerido} → ${a.id_nodo}`); continue; }
    if (a.id_nodo === a.id_nodo_requerido) { problemas.push(`El nodo ${a.id_nodo} se requiere a sí mismo`); continue; }
    grado.set(a.id_nodo, grado.get(a.id_nodo) + 1);
    hijos.get(a.id_nodo_requerido).push(a.id_nodo);
  }
  const cola = [...grado].filter(([, g]) => g === 0).map(([id]) => id).sort((x, y) => x - y);
  const orden = [];
  while (cola.length) {
    const id = cola.shift();
    orden.push(id);
    for (const h of hijos.get(id)) { grado.set(h, grado.get(h) - 1); if (grado.get(h) === 0) cola.push(h); }
  }
  if (orden.length !== idsNodos.length) problemas.push(`El grafo contiene un ciclo (nodos implicados: ${[...grado].filter(([, g]) => g > 0).map(([id]) => id).join(', ')})`);
  return { valido: problemas.length === 0, problemas, orden };
}

/** Prerrequisitos de un nodo con el dominio actual del estudiante en cada uno. */
function prerrequisitosDe(idNodo, aristas, progreso) {
  return aristas.filter((a) => a.id_nodo === idNodo).map((a) => {
    const dominioActual = progreso.get(a.id_nodo_requerido)?.dominio ?? 0;
    return { id_nodo: a.id_nodo_requerido, dominio_minimo: a.dominio_minimo, dominio_actual: dominioActual, cumplido: dominioActual >= a.dominio_minimo };
  });
}

/** Nodos hoy "Bloqueado" cuyos prerrequisitos ya cumplen su dominio mínimo (el desbloqueo es permanente: nunca se vuelve a bloquear). */
function calcularDesbloqueos(progreso, aristas) {
  const porNodo = new Map();
  for (const a of aristas) { if (!porNodo.has(a.id_nodo)) porNodo.set(a.id_nodo, []); porNodo.get(a.id_nodo).push(a); }
  const resultado = [];
  for (const [id, reqs] of porNodo) {
    if ((progreso.get(id)?.estado ?? ESTADOS.BLOQUEADO) !== ESTADOS.BLOQUEADO) continue;
    if (reqs.every((r) => (progreso.get(r.id_nodo_requerido)?.dominio ?? 0) >= r.dominio_minimo)) resultado.push(id);
  }
  return resultado.sort((x, y) => x - y);
}

// ---------------------------------------------------------------------------
// 4. RUTA DE APRENDIZAJE DINÁMICA
// ---------------------------------------------------------------------------
/**
 * Decide el siguiente paso tras evaluar un intento.
 *  - Dominado          → avanzar (se desbloquean los nodos hijos que ya cumplen sus prerrequisitos).
 *  - En proceso        → practicar más (o reforzar un prerrequisito débil, si lo hay).
 *  - Necesita refuerzo → inyectar como repaso el prerrequisito más débil; si no hay, repetir el propio nodo.
 */
function decidirRuta({ idNodo, dominio, prerrequisitos, desbloqueados }) {
  const indicador = clasificarDominio(dominio);
  const debiles = prerrequisitos.filter((p) => p.dominio_actual < p.dominio_minimo).sort((a, b) => a.dominio_actual - b.dominio_actual);

  if (indicador === INDICADORES.DOMINADO) {
    return { indicador, accion: ACCIONES.AVANZAR, idNodoRefuerzo: null, codigo: desbloqueados.length ? 'desbloqueo' : 'dominado' };
  }
  if (debiles.length) {
    return { indicador, accion: ACCIONES.REFORZAR_PRERREQUISITO, idNodoRefuerzo: debiles[0].id_nodo, codigo: 'reforzar_prerrequisito' };
  }
  if (indicador === INDICADORES.EN_PROCESO) {
    return { indicador, accion: ACCIONES.PRACTICAR, idNodoRefuerzo: null, codigo: 'practicar' };
  }
  return { indicador, accion: ACCIONES.REPETIR, idNodoRefuerzo: idNodo, codigo: 'repetir' };
}

/** Siguiente paso recomendado: primero un repaso pendiente, luego mejorar un nodo "en proceso", luego el primer nodo disponible sin empezar. */
function recomendarSiguiente(nodos, refuerzos) {
  const porId = new Map(nodos.map((n) => [n.id_nodo, n]));
  if (refuerzos.length) {
    const r = refuerzos[0];
    const destino = porId.get(r.id_nodo_refuerzo);
    if (destino) return { id_nodo: destino.id_nodo, titulo: destino.titulo, motivo: 'refuerzo', origen_titulo: porId.get(r.id_nodo_origen)?.titulo ?? null };
  }
  const enProceso = nodos.find((n) => n.estado === ESTADOS.EN_PROCESO || n.estado === ESTADOS.REFUERZO);
  if (enProceso) return { id_nodo: enProceso.id_nodo, titulo: enProceso.titulo, motivo: 'mejorar', origen_titulo: null };
  const disponible = nodos.find((n) => n.estado === ESTADOS.DESBLOQUEADO);
  if (disponible) return { id_nodo: disponible.id_nodo, titulo: disponible.titulo, motivo: 'continuar', origen_titulo: null };
  return { id_nodo: null, titulo: null, motivo: 'completo', origen_titulo: null };
}

/** Arma la "foto" completa del grafo para un estudiante (es lo que consume el frontend). */
function armarRuta({ nodos, aristas, progreso, resumen, refuerzos }) {
  const lista = nodos.map((n) => {
    const p = progreso.get(n.id_nodo) || { dominio: 0, estado: ESTADOS.BLOQUEADO };
    const r = resumen.get(n.id_nodo) || { sesiones: 0, mejor_puntaje: 0 };
    const prerrequisitos = prerrequisitosDe(n.id_nodo, aristas, progreso).map((q) => ({ ...q, titulo: nodos.find((x) => x.id_nodo === q.id_nodo)?.titulo_nodo ?? '' }));
    return {
      id_nodo: n.id_nodo, titulo: n.titulo_nodo, descripcion: n.descripcion || '',
      estado: p.estado, dominio: p.dominio, estrellas: p.estado === ESTADOS.BLOQUEADO || r.sesiones === 0 ? 0 : estrellasDe(p.dominio),
      sesiones: r.sesiones, mejor_puntaje: r.mejor_puntaje, prerrequisitos
    };
  });
  const titulos = new Map(lista.map((n) => [n.id_nodo, n.titulo]));
  const pendientes = refuerzos.map((r) => ({
    id_nodo_origen: r.id_nodo_origen, id_nodo_refuerzo: r.id_nodo_refuerzo,
    titulo_origen: titulos.get(r.id_nodo_origen) ?? '', titulo_refuerzo: titulos.get(r.id_nodo_refuerzo) ?? '', motivo: r.motivo || ''
  }));
  return {
    nodos: lista, refuerzos: pendientes, siguiente: recomendarSiguiente(lista, refuerzos),
    config: { dominio_minimo: CONFIG.DOMINIO_MINIMO, umbral_refuerzo: CONFIG.UMBRAL_REFUERZO }
  };
}

module.exports = {
  CONFIG, INDICADORES, ESTADOS, ACCIONES,
  normalizarIntento, calcularPuntaje, clasificarDominio, estrellasDe, calcularDominio,
  validarGrafo, prerrequisitosDe, calcularDesbloqueos, decidirRuta, recomendarSiguiente, armarRuta
};
