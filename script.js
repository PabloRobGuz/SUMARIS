// ========== Referencias Generales ==========
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const btnIrRegistro = document.getElementById('ir-registro');
const btnIrLogin = document.getElementById('ir-login');
const pantallaAuth = document.getElementById('pantalla-auth');
const interfazPrincipal = document.getElementById('interfaz-principal');
const errorLogin = document.getElementById('error-login');
const nombreMostrado = document.getElementById('nombre-mostrado');
const saludoTitulo = document.getElementById('saludo-titulo');

const API_URL = 'http://localhost:3000/api';

// ========== Referencias del Test de Diagnóstico ==========
const pantallaTest = document.getElementById('pantalla-test');
const testInicio = document.getElementById('test-inicio');
const testPreguntas = document.getElementById('test-preguntas');
const testFinal = document.getElementById('test-final');
const textoProgreso = document.getElementById('texto-progreso');
const preguntaTexto = document.getElementById('pregunta-texto');
const preguntaEmoji = document.getElementById('pregunta-emoji');
const preguntaOpciones = document.getElementById('pregunta-opciones');
const btnSiguiente = document.getElementById('btn-siguiente');

// ========== Referencias de Configuración y Lecciones ==========
const pantallaConfig = document.getElementById('pantalla-configuracion');
const btnConfig = document.getElementById('btn-config');
const cerrarConfig = document.getElementById('cerrar-config');
const guardarConfig = document.getElementById('guardar-config');

const pantallaLecciones = document.getElementById('pantalla-lecciones');
const cerrarLecciones = document.getElementById('cerrar-lecciones');
const tituloCursoModal = document.getElementById('titulo-curso-modal');
const descCursoModal = document.getElementById('desc-curso-modal');
const contenedorListaLecciones = document.getElementById('contenedor-lista-lecciones');

// ========== Variables del Test ==========
let idUsuarioActual = null;
let indicePregunta = 0;
let puntosTest = 0;
let opcionSeleccionada = null;

const preguntas = [
  { texto: "Ana tenía 90 canicas y regaló 35. ¿Cuántas le quedan?", emoji: "🟠", opciones: ["45", "55", "65", "50"], correcta: 1 },
  { texto: "Si cada caja tiene 6 lápices y hay 7 cajas. ¿Cuántos lápices hay en total?", emoji: "✏️", opciones: ["36", "42", "48", "13"], correcta: 1 },
  { texto: "Se reparten 48 dulces entre 6 niños por igual. ¿Cuántos dulces recibe cada uno?", emoji: "🍬", opciones: ["6", "7", "8", "9"], correcta: 2 },
  { texto: "¿Cuál fracción representa 'la mitad de una pizza'?", emoji: "🍕", opciones: ["1/4", "1/2", "3/4", "2/3"], correcta: 1 },
  { texto: "¿Cuántas caras tiene un cubo?", emoji: "🎲", opciones: ["4", "6", "8", "12"], correcta: 1 },
  { texto: "Un rectángulo mide 5 cm de largo y 3 cm de ancho. ¿Cuál es su área?", emoji: "📐", opciones: ["8 cm²", "15 cm²", "16 cm²", "10 cm²"], correcta: 1 }
];

