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
  if (saludoTitulo) saludoTitulo.textContent = `¡Hola de nuevo, ${nombre}!`;
  actualizarPracticaMixta();
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
  ajustes = { tema: 'claro', audio: true, contraste: false };
});

// ========== Configuración ==========
const botonesTema = document.querySelectorAll('.btn-tema');
let temaSeleccionado = 'claro';

function marcarTemaSeleccionado(tema) {
  temaSeleccionado = tema;
  botonesTema.forEach(b => {
    const activo = b.dataset.tema === tema;
    b.classList.toggle('activa', activo);
    b.setAttribute('aria-pressed', activo);
  });
}

const checkAudio = document.getElementById('check-audio');
const checkContraste = document.getElementById('check-accesibilidad');

btnConfig.addEventListener('click', () => {
  marcarTemaSeleccionado(ajustes.tema);
  checkAudio.checked = ajustes.audio;
  checkContraste.checked = ajustes.contraste;
  pantallaConfig.classList.add('visible');
});
cerrarConfig.addEventListener('click', () => pantallaConfig.classList.remove('visible'));

// El tema se previsualiza al instante; se conserva al pulsar "Guardar Cambios"
botonesTema.forEach(btn => {
  btn.addEventListener('click', () => {
    marcarTemaSeleccionado(btn.dataset.tema);
    document.body.classList.toggle('tema-oscuro', btn.dataset.tema === 'oscuro');
  });
});

guardarConfig.addEventListener('click', () => {
  ajustes = { tema: temaSeleccionado, audio: checkAudio.checked, contraste: checkContraste.checked };
  guardar.escribir('sumaris-ajustes', ajustes);
  aplicarAjustes();
  pantallaConfig.classList.remove('visible');
  mostrarToast('¡Configuración guardada!');
});

// NUEVO: Previsualizar el alto contraste al instante mientras se ajusta
checkContraste.addEventListener('change', () => {
  document.body.classList.toggle('alto-contraste', checkContraste.checked);
});

// Si se cierra sin guardar, se restaura el tema guardado
new MutationObserver(() => { if (!pantallaConfig.classList.contains('visible')) aplicarAjustes(); })
  .observe(pantallaConfig, { attributes: true, attributeFilter: ['class'] });

// ========== Contenido extra de las lecciones ==========
// Ejercicios adicionales por lección: [pregunta, opciones, índice de la correcta, pista]
// Cada pista orienta sobre el procedimiento sin revelar la respuesta.
const ejerciciosExtra = {
  'sumas-1': [
    ['¿Cuánto es 1 + 1?', ['2', '3', '1'], 0, 'Imagina que levantas un dedo y te muestran otro más. Cuenta cuántos dedos hay ahora.'],
    ['Tienes 4 estrellas y ganas 1 más. ¿Cuántas tienes?', ['4', '6', '5'], 2, '«Ganas» significa que se añaden. Cuenta las 4 que tienes y avanza un paso más en la cuenta.']
  ],
  'sumas-2': [
    ['¿Qué signo usamos para sumar?', ['+', '-', 'x'], 0, 'Recuerda la palabra que acompaña a este signo en la teoría: «añadir». ¿Cuál de las opciones la representa?'],
    ['2 juguetes + 6 juguetes =', ['8', '7', '9'], 0, 'Empieza en el número mayor (6) y cuenta hacia adelante los juguetes que faltan por añadir.']
  ],
  'sumas-3': [
    ['12 + 7 =', ['18', '19', '20'], 1, 'Suma primero las unidades (2 y 7). Si no llegan a 10, solo añade ese resultado a la decena que ya tienes.'],
    ['20 + 20 =', ['30', '40', '50'], 1, 'Son dos decenas completas: suma las decenas (2 + 2) y recuerda que cada decena vale 10.']
  ],
  'restas-1': [
    ['¿Cuánto es 6 - 1?', ['4', '5', '7'], 1, 'Cuenta hacia atrás desde el 6, dando tantos pasos como indica el número que se quita.'],
    ['Tienes 9 galletas y te comes 4. ¿Cuántas quedan?', ['5', '6', '4'], 0, '«Te comes» significa que se quitan. Parte de 9 y retrocede una vez por cada galleta que comes.']
  ],
  'restas-2': [
    ['¿Cómo se llama el signo "-"?', ['Más', 'Menos', 'Por'], 1, 'Es el signo contrario a «más»: indica lo que se va o se consume.'],
    ['10 - 6 =', ['3', '5', '4'], 2, 'Cuenta hacia atrás desde 10, dando 6 pasos. Para comprobar, suma lo que te queda y el 6: debe darte 10.']
  ],
  'restas-3': [
    ['18 - 9 =', ['9', '8', '10'], 0, 'Quita primero 8 para llegar a 10 y después quita lo que falta del 9.'],
    ['30 - 10 =', ['10', '20', '30'], 1, 'Son decenas completas: resta solo las decenas, 3 decenas menos 1 decena.']
  ],
  'multiplicaciones-1': [
    ['2 + 2 + 2 es lo mismo que...', ['2 x 3', '3 x 3', '2 x 2'], 0, 'Fíjate en qué número se repite y cuántas veces aparece. La multiplicación junta esas dos cosas.'],
    ['¿Cuánto es 2 x 4?', ['6', '8', '10'], 1, 'Es el 2 repetido 4 veces (o el 4 repetido 2 veces). Suma el número que se repite las veces que indica el otro.']
  ],
  'multiplicaciones-2': [
    ['El doble de 6 es...', ['10', '12', '14'], 1, 'El doble de un número es ese número sumado consigo mismo, es decir, dos veces el número.'],
    ['2 x 8 =', ['16', '14', '18'], 0, 'Salta de 2 en 2 y da ocho saltos. Puedes ayudarte con los dedos para llevar la cuenta de los saltos.']
  ],
  'multiplicaciones-3': [
    ['3 x 5 =', ['10', '15', '20'], 1, 'Salta de 5 en 5 tres veces. Recuerda que los resultados de la tabla del 5 terminan en 0 o en 5.'],
    ['4 x 4 =', ['12', '16', '8'], 1, 'Imagina una cuadrícula de 4 filas con 4 cuadritos en cada una y suma el contenido de las filas.']
  ]
};

// Pista del reto principal de cada lección (misma clave que ejerciciosExtra)
const pistasReto = {
  'sumas-1': 'Empieza en el 3 y cuenta hacia adelante tantos números como indica el segundo sumando.',
  'sumas-2': 'Tienes dos grupos iguales de caramelos. Cuenta uno y sigue contando con el otro, sin empezar de nuevo.',
  'sumas-3': 'Sumar 10 solo cambia las decenas; las unidades se quedan igual. Mira cuántas decenas tiene el 15.',
  'restas-1': 'Parte de los 5 globos y aparta los que se rompen. Cuenta cuántos globos sanos sobran.',
  'restas-2': 'Parte de los 8 colores y quita los que regalas. Cuenta los que te quedan.',
  'restas-3': 'Separa el 7 en dos partes más fáciles y quítalas de 20 una después de otra.',
  'multiplicaciones-1': 'Imagina 4 + 4 + 4: el 4 se repite tantas veces como indica la pregunta. Suma de dos en dos.',
  'multiplicaciones-2': 'Multiplicar por 2 es buscar el doble: suma el 5 consigo mismo.',
  'multiplicaciones-3': 'Piensa en 5 grupos de 4 (o 4 grupos de 5) y suma de forma repetida, o salta de 5 en 5 cuatro veces.'
};