// ========== Base de Datos de Cursos y sus 3 Lecciones con Contenido Real ==========
const cursosData = {
  sumas: {
    titulo: "➕ Curso de Sumas",
    descripcion: "Aprende a juntar cantidades paso a paso",
    lecciones: [
      { 
        id: 1, 
        titulo: "Lección 1: ¿Qué es sumar?", 
        teoria: "Sumar es juntar dos o más grupos de cosas para saber cuántas hay en total. Por ejemplo: si tienes 2 manzanas y te dan 3 manzanas más, las juntas y ahora tienes 5 manzanas.",
        reto: "¿Cuánto es 3 + 2?",
        opciones: ["4", "5", "6"],
        correcta: 1 
      },
      { 
        id: 2, 
        titulo: "Lección 2: Sumando con objetos", 
        teoria: "Podemos sumar cualquier cosa: juguetes, estrellas o dulces. El signo que usamos para sumar es la cruz (+), que significa 'añadir'.",
        reto: "Si tienes 4 caramelos y compras 4 más, ¿cuántos tienes?",
        opciones: ["7", "8", "9"],
        correcta: 1 
      },
      { 
        id: 3, 
        titulo: "Lección 3: Reto de sumas rápidas", 
        teoria: "¡Hora de practicar con números más grandes! Recuerda sumar primero las unidades y luego las decenas si es necesario.",
        reto: "Resuelve: 15 + 10 =",
        opciones: ["20", "25", "30"],
        correcta: 1 
      }
    ]
  },
  restas: {
    titulo: "➖ Curso de Restas",
    descripcion: "Descubre cómo quitar y encontrar la diferencia",
    lecciones: [
      { 
        id: 1, 
        titulo: "Lección 1: ¿Qué es restar?", 
        teoria: "Restar es quitarle una cantidad a otra. Si tienes 5 globos y se te rompen 2, restamos para saber cuántos te quedan sanos.",
        reto: "Si tienes 5 globos y se rompen 2, ¿cuántos quedan?",
        opciones: ["2", "3", "4"],
        correcta: 1 
      },
      { 
        id: 2, 
        titulo: "Lección 2: Restas cotidianas", 
        teoria: "El signo de la resta es una rayita (-) que llamamos 'menos'. Significa lo que se va o se consume.",
        reto: "Tienes 8 colores y regalas 3, ¿cuántos te quedan?",
        opciones: ["5", "6", "4"],
        correcta: 0 
      },
      { 
        id: 3, 
        titulo: "Lección 3: Desafío de restas", 
        teoria: "¡Excelente! Vamos a practicar con un reto final de sustracción.",
        reto: "Resuelve: 20 - 7 =",
        opciones: ["12", "13", "15"],
        correcta: 1 
      }
    ]
  },
  multiplicaciones: {
    titulo: "✖️ Multiplicaciones",
    descripcion: "Domina las sumas repetidas de forma divertida",
    lecciones: [
      { 
        id: 1, 
        titulo: "Lección 1: Sumas repetidas", 
        teoria: "Multiplicar es una forma rápida de sumar el mismo número varias veces. En vez de decir 2 + 2 + 2, decimos 3 veces 2.",
        reto: "¿Cuánto es 3 veces el número 4 (3 x 4)?",
        opciones: ["10", "12", "14"],
        correcta: 1 
      },
      { 
        id: 2, 
        titulo: "Lección 2: Tablas del 2", 
        teoria: "La tabla del 2 es simplemente sumar el número por sí mismo (el doble). 2 x 3 es lo mismo que 2 + 2 + 2.",
        reto: "Resuelve: 2 x 5 =",
        opciones: ["8", "10", "12"],
        correcta: 1 
      },
      { 
        id: 3, 
        titulo: "Lección 3: Super Quiz Multiplicador", 
        teoria: "¡Estás listo para un reto mayor de multiplicación!",
        reto: "Resuelve: 5 x 4 =",
        opciones: ["15", "20", "25"],
        correcta: 1 
      }
    ]
  }
};

// ========== Cambiar entre login y registro ==========
btnIrRegistro.addEventListener('click', () => {
  formLogin.classList.remove('activa');
  formRegistro.classList.add('activa');
  document.body.classList.add('modo-registro');
});

btnIrLogin.addEventListener('click', () => {
  formRegistro.classList.remove('activa');
  formLogin.classList.add('activa');
  document.body.classList.remove('modo-registro');
});

// ========== Login con Base de Datos ==========
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('correo-login').value.trim();
  const contrasena = document.getElementById('contrasena-login').value;

  try {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    const resultado = await respuesta.json();

    if (respuesta.ok) {
      errorLogin.classList.remove('visible');
      idUsuarioActual = resultado.id_usuario;
      entrarAlSistema(resultado.nombre_usuario);

      if (!resultado.test_completado) {
        pantallaTest.classList.add('visible');
        mostrarPantallaTest('test-inicio');
      }
    } else {
      errorLogin.textContent = resultado.mensaje || 'Correo o contraseña incorrectos';
      activarErrorLogin();
    }
  } catch (error) {
    errorLogin.textContent = 'No se pudo conectar con el servidor';
    activarErrorLogin();
  }
});

function activarErrorLogin() {
  errorLogin.classList.add('visible');
  errorLogin.style.animation = 'none';
  void errorLogin.offsetWidth;
  errorLogin.style.animation = '';
  formLogin.style.animation = 'none';
  void formLogin.offsetWidth;
  formLogin.style.animation = 'sacudir 0.5s ease';
  setTimeout(() => { formLogin.style.animation = ''; }, 600);
}

// ========== Registro con Base de Datos ==========
formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('correo-registro').value.trim();
  const edad = document.getElementById('edad-registro').value;
  const pass = document.getElementById('contrasena-registro').value;
  const confirmar = document.getElementById('confirmar-contrasena').value;

  if (pass !== confirmar) {
    mostrarToast('Las contraseñas no coinciden.');
    return;
  }

  const nombre_usuario = correo.split('@')[0];
  try {
    const respuesta = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_usuario, correo, contrasena: pass, edad })
    });
    const resultado = await respuesta.json();
    if (respuesta.ok) {
      mostrarToast('¡Cuenta creada con éxito! Ya puedes iniciar sesión 🎉');
      formRegistro.reset();
      formRegistro.classList.remove('activa');
      formLogin.classList.add('activa');
      document.body.classList.remove('modo-registro');
    } else {
      mostrarToast(resultado.mensaje || 'No se pudo registrar.');
    }
  } catch (error) {
    mostrarToast('No se pudo conectar con el servidor.');
  }
});