// Ejercicios interactivos por lección (se intercalan con las preguntas de opción múltiple)
//  escrita:    { q, respuestas:[...], numerico, pista }
//  relacionar: { q, pares:[[izquierda, derecha], ...], pista }
//  arrastrar:  { q, zonas:[{id, titulo}], fichas:[{t, zona}], pista }
//  ordenar:    { q, pasos:[...en el orden correcto], pista }
const ejerciciosInteractivos = {
  'sumas-1': [
    { tipo: 'escrita', q: 'Escribe cuánto es 2 + 4.', respuestas: ['6', 'seis'], numerico: true,
      pista: 'Empieza por el número mayor, el 4, y cuenta hacia adelante tantos pasos como indica el otro número.' },
    { tipo: 'relacionar', q: 'Une cada suma con su total.',
      pares: [['2 + 1', '3'], ['2 + 2', '4'], ['1 + 4', '5'], ['4 + 2', '6']],
      pista: 'Calcula cada suma contando hacia adelante desde el primer número y busca ese total en la otra columna.' },
    { tipo: 'arrastrar', q: 'Arrastra cada suma a la caja con su total.',
      zonas: [{ id: 'a', titulo: 'El total es 4' }, { id: 'b', titulo: 'El total es 6' }],
      fichas: [{ t: '2 + 2', zona: 'a' }, { t: '1 + 3', zona: 'a' }, { t: '3 + 1', zona: 'a' },
               { t: '3 + 3', zona: 'b' }, { t: '5 + 1', zona: 'b' }, { t: '4 + 2', zona: 'b' }],
      pista: 'Calcula el total de cada suma. Si dos sumas usan los mismos números en distinto orden, dan el mismo total.' }
  ],
  'sumas-2': [
    { tipo: 'escrita', q: 'Tienes 5 juguetes y te regalan 3 más. ¿Cuántos juguetes tienes ahora?', respuestas: ['8', 'ocho'], numerico: true,
      pista: '«Te regalan» significa que se añaden. Piensa en la suma de los dos números de la historia y cuenta hacia adelante.' },
    { tipo: 'relacionar', q: 'Une cada historia con la suma que la representa.',
      pares: [['Tienes 2 galletas y te dan 3 más', '2 + 3'], ['Hay 4 globos y llega 1 más', '4 + 1'],
              ['Tienes 5 lápices y compras 2 más', '5 + 2'], ['Ves 3 pájaros y llegan 3 más', '3 + 3']],
      pista: 'En cada historia, el primer número es lo que ya hay y el segundo es lo que se añade. Escribe la suma en ese orden.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para convertir una historia en una suma.',
      pasos: ['Lee la historia y busca los objetos', 'Busca las palabras que avisan que se añade algo',
              'Escribe el primer número, el signo + y el segundo número', 'Calcula el total y escríbelo después del signo ='],
      pista: 'Primero hay que entender la historia; después se escribe la suma y, al final, se calcula el total.' }
  ],
  'sumas-3': [
    { tipo: 'escrita', q: 'Escribe el resultado de 24 + 13.', respuestas: ['37', 'treinta y siete'], numerico: true,
      pista: 'Separa 24 en 20 + 4 y 13 en 10 + 3. Suma por un lado las unidades, por otro las decenas, y junta los dos resultados.' },
    { tipo: 'arrastrar', q: 'Clasifica cada número: ¿es una decena completa o son unidades sueltas?',
      zonas: [{ id: 'd', titulo: 'Decenas completas' }, { id: 'u', titulo: 'Unidades sueltas' }],
      fichas: [{ t: '30', zona: 'd' }, { t: '7', zona: 'u' }, { t: '50', zona: 'd' },
               { t: '4', zona: 'u' }, { t: '10', zona: 'd' }, { t: '9', zona: 'u' }],
      pista: 'Una decena completa es un paquete de 10 (10, 20, 30...). Las unidades sueltas son los números menores que 10.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para resolver 15 + 10.',
      pasos: ['Separa cada número en decenas y unidades', 'Suma las unidades', 'Suma las decenas', 'Junta los dos resultados'],
      pista: 'Antes de sumar hay que separar los números; al final se juntan las dos sumas pequeñas.' }
  ],
  'restas-1': [
    { tipo: 'escrita', q: 'Tienes 7 globos y se van volando 3. ¿Cuántos globos te quedan?', respuestas: ['4', 'cuatro'], numerico: true,
      pista: 'Cuenta 7 globos, aparta 3 y cuenta los que sobran. También puedes contar hacia atrás 3 pasos desde el 7.' },
    { tipo: 'relacionar', q: 'Une cada resta con su resultado.',
      pares: [['4 - 1', '3'], ['6 - 2', '4'], ['7 - 2', '5'], ['9 - 3', '6']],
      pista: 'Calcula cada resta contando hacia atrás desde el primer número y busca el resultado en la otra columna.' },
    { tipo: 'arrastrar', q: 'Arrastra cada resta a la caja de lo que queda.',
      zonas: [{ id: 'a', titulo: 'Quedan 3' }, { id: 'b', titulo: 'Quedan 5' }],
      fichas: [{ t: '5 - 2', zona: 'a' }, { t: '4 - 1', zona: 'a' }, { t: '6 - 3', zona: 'a' },
               { t: '7 - 2', zona: 'b' }, { t: '9 - 4', zona: 'b' }, { t: '6 - 1', zona: 'b' }],
      pista: 'Resuelve cada resta antes de arrastrarla. Para comprobar, suma el resultado y lo que quitaste: debe darte el primer número.' }
  ],
  'restas-2': [
    { tipo: 'escrita', q: 'Hay 11 peces en la pecera y se llevan 4. ¿Cuántos peces quedan?', respuestas: ['7', 'siete'], numerico: true,
      pista: 'Identifica la cantidad del principio (11) y la que se quita. Resta en ese orden contando hacia atrás desde el 11.' },
    { tipo: 'relacionar', q: 'Une cada historia con la resta que la representa.',
      pares: [['Tienes 9 uvas y te comes 2', '9 - 2'], ['Hay 7 patos y se van 3', '7 - 3'],
              ['Tenías 6 galletas y regalas 4', '6 - 4'], ['Hay 10 globos y se rompen 5', '10 - 5']],
      pista: 'El primer número de cada historia es lo que había al principio. Las palabras «te comes», «se van», «regalas» y «se rompen» avisan de que se resta.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para convertir una historia en una resta.',
      pasos: ['Lee la historia y busca la cantidad del principio', 'Busca las palabras que avisan que algo se quita',
              'Escribe la cantidad del principio, el signo - y la que se quita', 'Calcula lo que queda y escríbelo después del signo ='],
      pista: 'Primero entiendes la historia, luego escribes la resta y, por último, calculas lo que queda.' }
  ],
  'restas-3': [
    { tipo: 'escrita', q: 'Escribe el resultado de 17 - 5.', respuestas: ['12', 'doce'], numerico: true,
      pista: 'Las unidades alcanzan para quitar 5 sin tocar la decena: resta primero las unidades (7 - 5) y conserva la decena.' },
    { tipo: 'arrastrar', q: 'Arrastra cada resta a la caja con su resultado.',
      zonas: [{ id: 'a', titulo: 'El resultado es 10' }, { id: 'b', titulo: 'El resultado es 20' }],
      fichas: [{ t: '20 - 10', zona: 'a' }, { t: '30 - 20', zona: 'a' }, { t: '15 - 5', zona: 'a' },
               { t: '30 - 10', zona: 'b' }, { t: '40 - 20', zona: 'b' }, { t: '25 - 5', zona: 'b' }],
      pista: 'Si quitas decenas completas, resta solo las decenas; si quitas justo las unidades, quedan las decenas. Resuelve cada resta antes de arrastrarla.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para resolver 20 - 7 quitando en partes.',
      pasos: ['Separa el 7 en 5 y 2', 'Quita 5 a 20 y quedan 15', 'Quita 2 a 15', 'Escribe el resultado final'],
      pista: 'Primero se separa el número que quitas; luego se quita una parte, después la otra y al final se anota el resultado.' }
  ],
  'multiplicaciones-1': [
    { tipo: 'escrita', q: 'Escribe el resultado de 3 + 3 + 3 + 3 + 3.', respuestas: ['15', 'quince'], numerico: true,
      pista: 'Cuenta cuántas veces se repite el 3 y salta de 3 en 3 ese número de veces.' },
    { tipo: 'relacionar', q: 'Une cada suma repetida con la frase que la describe.',
      pares: [['5 + 5', '2 veces el 5'], ['4 + 4 + 4', '3 veces el 4'], ['2 + 2 + 2 + 2', '4 veces el 2'], ['6 + 6 + 6', '3 veces el 6']],
      pista: 'En cada suma repetida, cuenta cuántas veces aparece el mismo número y busca la frase «_ veces el _» que coincide.' },
    { tipo: 'arrastrar', q: 'Arrastra cada suma a la caja según cuántas veces se repite su número.',
      zonas: [{ id: 'a', titulo: 'Se repite 3 veces' }, { id: 'b', titulo: 'Se repite 4 veces' }],
      fichas: [{ t: '5 + 5 + 5', zona: 'a' }, { t: '2 + 2 + 2', zona: 'a' }, { t: '4 + 4 + 4', zona: 'a' },
               { t: '3 + 3 + 3 + 3', zona: 'b' }, { t: '6 + 6 + 6 + 6', zona: 'b' }, { t: '2 + 2 + 2 + 2', zona: 'b' }],
      pista: 'Cuenta cuántas veces aparece el número en cada suma. No importa cuál sea el número, sino cuántas veces se repite.' }
  ],
  'multiplicaciones-2': [
    { tipo: 'escrita', q: 'Escribe el resultado de 2 x 9.', respuestas: ['18', 'dieciocho'], numerico: true,
      pista: 'Es el doble de 9: súmalo consigo mismo, o salta de 2 en 2 nueve veces.' },
    { tipo: 'relacionar', q: 'Une cada doble con su resultado.',
      pares: [['El doble de 3', '6'], ['El doble de 4', '8'], ['El doble de 5', '10'], ['El doble de 8', '16']],
      pista: 'Para cada número, súmalo consigo mismo (3 + 3, 4 + 4...) y busca el resultado en la otra columna.' },
    { tipo: 'ordenar', q: 'Ordena estas multiplicaciones de la tabla del 2, de la que da el resultado más pequeño a la que da el más grande.',
      pasos: ['2 x 1', '2 x 2', '2 x 3', '2 x 4', '2 x 5'],
      pista: 'Mira el segundo número: cada vez que aumenta en 1, el resultado crece de 2 en 2. Empieza por la que da el resultado menor.' }
  ],
  'multiplicaciones-3': [
    { tipo: 'escrita', q: 'Escribe el resultado de 3 x 6.', respuestas: ['18', 'dieciocho'], numerico: true,
      pista: 'Imagina 3 filas con 6 objetos en cada una y suma el contenido de las filas.' },
    { tipo: 'arrastrar', q: 'Arrastra cada multiplicación a la caja con su resultado.',
      zonas: [{ id: 'a', titulo: 'El resultado es 12' }, { id: 'b', titulo: 'El resultado es 20' }],
      fichas: [{ t: '3 x 4', zona: 'a' }, { t: '2 x 6', zona: 'a' }, { t: '4 x 3', zona: 'a' },
               { t: '5 x 4', zona: 'b' }, { t: '4 x 5', zona: 'b' }, { t: '2 x 10', zona: 'b' }],
      pista: 'Resuelve cada multiplicación con una suma repetida. Recuerda que cambiar el orden de los números no cambia el resultado.' },
    { tipo: 'relacionar', q: 'Une cada descripción de filas con su multiplicación.',
      pares: [['2 filas de 4', '2 x 4'], ['3 filas de 3', '3 x 3'], ['4 filas de 5', '4 x 5'], ['5 filas de 2', '5 x 2']],
      pista: 'El primer número indica cuántas filas hay y el segundo cuántos objetos tiene cada fila: se escribe «filas x objetos».' }
  ]
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

// ========== Teoría ampliada de cada lección ==========
const teoriaExtendida = {
  'sumas-1': [
    { t: 'Sumar es juntar', visual: true, p: ['@teoria',
      'Cada grupo que juntamos se llama sumando. El resultado final, es decir, el total, se llama suma.'] },
    { t: 'Paso a paso: sumar contando',
      pasos: ['Mira el primer grupo y cuenta cuántos hay. Ese número es tu punto de partida.',
              'Mira el segundo grupo: te dice cuántos pasos más debes avanzar.',
              'Sigue contando hacia adelante, un número por cada objeto del segundo grupo.',
              'El último número que dijiste es el total.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 4 + 3', visual: '🐥🐥🐥🐥 &nbsp;+&nbsp; 🐥🐥🐥',
        lineas: ['Empiezo en 4.', 'Avanzo tres pasos: 5, 6, 7.', 'El total es 7, así que 4 + 3 = 7.'] } },
    { t: 'Dos ideas que te ayudarán',
      p: ['El orden no cambia el total: 2 + 3 da lo mismo que 3 + 2. Por eso puedes empezar por el número que prefieras.',
          'Al sumar, el resultado nunca es menor que los números que juntas: tienes igual o más que al principio.'],
      tip: 'Si te cuesta contar, empieza por el número mayor y avanza con el menor. ¡Hay menos pasos que contar!' }
  ],
  'sumas-2': [
    { t: 'Podemos sumar cualquier cosa', visual: true, p: ['@teoria',
      'Una suma se escribe con tres partes: el primer número, el signo + y el segundo número. Después ponemos el signo = (igual) y el total. Por ejemplo, 6 + 1 = 7 se lee «seis más uno es igual a siete».'] },
    { t: 'De una historia a una suma',
      pasos: ['Lee la historia y busca los objetos de los que habla.',
              'Busca las palabras que avisan que se junta o se añade: «más», «compras», «ganas», «te regalan», «llegan».',
              'Escribe el primer número, el signo + y el segundo número.',
              'Calcula el total contando hacia adelante y escríbelo después del signo =.'],
      ejemplo: { titulo: 'Ejemplo resuelto', visual: '🦆🦆🦆🦆🦆🦆 &nbsp;+&nbsp; 🦆🦆🦆',
        lineas: ['Historia: «Hay 6 patos y llegan 3 más».', '«Llegan más» significa que se añaden, así que escribo 6 + 3.',
                 'Cuento desde 6: 7, 8, 9. Entonces 6 + 3 = 9.'] } },
    { t: 'Cuidado con lo que juntas',
      p: ['Solo podemos sumar cosas que se cuentan juntas: 3 gatos y 2 gatos son 5 gatos. El total siempre habla de la misma clase de objetos.',
          'Si una historia menciona un número que no se añade (por ejemplo, la edad de alguien), ese número no forma parte de la suma.'],
      tip: 'Antes de sumar pregúntate: ¿qué se está añadiendo? La respuesta te dice cuáles son los números de tu suma.' }
  ],
  'sumas-3': [
    { t: 'Decenas y unidades', visual: true, p: ['@teoria',
      'En un número de dos cifras, la cifra de la derecha son las unidades (objetos sueltos) y la de la izquierda son las decenas (paquetes de 10). Por ejemplo, 23 tiene 2 decenas y 3 unidades, o sea 20 + 3.'] },
    { t: 'Paso a paso: sumar en dos partes',
      pasos: ['Separa cada número en decenas y unidades.', 'Suma las unidades.', 'Suma las decenas.',
              'Junta los dos resultados para obtener el total.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 21 + 14', visual: '2️⃣1️⃣ &nbsp;➕&nbsp; 1️⃣4️⃣',
        lineas: ['21 = 20 + 1 y 14 = 10 + 4.', 'Unidades: 1 + 4 = 5.', 'Decenas: 20 + 10 = 30.', 'Junto los resultados: 30 + 5 = 35.'] } },
    { t: 'Cuando las unidades llegan a 10',
      p: ['Si al sumar las unidades te sale 10 o más, cambia 10 unidades por 1 decena y añádela a las decenas.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 18 + 5',
        lineas: ['Unidades: 8 + 5 = 13, que es 1 decena y 3 unidades.', 'Decenas: 10 + 10 = 20.', 'Total: 20 + 3 = 23.'] },
      tip: 'Sumar 10 a un número es fácil: solo cambia la cifra de las decenas y las unidades se quedan igual.' }
  ],
  'restas-1': [
    { t: 'Restar es quitar', visual: true, p: ['@teoria',
      'Al restar partimos de una cantidad, quitamos otra y lo que queda se llama resultado o diferencia.'] },
    { t: 'Paso a paso: restar quitando',
      pasos: ['Cuenta cuántos objetos hay al principio.', 'Fíjate cuántos se quitan, se van o se pierden.',
              'Aparta (o tacha) esos objetos.', 'Cuenta los que quedan: ese es el resultado.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 8 - 3', visual: '🦆🦆🦆🦆🦆🦆🦆🦆<br>❌❌❌ se van 3',
        lineas: ['Al principio hay 8 patos.', 'Se van 3, así que aparto 3.', 'Cuento los que quedan: 5. Entonces 8 - 3 = 5.'] } },
    { t: 'Otra forma: contar hacia atrás',
      p: ['También puedes empezar en el número grande y contar hacia atrás, dando tantos pasos como objetos quitas. Con 8 - 3 dirías: 7, 6, 5.',
          'Y puedes comprobar tu resultado con una suma: lo que queda más lo que quitaste debe darte el número del principio (5 + 3 = 8).'],
      tip: 'Restar y sumar son operaciones opuestas: una junta y la otra quita.' }
  ],
  'restas-2': [
    { t: 'El signo menos', visual: true, p: ['@teoria',
      'Una resta se escribe así: primero la cantidad del principio, luego el signo -, después lo que se quita, el signo = y lo que queda. Por ejemplo, 12 - 3 = 9 se lee «doce menos tres es igual a nueve».'] },
    { t: 'De una historia a una resta',
      pasos: ['Lee la historia y busca la cantidad del principio.',
              'Busca las palabras que avisan que algo se quita: «quedan», «se van», «regalas», «comes»...',
              'Escribe la cantidad del principio, el signo - y la cantidad que se quita.',
              'Calcula lo que queda y escríbelo después del signo =.'],
      ejemplo: { titulo: 'Ejemplo resuelto', visual: '🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇🍇',
        lineas: ['Historia: «Tenía 13 uvas y me comí 5».', '«Me comí» significa que se quitan, así que escribo 13 - 5.',
                 'Cuento hacia atrás desde 13, cinco pasos: 12, 11, 10, 9, 8. Entonces 13 - 5 = 8.'] } },
    { t: 'En una resta el orden sí importa',
      p: ['En la suma podemos cambiar el orden, pero en la resta no: empezamos siempre por la cantidad que hay al principio. 5 - 2 tiene sentido, pero 2 - 5 no, porque no puedes quitar 5 objetos si solo tienes 2.'],
      tip: 'Palabras que avisan de una resta: «quedan», «se van», «regalas», «comes», «pierdes», «se rompen».' }
  ],
  'restas-3': [
    { t: 'Restas con números más grandes', visual: true, p: ['@teoria',
      'Cuando los números son mayores, contar hacia atrás uno por uno es lento. Una buena estrategia es descomponer el número que quitamos en partes más fáciles y quitarlas una por una.'] },
    { t: 'Paso a paso: quitar en partes',
      pasos: ['Mira el número que vas a quitar y sepáralo en dos partes fáciles.', 'Quita la primera parte.',
              'Quita la segunda parte al número que te quedó.', 'El número final es el resultado.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 20 - 8', visual: '2️⃣0️⃣ &nbsp;➖&nbsp; 8️⃣',
        lineas: ['Separo el 8 en 5 y 3.', '20 - 5 = 15.', '15 - 3 = 12. Entonces 20 - 8 = 12.'] } },
    { t: 'Restar decenas completas',
      p: ['Cuando quitas decenas completas, solo restas las decenas: 40 - 10 es 4 decenas menos 1 decena, o sea 3 decenas: 30.',
          'Si quitas justo las unidades de un número, quedan las decenas: 35 - 5 = 30.'],
      tip: 'Comprueba siempre con una suma: el resultado más lo que quitaste debe darte el número del principio.' }
  ],
  'multiplicaciones-1': [
    { t: 'Multiplicar es sumar rápido', visual: true, p: ['@teoria',
      'El signo de multiplicar es x y se puede leer «por» o «veces». Por ejemplo, 3 x 2 es «3 veces el 2»: 2 + 2 + 2 = 6.'] },
    { t: 'Paso a paso: de la suma repetida a la multiplicación',
      pasos: ['Mira qué número se repite en la suma.', 'Cuenta cuántas veces aparece ese número.',
              'Escribe «veces» x «número»: si el 5 aparece 4 veces, es 4 x 5.',
              'Para encontrar el resultado, sigue sumando el número repetido.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 5 + 5 + 5 + 5', visual: '🟦🟦🟦🟦🟦<br>🟦🟦🟦🟦🟦<br>🟦🟦🟦🟦🟦<br>🟦🟦🟦🟦🟦',
        lineas: ['El número que se repite es el 5.', 'Aparece 4 veces, así que escribo 4 x 5.', 'Sumo de 5 en 5: 5, 10, 15, 20. Entonces 4 x 5 = 20.'] } },
    { t: 'El orden no cambia el resultado',
      p: ['4 grupos de 5 dan lo mismo que 5 grupos de 4: 4 x 5 = 5 x 4. Por eso una misma suma repetida puede escribirse de dos formas.'],
      tip: 'Antes de multiplicar fíjate bien en qué se repite y cuántas veces: son las dos pistas que necesitas.' }
  ],
  'multiplicaciones-2': [
    { t: 'El doble de un número', visual: true, p: ['@teoria',
      'Doble significa dos veces el mismo número. Por ejemplo, el doble de 7 es 7 + 7 = 14.'] },
    { t: 'La tabla del 2 paso a paso',
      pasos: ['Empieza en 0.', 'Salta de 2 en 2, un salto por cada vez que multiplicas.',
              'Cuenta cuántos saltos llevas: ese es el número por el que multiplicas el 2.',
              'El número donde caes después del último salto es el resultado.'],
      ejemplo: { titulo: 'La tabla del 2',
        lineas: ['2 x 1 = 2 &nbsp; 2 x 2 = 4 &nbsp; 2 x 3 = 6 &nbsp; 2 x 4 = 8 &nbsp; 2 x 5 = 10',
                 '2 x 6 = 12 &nbsp; 2 x 7 = 14 &nbsp; 2 x 8 = 16 &nbsp; 2 x 9 = 18 &nbsp; 2 x 10 = 20'] } },
    { t: 'Un truco de la tabla del 2',
      p: ['Los resultados de la tabla del 2 siempre terminan en 0, 2, 4, 6 u 8. A esos números se les llama pares.',
          'Cada resultado es 2 más que el anterior, así que puedes comprobarlo sumando de 2 en 2.'],
      tip: 'Si olvidas un resultado, calcula el doble del número: súmalo consigo mismo.' }
  ],
  'multiplicaciones-3': [
    { t: 'Filas y columnas', visual: true, p: ['@teoria',
      'Una multiplicación también puede verse como filas con la misma cantidad de objetos. Por ejemplo, 2 filas de 5 estrellas son 5 + 5 = 10 estrellas, y se escribe 2 x 5 = 10.'] },
    { t: 'Paso a paso: multiplicar con filas',
      pasos: ['Cuenta cuántas filas hay.', 'Cuenta cuántos objetos tiene cada fila.',
              'Escribe «filas» x «objetos en cada fila».', 'Suma la cantidad de cada fila tantas veces como filas haya.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 3 filas de 2', visual: '⭐⭐<br>⭐⭐<br>⭐⭐',
        lineas: ['Hay 3 filas y cada fila tiene 2 estrellas.', 'Escribo 3 x 2.', 'Sumo: 2 + 2 + 2 = 6. Entonces 3 x 2 = 6.'] } },
    { t: 'Factores y producto',
      p: ['Los números que se multiplican se llaman factores y el resultado se llama producto. En 5 x 2 = 10, los factores son 5 y 2, y el producto es 10.',
          'Un truco: los resultados de la tabla del 5 siempre terminan en 0 o en 5.'],
      tip: 'Si no recuerdas una multiplicación, dibuja las filas o suma de forma repetida. ¡Siempre funciona!' }
  ]
};

// Frase que une la teoría de cada lección con los ejercicios que vienen después
const conexiones = {
  'sumas-1': 'En los ejercicios juntarás grupos y calcularás totales. Usa el conteo hacia adelante que acabas de ver y recuerda que el orden de los sumandos no cambia el total.',
  'sumas-2': 'En los ejercicios convertirás historias en sumas, igual que en el ejemplo de los patos, y ordenarás los pasos para hacerlo. Fíjate siempre en las palabras que indican que se añade algo.',
  'sumas-3': 'Vas a sumar números de dos cifras separando decenas y unidades, a clasificar números y a ordenar los pasos del método que viste en el ejemplo 21 + 14.',
  'restas-1': 'En los ejercicios quitarás objetos y calcularás lo que queda. Usa las dos formas que viste, apartar objetos o contar hacia atrás, y comprueba con una suma.',
  'restas-2': 'Aquí convertirás historias en restas y ordenarás los pasos para hacerlo. Recuerda que en la resta importa el orden: se empieza por la cantidad del principio.',
  'restas-3': 'Los ejercicios usan la estrategia de quitar en partes y la resta de decenas completas. Antes de responder, decide cómo separar el número que quitas.',
  'multiplicaciones-1': 'En los ejercicios cambiarás sumas repetidas por frases con «veces» y calcularás resultados. Cuenta cuántas veces se repite el número: esa es la clave.',
  'multiplicaciones-2': 'Practicarás el doble de un número y la tabla del 2. Usa los saltos de 2 en 2 y la idea de sumar el número consigo mismo.',
  'multiplicaciones-3': 'Vas a pasar de filas a multiplicaciones y a calcular resultados de varias tablas. Imagina las filas o suma de forma repetida.'
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
const BANCO = '__banco';
let sesion = null;

const mezclar = (lista) => lista.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

// ---------- Datos auxiliares de los ejercicios ----------
const NOMBRES_CURSO = { sumas: 'Sumas', restas: 'Restas', multiplicaciones: 'Multiplicaciones' };
// Cada lección se registra en el nodo de conocimiento de la base de datos (nodo_conocimiento: 1-3 sumas, 4-6 restas, 7-9 multiplicaciones)
const NODO_BASE = { sumas: 0, restas: 3, multiplicaciones: 6 };
const idNodo = (clave, leccionId) => NODO_BASE[clave] + leccionId;

const ETIQUETAS_TIPO = {
  opcion: 'Elige la respuesta',
  escrita: 'Escribe tu respuesta',
  relacionar: 'Relaciona',
  arrastrar: 'Arrastra y suelta',
  ordenar: 'Ordena'
};
const INSTRUCCIONES = {
  escrita: 'Escribe tu respuesta en el cuadro y pulsa «Comprobar».',
  relacionar: 'Toca un elemento de una columna y luego su pareja en la otra. Para deshacer una pareja, toca uno de sus elementos.',
  arrastrar: 'Arrastra cada ficha a su caja. También puedes tocar una ficha y luego tocar la caja. Para sacarla, llévala de vuelta a las fichas.',
  ordenar: 'Toca los pasos en el orden correcto. Toca un paso ya colocado para quitarlo.'
};

// Reúne las preguntas de una lección (opción múltiple + interactivas) intercaladas
function preguntasDeLeccion(clave, indice) {
  const lec = cursosData[clave].lecciones[indice];
  const id = `${clave}-${lec.id}`;
  const mc = [[lec.reto, lec.opciones, lec.correcta, lec.pista || pistasReto[id]], ...(ejerciciosExtra[id] || [])]
    .map(([q, o, c, pista]) => ({ tipo: 'opcion', q, o: o.map((t, i) => ({ t, ok: i === c })), pista }));
  const inter = (ejerciciosInteractivos[id] || []).map(e => ({ ...e }));
  const lista = [];
  for (let i = 0; i < Math.max(mc.length, inter.length); i++) {
    if (mc[i]) lista.push(mc[i]);
    if (inter[i]) lista.push(inter[i]);
  }
  return lista.map(q => ({
    ...q, curso: clave, leccionId: lec.id, nodo: idNodo(clave, lec.id),
    origen: `${NOMBRES_CURSO[clave]} · Lección ${lec.id}`, fallada: false, apoyo: false
  }));
}

// ---------- Teoría por páginas ----------
function paginaPractica(id, preguntas) {
  const cuenta = {};
  preguntas.forEach(q => { cuenta[q.tipo] = (cuenta[q.tipo] || 0) + 1; });
  const frases = {
    opcion: n => `Elegir la respuesta correcta (${n})`,
    escrita: n => `Escribir tu respuesta (${n})`,
    relacionar: n => `Relacionar parejas (${n})`,
    arrastrar: n => `Arrastrar y soltar (${n})`,
    ordenar: n => `Ordenar pasos (${n})`
  };
  return {
    t: 'Lo que vas a practicar',
    p: [conexiones[id] || ''],
    lista: Object.keys(frases).filter(t => cuenta[t]).map(t => frases[t](cuenta[t])),
    tip: 'Cada ejercicio tiene su propia pista 💡. Ábrela solo si la necesitas.'
  };
}

function armarPaginasTeoria(id, lec, preguntas) {
  const paginas = (teoriaExtendida[id] || []).map(p => ({ ...p, p: (p.p || []).map(t => t === '@teoria' ? lec.teoria : t) }));
  if (!paginas.length) paginas.push({ t: 'Lo que debes saber', p: [lec.teoria] });
  paginas.push(paginaPractica(id, preguntas));
  return paginas;
}

function htmlPaginaTeoria(p, id) {
  const partes = [];
  if (p.visual && visuales[id] && visuales[id][0]) {
    partes.push(`<div class="visual-leccion" aria-hidden="true">${visuales[id][0]}</div>`);
  }
  (p.p || []).filter(Boolean).forEach(t => partes.push(`<p class="texto-teoria">${t}</p>`));
  if (p.pasos) partes.push(`<ol class="teoria-pasos">${p.pasos.map(x => `<li>${x}</li>`).join('')}</ol>`);
  if (p.ejemplo) {
    partes.push(`<div class="teoria-ejemplo"><strong>${p.ejemplo.titulo}</strong>
      ${p.ejemplo.visual ? `<div class="teoria-ejemplo-visual" aria-hidden="true">${p.ejemplo.visual}</div>` : ''}
      ${p.ejemplo.lineas.map(l => `<p>${l}</p>`).join('')}</div>`);
  }
  if (p.lista) partes.push(`<ul class="teoria-lista">${p.lista.map(x => `<li>${x}</li>`).join('')}</ul>`);
  if (p.tip) partes.push(`<p class="teoria-ojo"><span aria-hidden="true">💡</span> ${p.tip}</p>`);
  return partes.join('');
}

function abrirLeccion(clave, indice) {
  const curso = cursosData[clave];
  const lec = curso.lecciones[indice];
  const id = `${clave}-${lec.id}`;
  const preguntas = preguntasDeLeccion(clave, indice);

  sesion = {
    modo: 'leccion', id, clave, indice, lec, curso, visual: visuales[id] || '',
    cola: preguntas, total: preguntas.length, resueltas: 0,
    vidas: VIDAS_MAX, fase: 'teoria', paginaTeoria: 0, paginasTeoria: armarPaginasTeoria(id, lec, preguntas),
    opciones: [], seleccion: null, comprobado: false, actual: null
  };
  pantallaLeccion.classList.add('visible');
  document.body.classList.add('leccion-abierta');
  pintarPaso();
}

// ---------- Práctica mixta ----------
function leccionesCompletadasLista() {
  const lista = [];
  Object.keys(cursosData).forEach(clave => {
    const hechas = Math.min(leccionesCompletadas(clave), cursosData[clave].lecciones.length);
    for (let i = 0; i < hechas; i++) lista.push([clave, i]);
  });
  return lista;
}

// Combina preguntas de TODAS las lecciones completadas, repartiéndolas entre lecciones y variando el tipo de ejercicio
function armarPracticaMixta(cantidad = 10) {
  const hechas = leccionesCompletadasLista();
  if (!hechas.length) return [];
  const grupos = hechas.map(([clave, i]) => ({ preguntas: mezclar(preguntasDeLeccion(clave, i)), usadas: 0 }));
  const disponibles = grupos.reduce((n, g) => n + g.preguntas.length, 0);
  const total = Math.min(cantidad, disponibles);
  const usosTipo = {};
  const elegidas = [];
  let ultimoTipo = null;
  while (elegidas.length < total) {
    const candidatos = grupos.filter(g => g.preguntas.length);
    const minimo = Math.min(...candidatos.map(g => g.usadas));
    const grupo = mezclar(candidatos.filter(g => g.usadas === minimo))[0];
    const coste = (q) => (usosTipo[q.tipo] || 0) + (q.tipo === ultimoTipo ? 100 : 0);
    const q = [...grupo.preguntas].sort((a, b) => coste(a) - coste(b))[0];
    grupo.preguntas.splice(grupo.preguntas.indexOf(q), 1);
    grupo.usadas++;
    usosTipo[q.tipo] = (usosTipo[q.tipo] || 0) + 1;
    ultimoTipo = q.tipo;
    elegidas.push(q);
  }
  return elegidas;
}

const btnPracticaMixta = document.getElementById('btn-practica-mixta');
const mixtaEstado = document.getElementById('mixta-estado');
const mixtaBadge = document.getElementById('mixta-badge');

function actualizarPracticaMixta() {
  const hechas = leccionesCompletadasLista().length;
  const totalLecciones = Object.values(cursosData).reduce((n, c) => n + c.lecciones.length, 0);
  const bloqueada = hechas === 0;
  btnPracticaMixta.classList.toggle('bloqueada', bloqueada);
  btnPracticaMixta.setAttribute('aria-disabled', bloqueada);
  mixtaBadge.textContent = bloqueada ? '🔒 Bloqueada' : 'Practicar';
  mixtaEstado.textContent = bloqueada
    ? 'Completa tu primera lección para desbloquearla.'
    : `Lecciones incluidas: ${hechas} de ${totalLecciones}. Cada práctica mezcla hasta 10 ejercicios.`;
}

function abrirPracticaMixta() {
  const preguntas = armarPracticaMixta();
  if (!preguntas.length) {
    mostrarToast('Completa al menos una lección para desbloquear la práctica mixta 🔒');
    return;
  }
  sesion = {
    modo: 'mixta', id: 'mixta', clave: null, indice: null, lec: null, curso: null, visual: '',
    cola: preguntas, total: preguntas.length, resueltas: 0,
    vidas: VIDAS_MAX, fase: 'pregunta', opciones: [], seleccion: null, comprobado: false, actual: null
  };
  pantallaLeccion.classList.add('visible');
  document.body.classList.add('leccion-abierta');
  pintarPaso();
}
btnPracticaMixta.addEventListener('click', abrirPracticaMixta);

//Función inteligente para decidir que gráfico mostrar
function obtenerVisualParaPregunta(q, claveCurso) {
  if (q.visual) {
    return `<div class="visual-leccion" aria-hidden="true" style="font-size: 2rem; line-height: 1.6; text-align: center; padding: 1rem;">${q.visual}</div>`;
  }

  const texto = q.q.toLowerCase();
  const numeros = texto.match(/\d+/g);
  
  if (!numeros || numeros.length === 0) return '';

  // Una suma repetida (3 o más sumandos) no se puede dibujar como "n1 + n2"
  if (numeros.length >= 3 && texto.includes('+') && !texto.includes('x')) return '';

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
      // Si hay más de 15 elementos el dibujo quedaría recortado y mostraría una cantidad incorrecta
      if (n1 > 15 || n2 > 15) return '';
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
      if (n1 > 15) return '';
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
      if (n1 > 10) return '';
      return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
                ${emoji.repeat(Math.min(n1, 10))} &nbsp;y&nbsp; ${emoji.repeat(Math.min(n1, 10))}
                <br><small style="font-size: 0.9rem; color: var(--texto-secundario);">Dos veces el número ${n1}</small>
              </div>`;
    }
    if (n1 && n2) {
      if (n1 > 5 || n2 > 8) return '';
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
  leccionCuerpo.scrollTop = 0;

  if (s.fase === 'teoria') return pintarTeoria();
  pintarPregunta();
}

function pintarTeoria() {
  const s = sesion;
  const n = s.paginaTeoria;
  const paginas = s.paginasTeoria;
  const p = paginas[n];
  const ultima = n === paginas.length - 1;
  leccionCuerpo.innerHTML = `
    <div class="paso paso-teoria">
      <p class="teoria-progreso">Teoría · página ${n + 1} de ${paginas.length}</p>
      <h2>${s.lec.titulo}</h2>
      <h3 class="teoria-subtitulo">${p.t}</h3>
      ${htmlPaginaTeoria(p, s.id)}
      ${n > 0 ? '<button type="button" class="btn-teoria-atras" id="teoria-atras">← Página anterior</button>' : ''}
    </div>`;
  const atras = document.getElementById('teoria-atras');
  if (atras) atras.addEventListener('click', () => { s.paginaTeoria--; pintarPaso(); });
  configurarPie('', '', ultima ? '¡Entendido!' : 'Siguiente');
}

const RENDERIZADORES = {
  opcion: (q, cont) => renderOpcion(q, cont),
  escrita: (q, cont) => renderEscrita(q, cont),
  relacionar: (q, cont) => renderRelacionar(q, cont),
  arrastrar: (q, cont) => renderArrastrar(q, cont),
  ordenar: (q, cont) => renderOrdenar(q, cont)
};

function pintarPregunta() {
  const s = sesion;
  const q = s.cola[0];
  s.opciones = [];
  s.seleccion = null;
  s.comprobado = false;
  s.actual = null;
  s.inicioPregunta = Date.now();
  s.pistasPresentacion = 0;

  // Declaramos visualHTML una sola vez usando nuestro enfoque híbrido
  const conVisual = q.visual || q.tipo === 'opcion' || q.tipo === 'escrita';
  const visualHTML = conVisual ? obtenerVisualParaPregunta(q, q.curso) : '';

  leccionCuerpo.innerHTML = `
    <div class="paso paso-pregunta tipo-${q.tipo}">
      ${s.modo === 'mixta' ? `<span class="etiqueta-origen">${q.origen}</span>` : ''}
      <span class="etiqueta-tipo">${ETIQUETAS_TIPO[q.tipo]}</span>
      <h2>${q.q}</h2>
      ${visualHTML}
      ${INSTRUCCIONES[q.tipo] ? `<p class="instruccion">${INSTRUCCIONES[q.tipo]}</p>` : ''}
      ${q.pista ? `<details class="pista${q.apoyo ? ' sugerida' : ''}"${q.apoyo ? ' open' : ''}>
        <summary>💡 ${q.apoyo ? 'Te sugerimos una pista' : '¿Necesitas una pista?'}</summary>
        <p>${q.pista}</p>
      </details>` : ''}
      <div class="zona-ejercicio" id="zona-ejercicio"></div>
    </div>`;

  const detalles = leccionCuerpo.querySelector('details.pista');
  if (detalles) {
    // Se cuenta una pista pedida cuando el estudiante la despliega (no cuando el sistema la sugiere abierta)
    detalles.querySelector('summary').addEventListener('click', () => {
      if (!detalles.open && !s.pistasPresentacion) s.pistasPresentacion = 1;
    });
  }

  configurarPie('', '', 'Comprobar', true);
  RENDERIZADORES[q.tipo](q, document.getElementById('zona-ejercicio'));
  actualizarBotonComprobar();
}

function actualizarBotonComprobar() {
  const s = sesion;
  if (!s || !s.actual || s.comprobado) return;
  leccionAccion.disabled = !s.actual.listo();
}

// ---------- Tipo: opción múltiple (ejercicio original) ----------
function renderOpcion(q, cont) {
  const s = sesion;
  s.opciones = mezclar(q.o);
  cont.innerHTML = '<div class="opciones-leccion" role="group" aria-label="Respuestas"></div>';
  const contenedor = cont.firstElementChild;
  s.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion opcion-leccion';
    btn.innerHTML = `<span class="atajo">${i + 1}</span>${op.t}`;
    btn.addEventListener('click', () => seleccionarOpcion(i));
    contenedor.appendChild(btn);
  });
  s.actual = {
    tipo: 'opcion',
    listo: () => s.seleccion !== null,
    evaluar: () => ({ acierto: s.opciones[s.seleccion].ok, correcta: s.opciones.find(o => o.ok).t }),
    marcar: () => {
      leccionCuerpo.querySelectorAll('.opcion-leccion').forEach((b, j) => {
        b.disabled = true;
        if (s.opciones[j].ok) b.classList.add('correcta');
        else if (j === s.seleccion) b.classList.add('incorrecta');
      });
    },
    mensajeError: (r) => `<strong>¡Casi!</strong><span>La respuesta correcta es: ${r.correcta}</span>`
  };
}

function seleccionarOpcion(i) {
  if (!sesion || sesion.comprobado || sesion.fase !== 'pregunta' || !sesion.actual || sesion.actual.tipo !== 'opcion') return;
  sesion.seleccion = i;
  leccionCuerpo.querySelectorAll('.opcion-leccion').forEach((b, j) => {
    b.classList.toggle('seleccionada', j === i);
    b.setAttribute('aria-pressed', j === i);
  });
  leccionAccion.disabled = false;
}

// ---------- Tipo: respuesta escrita ----------
const normalizarTexto = (t) => String(t).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
function coincideRespuesta(escrita, esperada) {
  const a = normalizarTexto(escrita).replace(',', '.');
  const b = normalizarTexto(esperada).replace(',', '.');
  const num = /^-?\d+(\.\d+)?$/;
  if (num.test(a) && num.test(b)) return Number(a) === Number(b);
  return a === b;
}

function renderEscrita(q, cont) {
  const s = sesion;
  cont.innerHTML = `<input type="text" class="entrada-respuesta" id="respuesta-escrita" autocomplete="off" autocapitalize="off"
    spellcheck="false" maxlength="24" inputmode="${q.numerico ? 'numeric' : 'text'}" aria-label="Tu respuesta" placeholder="Tu respuesta">`;
  const input = cont.querySelector('input');
  input.addEventListener('input', actualizarBotonComprobar);
  s.actual = {
    tipo: 'escrita',
    listo: () => input.value.trim().length > 0,
    evaluar: () => ({ acierto: q.respuestas.some(r => coincideRespuesta(input.value, r)), correcta: q.respuestas[0] }),
    marcar: (r) => { input.readOnly = true; input.classList.add(r.acierto ? 'correcta' : 'incorrecta'); },
    mensajeError: (r) => `<strong>¡Casi!</strong><span>La respuesta correcta es: ${r.correcta}</span>`
  };
  input.focus({ preventScroll: true });
}

// ---------- Tipo: relacionar elementos ----------
const COLORES_PAREJA = ['#3a86ff', '#ff006e', '#00a066', '#9d4edd', '#e07b00'];

function renderRelacionar(q, cont) {
  const s = sesion;
  const izq = q.pares.map(([t], i) => ({ t, i }));
  let der = q.pares.map(([, t], i) => ({ t, dueno: i }));
  for (let k = 0; k < 5; k++) {
    der = mezclar(der);
    if (der.some((d, pos) => d.dueno !== pos)) break;
  }
  const parejas = new Map();   // índice izquierda -> índice derecha
  const marcas = new Map();    // índice izquierda -> número de marca (letra y color)
  let pendiente = null;        // { lado, idx }
  let resultado = null;        // detalle tras comprobar

  cont.innerHTML = '<div class="relacionar"><div class="rel-col" data-lado="i" role="group" aria-label="Columna izquierda"></div><div class="rel-col" data-lado="d" role="group" aria-label="Columna derecha"></div></div>';
  const colI = cont.querySelector('[data-lado="i"]');
  const colD = cont.querySelector('[data-lado="d"]');

  const izqDeDer = (idxD) => { for (const [i, d] of parejas) if (d === idxD) return i; return undefined; };

  function crearBoton(lado, idx, texto, marca, estado) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'opcion rel-item';
    btn.textContent = texto;
    if (marca !== undefined) {
      btn.classList.add('emparejada');
      btn.style.setProperty('--par', COLORES_PAREJA[marca % COLORES_PAREJA.length]);
      const m = document.createElement('span');
      m.className = 'rel-marca';
      m.setAttribute('aria-hidden', 'true');
      m.textContent = String.fromCharCode(65 + marca);
      btn.prepend(m);
      btn.setAttribute('aria-label', `${texto}, pareja ${String.fromCharCode(65 + marca)}`);
    }
    if (pendiente && pendiente.lado === lado && pendiente.idx === idx) btn.classList.add('seleccionada');
    if (estado !== undefined) { btn.classList.add(estado ? 'correcta' : 'incorrecta'); btn.disabled = true; }
    btn.addEventListener('click', () => tocar(lado, idx));
    return btn;
  }

  function pintar() {
    colI.innerHTML = '';
    colD.innerHTML = '';
    izq.forEach(({ t, i }) => {
      colI.appendChild(crearBoton('i', i, t, parejas.has(i) ? marcas.get(i) : undefined, resultado ? resultado[i] : undefined));
    });
    der.forEach(({ t }, j) => {
      const dueno = izqDeDer(j);
      colD.appendChild(crearBoton('d', j, t, dueno !== undefined ? marcas.get(dueno) : undefined, resultado && dueno !== undefined ? resultado[dueno] : undefined));
    });
  }

  function romper(lado, idx) {
    const i = lado === 'i' ? idx : izqDeDer(idx);
    if (i === undefined || !parejas.has(i)) return;
    parejas.delete(i);
    marcas.delete(i);
  }

  function tocar(lado, idx) {
    if (s.comprobado) return;
    const estaEmparejado = lado === 'i' ? parejas.has(idx) : izqDeDer(idx) !== undefined;
    if (pendiente && pendiente.lado !== lado) {
      if (estaEmparejado) romper(lado, idx);
      const [i, j] = lado === 'i' ? [idx, pendiente.idx] : [pendiente.idx, idx];
      const usadas = new Set(marcas.values());
      let marca = 0;
      while (usadas.has(marca)) marca++;
      parejas.set(i, j);
      marcas.set(i, marca);
      pendiente = null;
    } else if (estaEmparejado) {
      romper(lado, idx);
      pendiente = { lado, idx };
    } else {
      pendiente = (pendiente && pendiente.lado === lado && pendiente.idx === idx) ? null : { lado, idx };
    }
    pintar();
    actualizarBotonComprobar();
  }

  s.actual = {
    tipo: 'relacionar',
    listo: () => parejas.size === q.pares.length,
    evaluar: () => {
      const detalle = q.pares.map((_, i) => parejas.has(i) && der[parejas.get(i)].dueno === i);
      return { acierto: detalle.every(Boolean), detalle, correcta: q.pares.map(([a, b]) => `${a} → ${b}`).join(' · ') };
    },
    marcar: (r) => { resultado = r.detalle; pintar(); },
    mensajeError: (r) => `<strong>¡Casi!</strong><span>Las parejas en rojo no coinciden. Las correctas son: ${r.correcta}</span>`
  };
  pintar();
}

// ---------- Tipo: arrastrar y soltar (mouse y táctil con Pointer Events; también toque + toque y teclado) ----------
function renderArrastrar(q, cont) {
  const s = sesion;
  cont.innerHTML = `
    <div class="arrastrar">
      <div class="arr-zonas">${q.zonas.map(z => `
        <div class="arr-zona" data-zona="${z.id}" tabindex="0" role="group" aria-label="Caja: ${z.titulo}">
          <div class="arr-zona-titulo">${z.titulo}</div>
          <div class="arr-zona-fichas"></div>
        </div>`).join('')}
      </div>
      <div class="arr-banco" data-zona="${BANCO}" tabindex="0" role="group" aria-label="Fichas disponibles">
        <div class="arr-zona-fichas"></div>
      </div>
    </div>`;
  const raiz = cont.querySelector('.arrastrar');
  const banco = raiz.querySelector('.arr-banco .arr-zona-fichas');
  let seleccionada = null;
  let ignorarClic = false;

  const fichas = mezclar(q.fichas.map((f, i) => ({ ...f, i }))).map(f => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'ficha';
    el.dataset.i = f.i;
    el.textContent = f.t;
    banco.appendChild(el);
    return el;
  });

  const ubicacion = (el) => el.closest('[data-zona]').dataset.zona;
  const contenedorDe = (zona) => zona.querySelector('.arr-zona-fichas');

  function elegir(ficha) {
    if (seleccionada) seleccionada.classList.remove('seleccionada');
    seleccionada = (seleccionada === ficha) ? null : ficha;
    if (seleccionada) seleccionada.classList.add('seleccionada');
  }
  function colocar(ficha, zona) {
    contenedorDe(zona).appendChild(ficha);
    if (seleccionada) { seleccionada.classList.remove('seleccionada'); seleccionada = null; }
    actualizarBotonComprobar();
  }

  fichas.forEach((ficha) => {
    ficha.addEventListener('pointerdown', (e) => {
      if (s.comprobado || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const x0 = e.clientX, y0 = e.clientY;
      let arrastrando = false;
      let fantasma = null;
      let zonaSobre = null;
      try { ficha.setPointerCapture(e.pointerId); } catch { /* sin captura */ }

      const marcarZona = (zona) => {
        if (zonaSobre === zona) return;
        if (zonaSobre) zonaSobre.classList.remove('sobre');
        zonaSobre = zona;
        if (zonaSobre) zonaSobre.classList.add('sobre');
      };
      const zonaBajo = (x, y) => {
        const z = document.elementFromPoint(x, y);
        const zona = z && z.closest('[data-zona]');
        return zona && raiz.contains(zona) ? zona : null;
      };
      const mover = (ev) => {
        if (!arrastrando && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) {
          arrastrando = true;
          fantasma = ficha.cloneNode(true);
          fantasma.classList.add('ficha-fantasma');
          fantasma.classList.remove('seleccionada');
          document.body.appendChild(fantasma);
          ficha.classList.add('arrastrando');
        }
        if (arrastrando) {
          fantasma.style.left = `${ev.clientX}px`;
          fantasma.style.top = `${ev.clientY}px`;
          marcarZona(zonaBajo(ev.clientX, ev.clientY));
        }
      };
      const limpiar = () => {
        ficha.removeEventListener('pointermove', mover);
        ficha.removeEventListener('pointerup', soltar);
        ficha.removeEventListener('pointercancel', cancelar);
        if (fantasma) fantasma.remove();
        marcarZona(null);
        ficha.classList.remove('arrastrando');
      };
      const soltar = (ev) => {
        const destino = arrastrando ? zonaBajo(ev.clientX, ev.clientY) : null;
        const fueArrastre = arrastrando;
        limpiar();
        if (fueArrastre) {
          ignorarClic = true;
          setTimeout(() => { ignorarClic = false; }, 0);
          if (destino) colocar(ficha, destino);
        } else {
          elegir(ficha);   // toque simple: seleccionar / deseleccionar
        }
      };
      const cancelar = () => limpiar();
      ficha.addEventListener('pointermove', mover);
      ficha.addEventListener('pointerup', soltar);
      ficha.addEventListener('pointercancel', cancelar);
    });
    // Teclado: Enter o Espacio sobre la ficha (los clics de ratón/táctil se gestionan con los eventos de puntero)
    ficha.addEventListener('click', (e) => { if (e.detail === 0 && !s.comprobado) elegir(ficha); });
  });

  raiz.querySelectorAll('[data-zona]').forEach((zona) => {
    zona.addEventListener('click', (e) => {
      if (s.comprobado || ignorarClic || e.target.closest('.ficha')) return;
      if (seleccionada) colocar(seleccionada, zona);
    });
    zona.addEventListener('keydown', (e) => {
      if (e.target !== zona || s.comprobado) return;
      if ((e.key === 'Enter' || e.key === ' ') && seleccionada) { e.preventDefault(); colocar(seleccionada, zona); }
    });
  });

  s.actual = {
    tipo: 'arrastrar',
    listo: () => fichas.every(el => q.fichas[el.dataset.i].zona == null || ubicacion(el) !== BANCO),
    evaluar: () => {
      const detalle = fichas.map(el => ubicacion(el) === (q.fichas[el.dataset.i].zona ?? BANCO));
      const correcta = q.zonas.map(z => `${z.titulo}: ${q.fichas.filter(f => f.zona === z.id).map(f => f.t).join(', ')}`).join(' · ');
      return { acierto: detalle.every(Boolean), detalle, correcta };
    },
    marcar: (r) => {
      fichas.forEach((el, k) => { el.disabled = true; el.classList.add(r.detalle[k] ? 'correcta' : 'incorrecta'); });
    },
    mensajeError: (r) => `<strong>¡Casi!</strong><span>Las fichas en rojo no están en su caja. Lo correcto es → ${r.correcta}</span>`
  };
}

// ---------- Tipo: ordenar pasos ----------
function renderOrdenar(q, cont) {
  const s = sesion;
  const items = q.pasos.map((t, i) => ({ t, i }));
  let barajados = items;
  for (let k = 0; k < 6; k++) {
    barajados = mezclar(items);
    if (barajados.some((b, pos) => b.i !== pos)) break;
  }
  const secuencia = [];   // índices (posición correcta) en el orden elegido por el estudiante
  let resultado = null;

  cont.innerHTML = '<div class="ordenar"><ol class="ord-respuesta" aria-label="Tu orden"></ol><div class="ord-banco" role="group" aria-label="Pasos disponibles"></div></div>';
  const lista = cont.querySelector('.ord-respuesta');
  const bancoEl = cont.querySelector('.ord-banco');

  function pintar() {
    lista.innerHTML = '';
    items.forEach((_, pos) => {
      const li = document.createElement('li');
      li.className = 'ord-hueco';
      if (secuencia[pos] !== undefined) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ficha ord-ficha';
        btn.textContent = q.pasos[secuencia[pos]];
        if (resultado) { btn.classList.add(resultado[pos] ? 'correcta' : 'incorrecta'); btn.disabled = true; }
        btn.addEventListener('click', () => {
          if (s.comprobado) return;
          secuencia.splice(pos, 1);
          pintar();
          actualizarBotonComprobar();
        });
        li.appendChild(btn);
      } else {
        li.classList.add('vacio');
      }
      lista.appendChild(li);
    });
    bancoEl.innerHTML = '';
    barajados.filter(b => !secuencia.includes(b.i)).forEach(b => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ficha ord-ficha';
      btn.textContent = b.t;
      btn.disabled = !!resultado;
      btn.addEventListener('click', () => {
        if (s.comprobado) return;
        secuencia.push(b.i);
        pintar();
        actualizarBotonComprobar();
      });
      bancoEl.appendChild(btn);
    });
  }

  s.actual = {
    tipo: 'ordenar',
    listo: () => secuencia.length === items.length,
    evaluar: () => {
      const detalle = items.map((_, pos) => secuencia[pos] === pos);
      return { acierto: detalle.every(Boolean), detalle, correcta: q.pasos.map((p, i) => `${i + 1}. ${p}`).join(' → ') };
    },
    marcar: (r) => { resultado = r.detalle; pintar(); },
    mensajeError: (r) => `<strong>¡Casi!</strong><span>El orden correcto es: ${r.correcta}</span>`
  };
  pintar();
}

// ---------- Comprobación, retroalimentación y registro del intento ----------
function comprobarRespuesta() {
  const s = sesion;
  const q = s.cola[0];
  if (!s.actual || s.comprobado || !s.actual.listo()) return;

  const resultado = s.actual.evaluar();
  const acierto = resultado.acierto;
  s.ultimoAcierto = acierto;
  s.comprobado = true;
  s.actual.marcar(resultado);

  if (acierto) {
    sonido('ok');
    s.resueltas++;
    configurarPie('ok', '<strong>¡Correcto! </strong>', 'Continuar');
  } else {
    sonido('mal');
    s.vidas--;
    q.fallada = true;
    configurarPie('mal', s.actual.mensajeError(resultado), 'Continuar');
  }

  pintarVidas();
  pintarBarra();

  // El motor adaptativo del servidor analiza el intento mientras el estudiante lee la retroalimentación
  const segundos = Math.max(1, Math.round((Date.now() - s.inicioPregunta) / 1000));
  registrarIntento(q, acierto, segundos, s.pistasPresentacion || 0);
}

async function registrarIntento(q, acierto, segundos, pistas) {
  try {
    const respuesta = await fetch(`${API_URL}/registrar-intento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: idUsuarioActual || 1, // Usa el ID del usuario logueado o un valor por defecto si es invitado
        id_nodo: q.nodo,                  // Nodo de conocimiento de la lección a la que pertenece el ejercicio
        es_correcto: acierto,
        tiempo_respuesta: segundos,
        pistas_solicitadas: pistas
      })
    });
    const resultado = await respuesta.json();
    if (respuesta.ok && resultado.requiere_apoyo) {
      // Si el backend detecta acumulación de errores, la pista se mostrará abierta cuando el ejercicio se repita
      q.apoyo = true;
      console.log("El motor adaptativo sugirió activar una ruta de rescate o pista.");
    }
  } catch (error) {
    console.error('Error al conectar con el backend para registrar el intento:', error);
  }
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
      <p class="texto-teoria">${sesion.modo === 'mixta'
        ? 'No pasa nada, equivocarse es parte de aprender. Repasa tus lecciones e inténtalo otra vez.'
        : 'No pasa nada, equivocarse es parte de aprender. Repasa la teoría e inténtalo otra vez.'}</p>
    </div>`;
  pintarVidas();
  configurarPie('mal', '', 'Intentar de nuevo');
  sesion.fase = 'sin-vidas';
}

function mostrarFinal() {
  const s = sesion;
  const errores = VIDAS_MAX - s.vidas;
  const estrellas = errores === 0 ? 3 : errores === 1 ? 2 : 1;
  if (s.modo === 'leccion') marcarCompletada(s.clave, s.indice);
  sonido('fin');
  s.fase = 'final';
  pintarBarra();
  leccionRelleno.style.width = '100%';
  const haySiguiente = s.modo === 'leccion' && s.indice < s.curso.lecciones.length - 1;
  leccionCuerpo.innerHTML = `
    <div class="paso paso-final">
      <div class="estrellas" aria-label="${estrellas} de 3 estrellas">${'⭐'.repeat(estrellas)}${'☆'.repeat(3 - estrellas)}</div>
      <h2>${s.modo === 'mixta' ? '¡Práctica mixta completada!' : '¡Lección completada!'}</h2>
      <p class="texto-teoria">${errores === 0 ? '¡Sin ningún error! Eres una estrella.' : `Terminaste con ${s.vidas} ${s.vidas === 1 ? 'vida' : 'vidas'}. ¡Sigue así!`}</p>
    </div>`;
  configurarPie('ok', '', s.modo === 'mixta' ? 'Volver al inicio' : haySiguiente ? 'Siguiente lección' : 'Volver al curso');
}

leccionAccion.addEventListener('click', () => {
  const s = sesion;
  if (!s) return;
  if (s.fase === 'teoria') {
    if (s.paginaTeoria < s.paginasTeoria.length - 1) { s.paginaTeoria++; pintarPaso(); }
    else { s.fase = 'pregunta'; pintarPaso(); }
  }
  else if (s.fase === 'pregunta' && !s.comprobado) comprobarRespuesta();
  else if (s.fase === 'pregunta') continuarLeccion();
  else if (s.fase === 'sin-vidas') {
    if (s.modo === 'mixta') abrirPracticaMixta();
    else abrirLeccion(s.clave, s.indice);
  }
  else if (s.fase === 'final') {
    const { clave, indice, curso, modo } = s;
    cerrarLeccion(false);
    if (modo === 'leccion' && indice < curso.lecciones.length - 1) abrirLeccion(clave, indice + 1);
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
  actualizarPracticaMixta();
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
  const activo = document.activeElement;
  const escribiendo = activo && activo.tagName === 'INPUT';
  if (sesion.fase === 'pregunta' && !escribiendo && sesion.actual && sesion.actual.tipo === 'opcion'
      && /^[1-9]$/.test(e.key) && Number(e.key) <= sesion.opciones.length) {
    seleccionarOpcion(Number(e.key) - 1);
  } else if (e.key === 'Enter' && activo !== leccionAccion && !leccionAccion.disabled
             && !(activo && activo.closest('.ficha, .rel-item, summary, .arr-zona, .arr-banco'))) {
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