// ========== Función para entrar al sistema ==========
function entrarAlSistema(nombre) {
  pantallaAuth.style.display = 'none';
  interfazPrincipal.classList.add('visible');
  nombreMostrado.textContent = nombre;
  saludoTitulo.textContent = `¡Hola de nuevo, ${nombre}!`;
}

// ========== Utilidades: almacenamiento, ajustes, avisos y sonido ==========
const guardar = {
  leer(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch { return def; } },
  escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

let ajustes = { tema: 'claro', audio: true, contraste: false, ...guardar.leer('sumaris-ajustes', {}) };

function aplicarAjustes() {
  document.body.classList.toggle('tema-oscuro', ajustes.tema === 'oscuro');
  document.body.classList.toggle('alto-contraste', !!ajustes.contraste);
}
aplicarAjustes();

let temporizadorToast;
function mostrarToast(mensaje) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.classList.add('visible');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => toast.classList.remove('visible'), 2600);
}

let audioCtx;
function sonido(tipo) {
  if (!ajustes.audio) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { ok: [660, 880], mal: [220, 160], fin: [523, 659, 784, 1046] }[tipo];
    notas.forEach((freq, i) => {
      const t = audioCtx.currentTime + i * 0.12;
      const osc = audioCtx.createOscillator();
      const vol = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      vol.gain.setValueAtTime(0.15, t);
      vol.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(vol);
      vol.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch { /* el navegador bloqueó el audio */ }
}

// ========== Progreso por usuario ==========
const claveProgreso = () => `sumaris-progreso-${idUsuarioActual ?? 'invitado'}`;
const leccionesCompletadas = (curso) => guardar.leer(claveProgreso(), {})[curso] || 0;
function marcarCompletada(curso, indice) {
  const progreso = guardar.leer(claveProgreso(), {});
  progreso[curso] = Math.max(progreso[curso] || 0, indice + 1);
  guardar.escribir(claveProgreso(), progreso);
}

// ========== Cerrar sesión ==========
document.getElementById('btn-salir').addEventListener('click', () => {
  cerrarLeccion(false);
  pantallaLecciones.classList.remove('visible');
  pantallaConfig.classList.remove('visible');
  interfazPrincipal.classList.remove('visible');
  pantallaAuth.style.display = 'flex';
  formLogin.reset();
  errorLogin.classList.remove('visible');
  pantallaTest.classList.remove('visible');
  idUsuarioActual = null;
});

// ========== Configuración ==========
const selectTema = document.getElementById('select-tema');
const checkAudio = document.getElementById('check-audio');
const checkContraste = document.getElementById('check-accesibilidad');

btnConfig.addEventListener('click', () => {
  selectTema.value = ajustes.tema;
  checkAudio.checked = ajustes.audio;
  checkContraste.checked = ajustes.contraste;
  pantallaConfig.classList.add('visible');
});
cerrarConfig.addEventListener('click', () => pantallaConfig.classList.remove('visible'));

// El tema se previsualiza al instante; se conserva al pulsar "Guardar Cambios"
selectTema.addEventListener('change', () => {
  document.body.classList.toggle('tema-oscuro', selectTema.value === 'oscuro');
});

guardarConfig.addEventListener('click', () => {
  ajustes = { tema: selectTema.value, audio: checkAudio.checked, contraste: checkContraste.checked };
  guardar.escribir('sumaris-ajustes', ajustes);
  aplicarAjustes();
  pantallaConfig.classList.remove('visible');
  mostrarToast('¡Configuración guardada!');
});

// NUEVO: Previsualizar el alto contraste al instante mientras se ajusta
checkContraste.addEventListener('change', () => {
  document.body.classList.toggle('alto-contraste', checkContraste.checked);
});

guardarConfig.addEventListener('click', () => {
  ajustes = { tema: selectTema.value, audio: checkAudio.checked, contraste: checkContraste.checked };
  guardar.escribir('sumaris-ajustes', ajustes);
  aplicarAjustes();
  pantallaConfig.classList.remove('visible');
  mostrarToast('¡Configuración guardada!');
});

// Si se cierra sin guardar, se restaura el tema guardado
new MutationObserver(() => { if (!pantallaConfig.classList.contains('visible')) aplicarAjustes(); })
  .observe(pantallaConfig, { attributes: true, attributeFilter: ['class'] });

// ========== Contenido extra de las lecciones ==========
// Ejercicios adicionales por lección: [pregunta, opciones, índice de la correcta]
const ejerciciosExtra = {
  'sumas-1': [['¿Cuánto es 1 + 1?', ['2', '3', '1'], 0], ['Tienes 4 estrellas y ganas 1 más. ¿Cuántas tienes?', ['4', '6', '5'], 2]],
  'sumas-2': [['¿Qué signo usamos para sumar?', ['+', '-', 'x'], 0], ['2 juguetes + 6 juguetes =', ['8', '7', '9'], 0]],
  'sumas-3': [['12 + 7 =', ['18', '19', '20'], 1], ['20 + 20 =', ['30', '40', '50'], 1]],
  'restas-1': [['¿Cuánto es 6 - 1?', ['4', '5', '7'], 1], ['Tienes 9 galletas y te comes 4. ¿Cuántas quedan?', ['5', '6', '4'], 0]],
  'restas-2': [['¿Cómo se llama el signo "-"?', ['Más', 'Menos', 'Por'], 1], ['10 - 6 =', ['3', '5', '4'], 2]],
  'restas-3': [['18 - 9 =', ['9', '8', '10'], 0], ['30 - 10 =', ['10', '20', '30'], 1]],
  'multiplicaciones-1': [['2 + 2 + 2 es lo mismo que...', ['2 x 3', '3 x 3', '2 x 2'], 0], ['¿Cuánto es 2 x 4?', ['6', '8', '10'], 1]],
  'multiplicaciones-2': [['El doble de 6 es...', ['10', '12', '14'], 1], ['2 x 8 =', ['16', '14', '18'], 0]],
  'multiplicaciones-3': [['3 x 5 =', ['10', '15', '20'], 1], ['4 x 4 =', ['12', '16', '8'], 1]]
};

// Imagen de apoyo para la teoría y las preguntas de cada lección
const visuales = {
  'sumas-1': [
    '🍎🍎 &nbsp;+&nbsp; 🍎🍎🍎<br><small>Juntamos los dos grupos</small>',
    '⭐ &nbsp;+&nbsp; ⭐⭐⭐⭐⭐<br><small>Contemos todas las estrellas</small>'
  ],
  'sumas-2': [
    '🍬🍬🍬🍬 &nbsp;+&nbsp; 🍬🍬🍬🍬<br><small>Añadimos más caramelos</small>',
    '🎨🎨🎨 &nbsp;+&nbsp; 🎨🎨<br><small>Juntamos los colores</small>'
  ],
  'sumas-3': [
    '🔟 &nbsp;+&nbsp; 5️⃣<br><small>Suma de decenas y unidades</small>',
    '2️⃣0️⃣ &nbsp;+&nbsp; 1️⃣0️⃣<br><small>Agrupando cantidades mayores</small>'
  ],
  'restas-1': [
    '🎈🎈🎈🎈🎈<br>💥 &nbsp; Se revientan 2 &nbsp; 💥<br><small>¿Cuántos quedan sanos?</small>',
    '🐟🐟🐟🐟<br>🌊 &nbsp; Se escapan 2 &nbsp; 🌊<br><small>Descubre la diferencia</small>'
  ],
  'restas-2': [
    '🖍️🖍️🖍️🖍️🖍️🖍️🖍️<br>🎁 &nbsp; Regalas 3 &nbsp; 🎁<br><small>¿Cuántos conservas?</small>',
    '🍪🍪🍪🍪🍪🍪<br>👦 &nbsp; Te comes 2 &nbsp; 👦<br><small>Menos cantidad</small>'
  ],
  'restas-3': [
    '2️⃣0️⃣ &nbsp;➖&nbsp; 7️⃣<br><small>Sustracción avanzada</small>',
    '1️⃣5️⃣ &nbsp;➖&nbsp; 5️⃣<br><small>Quitando una parte</small>'
  ],
  'multiplicaciones-1': [
    '🟦🟦 &nbsp; 🟦🟦 &nbsp; 🟦🟦<br><small>3 grupos de 2 bloques</small>',
    '🟢🟢🟢 &nbsp; 🟢🟢🟢<br><small>2 grupos de 3 círculos</small>'
  ],
  'multiplicaciones-2': [
    '2️⃣ &nbsp;✖️&nbsp; 3️⃣<br><small>Suma repetida: 2 + 2 + 2</small>',
    '2️⃣ &nbsp;✖️&nbsp; 5️⃣<br><small>El doble de 5</small>'
  ],
  'multiplicaciones-3': [
    '5️⃣ &nbsp;✖️&nbsp; 4️⃣<br><small>Super multiplicador</small>',
    '3️⃣ &nbsp;✖️&nbsp; 4️⃣<br><small>Calculando filas y columnas</small>'
  ]
};

// ========== Abrir cursos y lista de lecciones ==========
let cursoActual = null;

document.querySelectorAll('.tarjeta-tema').forEach((tarjeta) => {
  tarjeta.setAttribute('role', 'button');
  tarjeta.tabIndex = 0;
  const abrir = () => {
    if (tarjeta.dataset.curso) abrirCurso(tarjeta.dataset.curso);
    else mostrarToast(`${tarjeta.dataset.tema} llegará muy pronto 🚀`);
  };
  tarjeta.addEventListener('click', abrir);
  tarjeta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
  });
});

function abrirCurso(clave) {
  cursoActual = clave;
  tituloCursoModal.textContent = cursosData[clave].titulo;
  descCursoModal.textContent = cursosData[clave].descripcion;
  renderizarListaLecciones();
  pantallaLecciones.classList.add('visible');
}

function renderizarListaLecciones() {
  const curso = cursosData[cursoActual];
  const hechas = leccionesCompletadas(cursoActual);
  contenedorListaLecciones.innerHTML = '';

  curso.lecciones.forEach((lec, i) => {
    const estado = i < hechas ? 'completada' : i === hechas ? 'actual' : 'bloqueada';
    const icono = { completada: '✔', actual: i + 1, bloqueada: '🔒' }[estado];
    const etiqueta = { completada: 'Repasar', actual: 'Empezar', bloqueada: 'Bloqueada' }[estado];

    const tarjeta = document.createElement('button');
    tarjeta.type = 'button';
    tarjeta.className = `tarjeta-leccion ${estado}`;
    tarjeta.innerHTML = `
      <span class="num-leccion">${icono}</span>
      <span class="info-leccion">
        <span class="tl-titulo">${lec.titulo}</span>
        <span class="tl-desc">${lec.teoria.split('. ')[0].replace(/\.$/, '')}.</span>
      </span>
      <span class="badge-leccion">${etiqueta}</span>`;
    tarjeta.addEventListener('click', () => {
      if (estado === 'bloqueada') {
        mostrarToast('Termina la lección anterior para desbloquearla 🔒');
        return;
      }
      abrirLeccion(cursoActual, i);
    });
    contenedorListaLecciones.appendChild(tarjeta);
  });
}

cerrarLecciones.addEventListener('click', () => pantallaLecciones.classList.remove('visible'));

// ============= Lección en ventana aparte  ================
const pantallaLeccion = document.getElementById('pantalla-leccion');
const leccionCuerpo = document.getElementById('leccion-cuerpo');
const leccionPie = document.getElementById('leccion-pie');
const leccionMensaje = document.getElementById('leccion-mensaje');
const leccionAccion = document.getElementById('leccion-accion');
const leccionRelleno = document.getElementById('leccion-progreso-relleno');
const leccionVidas = document.getElementById('leccion-vidas');
const VIDAS_MAX = 3;
let sesion = null;

const mezclar = (lista) => lista.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

function abrirLeccion(clave, indice) {
  const curso = cursosData[clave];
  const lec = curso.lecciones[indice];
  const id = `${clave}-${lec.id}`;
  const preguntas = [[lec.reto, lec.opciones, lec.correcta], ...(ejerciciosExtra[id] || [])]
    .map(([q, o, c]) => ({ q, o: o.map((t, i) => ({ t, ok: i === c })), fallada: false }));

  sesion = {
    clave, indice, lec, curso, visual: visuales[id] || '',
    cola: preguntas, total: preguntas.length, resueltas: 0,
    vidas: VIDAS_MAX, fase: 'teoria', opciones: [], seleccion: null, comprobado: false
  };
  pantallaLeccion.classList.add('visible');
  document.body.classList.add('leccion-abierta');
  pintarPaso();
}

//Función inteligente para decidir que gráfico mostrar
function obtenerVisualParaPregunta(q, claveCurso) {
  if (q.visual) {
    return `<div class="visual-leccion" aria-hidden="true" style="font-size: 2rem; line-height: 1.6; text-align: center; padding: 1rem;">${q.visual}</div>`;
  }

  const texto = q.q.toLowerCase();
  const numeros = texto.match(/\d+/g);
  
  if (!numeros || numeros.length === 0) return '';

  const n1 = parseInt(numeros[0]);
  const n2 = numeros[1] ? parseInt(numeros[1]) : null;

  // --- NUEVO: Diccionario inteligente de palabras clave a emojis ---
  const mapaEmojis = {
    'estrella': '⭐', 'estrellas': '⭐',
    'caramelo': '🍬', 'caramelos': '🍬', 'dulce': '🍬', 'dulces': '🍬',
    'galleta': '🍪', 'galletas': '🍪',
    'juguete': '🧸', 'juguetes': '🧸',
    'globo': '🎈', 'globos': '🎈',
    'color': '🖍️', 'colores': '🖍️', 'lápiz': '✏️', 'lápices': '✏️',
    'pez': '🐟', 'peces': '🐟',
    'manzana': '🍎', 'manzanas': '🍎'
  };

  // Buscamos si el texto contiene alguna de nuestras palabras clave
  let emoji = null;
  for (const [palabra, e] of Object.entries(mapaEmojis)) {
    if (texto.includes(palabra)) {
      emoji = e;
      break; // Encontramos el objeto específico, detenemos la búsqueda
    }
  }

  // Si no encontró ninguna palabra específica, usamos un emoji por defecto según el curso
  if (!emoji) {
    if (claveCurso.includes('restas')) emoji = '🎈';
    else if (claveCurso.includes('multiplicaciones')) emoji = '🟦';
    else emoji = '🍎';
  }

  // --- CASO SUMAS ---
  if (claveCurso.includes('sumas') || texto.includes('más') || texto.includes('+') || texto.includes('juntas') || texto.includes('ganas')) {
    if (n2 !== null) {
      const cant1 = Math.min(n1, 15);
      const cant2 = Math.min(n2, 15);
      return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
                ${emoji.repeat(cant1)} &nbsp;+&nbsp; ${emoji.repeat(cant2)}
                <br><small style="font-size: 0.9rem; color: var(--texto-secundario);">Juntamos ${n1} y ${n2}</small>
              </div>`;
    }
  }

  // --- CASO RESTAS ---
  if (claveCurso.includes('restas') || texto.includes('quedan') || texto.includes('-') || texto.includes('rompen') || texto.includes('comes') || texto.themes || texto.includes('regalas')) {
    if (n2 !== null) {
      const cant1 = Math.min(n1, 15);
      const cant2 = Math.min(n2, 15);
      return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
                ${emoji.repeat(cant1)}
                <br><small style="font-size: 0.9rem; color: var(--texto-secundario);">De ${n1}, quitamos ${n2}</small>
              </div>`;
    }
  }

  // --- CASO MULTIPLICACIONES ---
  if (claveCurso.includes('multiplicaciones') || texto.includes('x') || texto.includes('veces') || texto.includes('doble')) {
    if (texto.includes('doble de') && n1) {
      return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
                ${emoji.repeat(Math.min(n1, 10))} &nbsp;y&nbsp; ${emoji.repeat(Math.min(n1, 10))}
                <br><small style="font-size: 0.9rem; color: var(--texto-secundario);">Dos veces el número ${n1}</small>
              </div>`;
    }
    if (n1 && n2) {
      return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
                ${(emoji.repeat(Math.min(n2, 8)) + '<br>').repeat(Math.min(n1, 5))}
                <small style="font-size: 0.9rem; color: var(--texto-secundario);">${n1} grupos de ${n2}</small>
              </div>`;
    }
  }

  return '';
}

function pintarVidas() {
  leccionVidas.innerHTML = Array.from({ length: VIDAS_MAX }, (_, i) =>
    `<span class="${i < sesion.vidas ? '' : 'perdida'}">❤️</span>`).join('');
  leccionVidas.setAttribute('aria-label', `${sesion.vidas} vidas`);
}

function pintarBarra() {
  const pct = Math.round((sesion.resueltas / sesion.total) * 100);
  leccionRelleno.style.width = `${pct}%`;
  leccionRelleno.parentElement.setAttribute('aria-valuenow', pct);
}

function configurarPie(clase, mensaje, textoBoton, deshabilitado) {
  leccionPie.className = `leccion-pie ${clase}`;
  leccionMensaje.innerHTML = mensaje;
  leccionAccion.textContent = textoBoton;
  leccionAccion.disabled = !!deshabilitado;
  leccionAccion.focus({ preventScroll: true });
}

function pintarPaso() {
  const s = sesion;
  pintarVidas();
  pintarBarra();

  if (s.fase === 'teoria') {
    leccionCuerpo.innerHTML = `
      <div class="paso paso-teoria">
        <h2>${s.lec.titulo}</h2>
        <p class="texto-teoria">${s.lec.teoria}</p>
      </div>`;
    configurarPie('', '', '¡Entendido!');
    return;
  }

  const q = s.cola[0];
  s.opciones = mezclar(q.o);
  s.seleccion = null;
  s.comprobado = false;

  // Declaramos visualHTML una sola vez usando nuestro enfoque híbrido
  const visualHTML = obtenerVisualParaPregunta(q, s.clave);

  leccionCuerpo.innerHTML = `
    <div class="paso">
      <h2>${q.q}</h2>
      ${visualHTML}
      <div class="opciones-leccion" role="group" aria-label="Respuestas"></div>
    </div>`;

  const contenedor = leccionCuerpo.querySelector('.opciones-leccion');
  s.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion opcion-leccion';
    btn.innerHTML = `<span class="atajo">${i + 1}</span>${op.t}`;
    btn.addEventListener('click', () => seleccionarOpcion(i));
    contenedor.appendChild(btn);
  });
  configurarPie('', '', 'Comprobar', true);
}

function seleccionarOpcion(i) {
  if (!sesion || sesion.comprobado || sesion.fase !== 'pregunta') return;
  sesion.seleccion = i;
  leccionCuerpo.querySelectorAll('.opcion-leccion').forEach((b, j) => {
    b.classList.toggle('seleccionada', j === i);
    b.setAttribute('aria-pressed', j === i);
  });
  leccionAccion.disabled = false;
}

async function comprobarRespuesta() {
  const s = sesion;
  const q = s.cola[0];
  const botones = leccionCuerpo.querySelectorAll('.opcion-leccion');
  const acierto = s.opciones[s.seleccion].ok;
  s.ultimoAcierto = acierto;
  s.comprobado = true;

  // 1. Enviar el intento al Backend para que el motor analice el rendimiento
  let instruccionBackend = "avanzar";
  try {
    const respuesta = await fetch(`${API_URL}/registrar-intento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: idUsuarioActual || 1, // Usa el ID del usuario logueado o un valor por defecto si es invitado
        id_nodo: s.lec.id,             // ID de la lección actual
        es_correcto: acierto,
        tiempo_respuesta: 5            // Puedes calcular el tiempo real o mandar un estimado
      })
    });
    const resultado = await respuesta.json();
    if (respuesta.ok) {
      instruccionBackend = resultado.accion_sugerida;
      // Si el backend detecta acumulación de errores, podemos notificarlo visualmente o activar ayudas
      if (resultado.requiere_apoyo) {
        console.log("El motor adaptativo sugirió activar una ruta de rescate o pista.");
      }
    }
  } catch (error) {
    console.error('Error al conectar con el backend para registrar el intento:', error);
  }

  // 2. Comportamiento visual en la interfaz según el resultado
  botones.forEach((b, j) => {
    b.disabled = true;
    if (s.opciones[j].ok) b.classList.add('correcta');
    else if (j === s.seleccion) b.classList.add('incorrecta');
  });

  if (acierto) {
    sonido('ok');
    s.resueltas++;
    configurarPie('ok', '<strong>¡Correcto! 🎉</strong>', 'Continuar');
  } else {
    sonido('mal');
    s.vidas--;
    q.fallada = true;
    const buena = s.opciones.find(o => o.ok).t;
    
    // Si el backend indicó que requiere apoyo por múltiples errores, mostramos una pista extra en el mensaje
    let mensajeError = `<strong>¡Casi!</strong><span>La respuesta correcta es: ${buena}</span>`;
    if (instruccionBackend === "activar_pista_o_rescate") {
      mensajeError += `<br><small style="color: #ff006e; font-weight: bold;">💡 Pista del sistema: ¡Lee con atención la teoría de arriba antes de reintentar!</small>`;
    }

    configurarPie('mal', mensajeError, 'Continuar');
  }
  
  pintarVidas();
  pintarBarra();
}

function continuarLeccion() {
  const s = sesion;
  const q = s.cola.shift();
  if (!s.ultimoAcierto) s.cola.push(q); // las falladas se repiten al final
  if (s.vidas <= 0) return mostrarSinVidas();
  if (s.cola.length === 0) return mostrarFinal();
  pintarPaso();
}

function mostrarSinVidas() {
  leccionRelleno.style.width = '0%';
  leccionCuerpo.innerHTML = `
    <div class="paso paso-final">
      <div class="emoji-final">💔</div>
      <h2>¡Te quedaste sin vidas!</h2>
      <p class="texto-teoria">No pasa nada, equivocarse es parte de aprender. Repasa la teoría e inténtalo otra vez.</p>
    </div>`;
  pintarVidas();
  configurarPie('mal', '', 'Intentar de nuevo');
  sesion.fase = 'sin-vidas';
}

function mostrarFinal() {
  const s = sesion;
  const errores = VIDAS_MAX - s.vidas;
  const estrellas = errores === 0 ? 3 : errores === 1 ? 2 : 1;
  marcarCompletada(s.clave, s.indice);
  sonido('fin');
  s.fase = 'final';
  pintarBarra();
  leccionRelleno.style.width = '100%';
  const haySiguiente = s.indice < s.curso.lecciones.length - 1;
  leccionCuerpo.innerHTML = `
    <div class="paso paso-final">
      <div class="estrellas" aria-label="${estrellas} de 3 estrellas">${'⭐'.repeat(estrellas)}${'☆'.repeat(3 - estrellas)}</div>
      <h2>¡Lección completada!</h2>
      <p class="texto-teoria">${errores === 0 ? '¡Sin ningún error! Eres una estrella.' : `Terminaste con ${s.vidas} ${s.vidas === 1 ? 'vida' : 'vidas'}. ¡Sigue así!`}</p>
    </div>`;
  configurarPie('ok', '', haySiguiente ? 'Siguiente lección' : 'Volver al curso');
}

leccionAccion.addEventListener('click', () => {
  const s = sesion;
  if (!s) return;
  if (s.fase === 'teoria') { s.fase = 'pregunta'; pintarPaso(); }
  else if (s.fase === 'pregunta' && !s.comprobado) comprobarRespuesta();
  else if (s.fase === 'pregunta') continuarLeccion();
  else if (s.fase === 'sin-vidas') abrirLeccion(s.clave, s.indice);
  else if (s.fase === 'final') {
    const { clave, indice, curso } = s;
    cerrarLeccion(false);
    if (indice < curso.lecciones.length - 1) abrirLeccion(clave, indice + 1);
  }
});

function cerrarLeccion(confirmar = true) {
  if (!sesion) return;
  const enCurso = sesion.fase === 'pregunta' && sesion.resueltas > 0;
  if (confirmar && enCurso && !window.confirm('¿Seguro que quieres salir? Perderás el avance de esta lección.')) return;
  sesion = null;
  pantallaLeccion.classList.remove('visible');
  document.body.classList.remove('leccion-abierta');
  if (cursoActual) renderizarListaLecciones();
}

document.getElementById('leccion-cerrar').addEventListener('click', () => cerrarLeccion(true));

// ========== Atajos de teclado ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (sesion) cerrarLeccion(true);
    else if (pantallaConfig.classList.contains('visible')) pantallaConfig.classList.remove('visible');
    else pantallaLecciones.classList.remove('visible');
    return;
  }
  if (!sesion) return;
  if (sesion.fase === 'pregunta' && /^[1-9]$/.test(e.key) && Number(e.key) <= sesion.opciones.length) {
    seleccionarOpcion(Number(e.key) - 1);
  } else if (e.key === 'Enter' && document.activeElement !== leccionAccion && !leccionAccion.disabled) {
    e.preventDefault();
    leccionAccion.click();
  }
});

// Términos y condiciones (enlace aún sin página)
document.querySelector('.terminos a').addEventListener('click', (e) => {
  e.preventDefault();
  mostrarToast('Los términos y condiciones estarán disponibles pronto 📄');
});

// ========== Lógica del Test de Diagnóstico ==========
function mostrarPantallaTest(idPantalla) {
  document.querySelectorAll('.test-pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(idPantalla).classList.add('activa');
}

document.getElementById('btn-empezar-cero').addEventListener('click', async () => {
  await guardarResultadoTest(0);
  mostrarPantallaTest('test-final');
});

document.getElementById('btn-conocer-nivel').addEventListener('click', () => {
  indicePregunta = 0;
  puntosTest = 0;
  mostrarPantallaTest('test-preguntas');
  cargarPregunta();
});

function cargarPregunta() {
  const p = preguntas[indicePregunta];
  textoProgreso.textContent = `Pregunta ${indicePregunta + 1}`;
  preguntaTexto.textContent = p.texto;
  preguntaEmoji.textContent = p.emoji;
  preguntaOpciones.innerHTML = '';
  opcionSeleccionada = null;
  btnSiguiente.disabled = true;

  p.opciones.forEach((opcion, index) => {
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.textContent = `${String.fromCharCode(97 + index)}) ${opcion}`;
    btn.addEventListener('click', () => {
      preguntaOpciones.querySelectorAll('.opcion').forEach(b => b.classList.remove('seleccionada'));
      btn.classList.add('seleccionada');
      opcionSeleccionada = index;
      btnSiguiente.disabled = false;
    });
    preguntaOpciones.appendChild(btn);
  });
}

btnSiguiente.addEventListener('click', () => {
  if (opcionSeleccionada === null) return;
  if (opcionSeleccionada === preguntas[indicePregunta].correcta) puntosTest++;
  indicePregunta++;

  if (indicePregunta < preguntas.length) {
    cargarPregunta();
  } else {
    guardarResultadoTest(puntosTest);
    mostrarPantallaTest('test-final');
  }
});

async function guardarResultadoTest(puntos) {
  try {
    await fetch(`${API_URL}/completar-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: idUsuarioActual, puntos })
    });
  } catch (error) {
    console.error('Error al guardar el test:', error);
  }
}

document.getElementById('btn-ir-temas').addEventListener('click', () => {
  pantallaTest.classList.remove('visible');
});

document.getElementById('correo-login').focus();