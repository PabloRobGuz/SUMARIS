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

// ========== Dibujos de figuras geométricas (SVG sencillo, mismo color del tema "Figuras") ==========
// tipo: circulo, cuadrado, rectangulo, triangulo, pentagono, hexagono
function svgFigura(tipo, tam = 56, color = '#ff2e63') {
  const c = tam / 2;
  const r = c - 3;
  const poligono = (lados, giro = -Math.PI / 2) => Array.from({ length: lados }, (_, i) => {
    const ang = giro + (2 * Math.PI * i) / lados;
    return `${(c + r * Math.cos(ang)).toFixed(1)},${(c + r * Math.sin(ang)).toFixed(1)}`;
  }).join(' ');
  const formas = {
    circulo: `<circle cx="${c}" cy="${c}" r="${r}"/>`,
    cuadrado: `<rect x="4" y="4" width="${tam - 8}" height="${tam - 8}" rx="3"/>`,
    rectangulo: `<rect x="2" y="${(tam * 0.22).toFixed(1)}" width="${tam - 4}" height="${(tam * 0.56).toFixed(1)}" rx="3"/>`,
    triangulo: `<polygon points="${poligono(3)}" stroke-linejoin="round"/>`,
    pentagono: `<polygon points="${poligono(5)}" stroke-linejoin="round"/>`,
    hexagono: `<polygon points="${poligono(6, 0)}" stroke-linejoin="round"/>`
  };
  return `<svg class="figura-svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}" fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="2" aria-hidden="true">${formas[tipo]}</svg>`;
}

// ========== Dibujos de fracciones (pizza y barra de chocolate, mismo color del tema "Fracciones") ==========
// svgFraccion: pizza partida en `den` trozos iguales con `num` trozos pintados
function svgFraccion(num, den, tam = 64, color = '#00b4d8') {
  const c = tam / 2;
  const r = c - 3;
  const punto = (ang) => `${(c + r * Math.cos(ang)).toFixed(1)},${(c + r * Math.sin(ang)).toFixed(1)}`;
  const trozos = den === 1
    ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${num >= 1 ? color : '#ffffff'}"/>`
    : Array.from({ length: den }, (_, i) => {
        const a0 = -Math.PI / 2 + (2 * Math.PI * i) / den;
        const a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / den;
        return `<path d="M${c},${c} L${punto(a0)} A${r},${r} 0 0 1 ${punto(a1)} Z" fill="${i < num ? color : '#ffffff'}"/>`;
      }).join('');
  return `<svg class="figura-svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linejoin="round" aria-hidden="true">${trozos}</svg>`;
}

// svgBarra: barra de chocolate dividida en `den` cuadritos iguales con `num` cuadritos pintados
function svgBarra(num, den, ancho = 128, color = '#00b4d8') {
  const alto = 40;
  const w = (ancho - 4) / den;
  const cuadritos = Array.from({ length: den }, (_, i) =>
    `<rect x="${(2 + i * w).toFixed(1)}" y="2" width="${w.toFixed(1)}" height="${alto - 4}" fill="${i < num ? color : '#ffffff'}"/>`).join('');
  return `<svg class="figura-svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linejoin="round" aria-hidden="true">${cuadritos}</svg>`;
}

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
      },
  divisiones: {
    titulo: "➗ Divisiones",
    descripcion: "Aprende a repartir en partes iguales de forma divertida",
    lecciones: [
      {
        id: 1,
        titulo: "Lección 1: Repartir en partes iguales",
        teoria: "Dividir es repartir una cantidad en grupos iguales, para que todos reciban lo mismo. Por ejemplo, si tienes 6 galletas y las repartes entre 2 amigos, cada uno recibe 3 galletas.",
        reto: "Si repartes 8 caramelos entre 2 amigos por igual, ¿cuántos recibe cada uno?",
        opciones: ["3", "4", "5"],
        correcta: 1
      },
      {
        id: 2,
        titulo: "Lección 2: El signo de dividir",
        teoria: "El signo de la división es ÷ y se lee 'entre'. Por ejemplo, 6 ÷ 2 = 3 significa que al repartir 6 cosas en 2 grupos iguales, cada grupo tiene 3.",
        reto: "Resuelve: 10 ÷ 2 =",
        opciones: ["4", "5", "6"],
        correcta: 1
      },
      {
        id: 3,
        titulo: "Lección 3: Dividir con las tablas",
        teoria: "La división es la operación contraria a la multiplicación. Si 3 x 4 = 12, entonces 12 ÷ 3 = 4 y 12 ÷ 4 = 3. Por eso las tablas de multiplicar te ayudan a dividir.",
        reto: "Resuelve: 20 ÷ 4 =",
        opciones: ["4", "5", "6"],
        correcta: 1
      }
    ]
  },
  numeros: {
    titulo: "🔢 Los Números",
    descripcion: "Cuenta, ordena y conoce los números",
    lecciones: [
      {
        id: 1,
        titulo: "Lección 1: Contar del 1 al 20",
        teoria: "Contar es decir los números en orden, uno por cada objeto. Después del 1 viene el 2, luego el 3 y así sucesivamente. Cada número es uno más que el anterior.",
        reto: "Cuenta las manzanas. ¿Cuántas hay?",
        visual: "🍎🍎🍎🍎🍎🍎",
        opciones: ["5", "6", "7"],
        correcta: 1
      },
      {
        id: 2,
        titulo: "Lección 2: Mayor, menor e igual",
        teoria: "Comparar es decidir qué número es mayor, menor o igual a otro. Un número es mayor si tiene más cosas y menor si tiene menos. Por ejemplo, 9 es mayor que 4 porque 9 cosas son más que 4.",
        reto: "Completa con el signo correcto: 8 __ 5",
        opciones: ["&lt;", "&gt;", "="],
        correcta: 1
      },
      {
        id: 3,
        titulo: "Lección 3: Pares e impares",
        teoria: "Los números pares se pueden juntar en parejas sin que sobre ninguno: 2, 4, 6, 8, 10. Los impares siempre dejan uno sin pareja: 1, 3, 5, 7, 9. Los pares terminan en 0, 2, 4, 6 u 8.",
        reto: "¿Cuál de estos números es par?",
        opciones: ["7", "12", "15"],
        correcta: 1
      }
    ]
  },
  figuras: {
    titulo: "🔺 Figuras Geométricas",
    descripcion: "Descubre círculos, triángulos y más",
    lecciones: [
      {
        id: 1,
        titulo: "Lección 1: Círculos, cuadrados y triángulos",
        teoria: "Las figuras geométricas están a nuestro alrededor. El círculo es redondo y no tiene esquinas, el cuadrado tiene 4 lados iguales, el triángulo tiene 3 lados y el rectángulo tiene 4 lados: dos largos y dos cortos.",
        reto: "¿Cómo se llama esta figura?",
        visual: svgFigura('triangulo', 90),
        opciones: ["Cuadrado", "Círculo", "Triángulo"],
        correcta: 2
      },
      {
        id: 2,
        titulo: "Lección 2: Lados y esquinas",
        teoria: "Los lados son las líneas que forman una figura y las esquinas, que se llaman vértices, son los puntos donde se juntan dos lados. El pentágono tiene 5 lados y 5 vértices, y el hexágono tiene 6.",
        reto: "¿Cuántos lados tiene esta figura?",
        visual: svgFigura('pentagono', 90),
        opciones: ["5", "6", "4"],
        correcta: 0
      },
      {
        id: 3,
        titulo: "Lección 3: Cuerpos geométricos",
        teoria: "Algunas figuras no son planas: tienen volumen y las podemos tocar. Se llaman cuerpos geométricos. La esfera es como una pelota, el cubo es como un dado, el cilindro es como una lata y el cono es como un gorro de fiesta.",
        reto: "¿Qué cuerpo geométrico tiene forma de pelota?",
        opciones: ["Cubo", "Cono", "Esfera"],
        correcta: 2
      }
    ]
  },
  fracciones: {
    titulo: "🍕 Fracciones",
    descripcion: "Aprende con pizza y chocolate",
    lecciones: [
      {
        id: 1,
        titulo: "Lección 1: Partes de un entero",
        teoria: "Una fracción es una o varias partes iguales de un entero. Si partes una pizza en 4 trozos iguales y te comes 1, comiste un cuarto de la pizza. Se escribe 1/4: el número de abajo dice en cuántas partes iguales se partió el entero y el de arriba cuántas partes tomamos.",
        reto: "Esta pizza se partió en 4 trozos iguales y te comes el trozo de color. ¿Qué fracción de la pizza comiste?",
        visual: svgFraccion(1, 4, 90),
        opciones: ["1/2", "1/4", "4/1"],
        correcta: 1
      },
      {
        id: 2,
        titulo: "Lección 2: Numerador y denominador",
        teoria: "Las dos partes de una fracción tienen nombre. El número de abajo es el denominador y dice en cuántas partes iguales se partió el entero. El número de arriba es el numerador y dice cuántas de esas partes tomamos. En 3/4, el entero se partió en 4 partes y tomamos 3.",
        reto: "Mira la pizza. ¿Qué fracción está pintada?",
        visual: svgFraccion(3, 4, 90),
        opciones: ["3/4", "4/3", "1/4"],
        correcta: 0
      },
      {
        id: 3,
        titulo: "Lección 3: Comparar fracciones",
        teoria: "Comparar fracciones es decidir cuál es más grande. Si dos fracciones tienen el mismo denominador, sus trozos son del mismo tamaño y es mayor la que tiene más trozos, es decir, el numerador más grande. Por ejemplo, 3/8 es mayor que 2/8.",
        reto: "¿Qué fracción de pizza es mayor: 2/6 o 5/6?",
        opciones: ["2/6", "5/6", "Son iguales"],
        correcta: 1
      }
    ]
  },
  problemas: {
    titulo: "🧩 Problemas",
    descripcion: "Resuelve retos con lógica y matemáticas",
    lecciones: [
      {
        id: 1,
        titulo: "Lección 1: Problemas de sumar y restar",
        teoria: "Un problema es una historia con una pregunta. Para resolverlo, lee con calma, busca los datos, decide qué operación necesitas y calcula. Las palabras «en total» y «más» avisan de una suma, y «quedan» o «se van» avisan de una resta.",
        reto: "Luis tiene 8 canicas y gana 5 más. ¿Cuántas canicas tiene en total?",
        opciones: ["12", "13", "14"],
        correcta: 1
      },
      {
        id: 2,
        titulo: "Lección 2: Problemas de multiplicar y dividir",
        teoria: "Cuando hay grupos iguales y quieres saber el total, multiplicas. Cuando repartes una cantidad en partes iguales, divides. Por ejemplo, 3 bolsas con 4 naranjas cada una son 3 x 4 = 12 naranjas, y repartir 12 naranjas entre 3 niños es 12 ÷ 3 = 4.",
        reto: "Hay 4 bolsas con 5 manzanas cada una. ¿Cuántas manzanas hay en total?",
        opciones: ["9", "20", "25"],
        correcta: 1
      },
      {
        id: 3,
        titulo: "Lección 3: Problemas de dos pasos",
        teoria: "Algunos problemas necesitan dos operaciones. Se resuelven por partes: primero haces una operación y después usas su resultado para hacer la otra. ¡Es como subir una escalera, un escalón a la vez!",
        reto: "Ana tenía 10 galletas, compró 5 más y luego se comió 3. ¿Cuántas galletas le quedan?",
        opciones: ["11", "12", "13"],
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
  actualizarRutaSumi();
  renderizarMapa();     // el mapa es la vista general; se muestra mientras llega la ruta del servidor
  sincronizarGrafo();   // trae del servidor el estado del grafo de conocimiento de este estudiante
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
  grafo = null;
  renderizarMapa();
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
  ],
  'divisiones-1': [
    ['Tienes 6 galletas y las repartes entre 3 niños por igual. ¿Cuántas galletas recibe cada niño?', ['3', '2', '4'], 1, 'Da una galleta a cada niño, una por una, y repite hasta que se acaben. Después cuenta las que tiene un solo niño.'],
    ['Si repartes 10 estrellas entre 5 amigos por igual, ¿cuántas estrellas recibe cada uno?', ['2', '5', '3'], 0, 'Reparte las estrellas de una en una entre los 5 amigos, como si repartieras cartas, hasta que no quede ninguna.']
  ],
  'divisiones-2': [
    ['¿Cómo se lee el signo ÷ ?', ['Entre', 'Más', 'Por'], 0, 'Piensa en la palabra que usamos al repartir, como en «6 galletas ___ 2 niños».'],
    ['12 ÷ 3 =', ['4', '3', '5'], 0, 'Reparte 12 objetos en 3 grupos, uno por grupo, hasta que se acaben. Cuenta cuántos tiene cada grupo.']
  ],
  'divisiones-3': [
    ['Si 3 x 5 = 15, entonces 15 ÷ 5 =', ['5', '3', '10'], 1, 'Una división deshace una multiplicación. Piensa: ¿qué número multiplicado por 5 da 15?'],
    ['18 ÷ 2 =', ['8', '9', '7'], 1, 'Busca el número que, multiplicado por 2, da 18. También puedes repartir 18 objetos en 2 grupos.']
  ],
  'numeros-1': [
    ['¿Qué número viene después del 9?', ['8', '10', '11'], 1, 'Cuenta en voz alta: siete, ocho, nueve... ¿cuál es el número que sigue?'],
    ['Cuenta las estrellas. ¿Cuántas hay?', ['8', '9', '10'], 0, 'Señala cada estrella con el dedo y di un número por cada una, sin saltarte ninguna.', '⭐⭐⭐⭐⭐⭐⭐⭐']
  ],
  'numeros-2': [
    ['¿Qué número es mayor: 12 o 15?', ['12', '15', 'Son iguales'], 1, 'Los dos tienen una decena. Compara las unidades: el que tenga más unidades es el mayor.'],
    ['Completa con el signo correcto: 3 __ 9', ['&lt;', '&gt;', '='], 0, 'La boca del signo siempre se abre hacia el número más grande. ¿Cuál de los dos es el más grande?']
  ],
  'numeros-3': [
    ['¿Cuál de estos números es impar?', ['10', '16', '13'], 2, 'Mira la última cifra de cada número. Los impares terminan en 1, 3, 5, 7 o 9.'],
    ['Si cuentas de 2 en 2 desde el 2, ¿qué número sigue? 2, 4, 6, __', ['7', '8', '10'], 1, 'Cada número es 2 más que el anterior. Suma 2 al último número que ves.']
  ],
  'figuras-1': [
    ['¿Qué figura es redonda y no tiene esquinas?', ['Cuadrado', 'Círculo', 'Rectángulo'], 1, 'Piensa en una moneda o en una rueda: ¿tienen esquinas o son completamente redondas?'],
    ['¿Cómo se llama esta figura?', ['Triángulo', 'Rectángulo', 'Cuadrado'], 2, 'Cuenta sus lados y fíjate si todos miden lo mismo. Compáralo con lo que viste en la teoría.', svgFigura('cuadrado', 90)]
  ],
  'figuras-2': [
    ['¿Cómo se llaman las esquinas de una figura?', ['Vértices', 'Lados', 'Caras'], 0, 'Es el nombre del punto donde se juntan dos lados de la figura.'],
    ['¿Qué figura tiene 3 lados y 3 esquinas?', ['Cuadrado', 'Círculo', 'Triángulo'], 2, 'Piensa en el techo de una casita o en una señal de precaución. Cuenta sus lados.']
  ],
  'figuras-3': [
    ['¿Cuántas caras tiene un cubo?', ['4', '6', '8'], 1, 'Piensa en un dado: cuenta la cara de arriba, la de abajo y las cuatro de los lados.'],
    ['¿A qué cuerpo geométrico se parece una lata de atún?', ['Cilindro', 'Cono', 'Esfera'], 0, 'Fíjate en que tiene dos círculos planos, uno arriba y otro abajo, y un lado curvo en medio.']
  ],
  'fracciones-1': [
    ['¿En cuántas partes iguales está partida esta pizza?', ['2', '3', '4'], 1, 'Cuenta todos los trozos de la pizza, tanto el que tiene color como los que están en blanco.', svgFraccion(1, 3, 90)],
    ['Partes una barra de chocolate en 2 partes iguales y te comes una. ¿Qué fracción comiste?', ['La mitad', 'Un cuarto', 'Un tercio'], 0, 'Si partes algo en 2 partes iguales, cada parte es la mitad. ¿Cuántas partes comiste?', svgBarra(1, 2)]
  ],
  'fracciones-2': [
    ['En la fracción 2/5, ¿cuál es el numerador?', ['2', '5', '7'], 0, 'El numerador es el número de arriba: dice cuántas partes tomamos.'],
    ['Esta barra de chocolate tiene 6 cuadritos y te comes los pintados. ¿Qué fracción comiste?', ['6/5', '5/6', '1/6'], 1, 'Cuenta los cuadritos pintados para el numerador y todos los cuadritos de la barra para el denominador.', svgBarra(5, 6)]
  ],
  'fracciones-3': [
    ['¿Qué fracción es mayor: 3/8 o 5/8?', ['3/8', '5/8', 'Son iguales'], 1, 'Las dos fracciones tienen trozos del mismo tamaño (octavos). Gana la que tiene más trozos.'],
    ['Si partes una pizza en 2 trozos iguales o en 8 trozos iguales, ¿en cuál caso cada trozo es más grande?', ['En 2 trozos', 'En 8 trozos', 'Son iguales'], 0, 'Imagina que repartes la misma pizza entre pocas o entre muchas personas: ¿a quién le toca un trozo más grande?']
  ],
  'problemas-1': [
    ['Hay 12 patos en el lago y se van 4. ¿Cuántos patos quedan?', ['8', '7', '9'], 0, '«Se van» y «quedan» avisan de una resta. Parte de 12 y quita los 4 que se van.'],
    ['Sofía tiene 6 lápices rojos y 7 lápices azules. ¿Cuántos lápices tiene en total?', ['12', '13', '14'], 1, '«En total» avisa de una suma: junta los lápices rojos con los azules.']
  ],
  'problemas-2': [
    ['En el parque hay 3 mesas con 4 niños en cada una. ¿Cuántos niños hay en total?', ['7', '12', '10'], 1, 'Son grupos iguales: 3 mesas con 4 niños cada una. Multiplica o suma el 4 tres veces.'],
    ['Tienes 15 caramelos y los repartes entre 5 amigos por igual. ¿Cuántos caramelos recibe cada uno?', ['3', '5', '10'], 0, '«Repartes entre» avisa de una división. Busca el número que multiplicado por 5 da 15.']
  ],
  'problemas-3': [
    ['Tomás tiene 7 cromos, compra 5 más y luego regala 4. ¿Cuántos cromos le quedan?', ['8', '9', '16'], 0, 'Resuélvelo en dos pasos: primero suma los cromos que compra y, al resultado, réstale los que regala.'],
    ['Hay 3 cajas con 4 lápices cada una y se pierden 2 lápices. ¿Cuántos lápices quedan?', ['12', '10', '14'], 1, 'Primero calcula cuántos lápices hay en total en las cajas y después quita los que se pierden.']
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
  'multiplicaciones-3': 'Piensa en 5 grupos de 4 (o 4 grupos de 5) y suma de forma repetida, o salta de 5 en 5 cuatro veces.',
  'divisiones-1': 'Reparte los objetos uno por uno entre cada persona o grupo, como si repartieras cartas, y luego cuenta cuántos le tocan a uno solo.',
  'divisiones-2': 'Lee el signo ÷ como «entre» o «repartido en»; reparte el total en partes iguales y cuenta cuántos elementos queda en cada grupo.',
  'divisiones-3': 'Usa la multiplicación al revés: busca qué número multiplicado por el divisor te da el número inicial (o reparte en grupos iguales).',
  'numeros-1': 'Cuenta en orden sin saltarte ninguno, señalando cada elemento o siguiendo la secuencia numérica de uno en uno.',
  'numeros-2': 'Compara las decenas y luego las unidades para ver cuál es mayor; recuerda que la boca del signo siempre apunta hacia el número más grande.',
  'numeros-3': 'Observa la última cifra para identificar pares (terminan en 0, 2, 4, 6, 8) e impares (terminan en 1, 3, 5, 7, 9), o suma el paso indicado en cada salto.',
  'figuras-1': 'Fíjate en si tiene bordes curvos o lados rectos y esquinas, y compara cuántos lados tiene y si miden lo mismo.',
  'figuras-2': 'Cuenta lados y esquinas (vértices) y asocia la figura con objetos cotidianos que tengan esa misma forma.',
  'figuras-3': 'Imagina el cuerpo geométrico en 3D y cuenta sus caras planas, bases circulares o superficies curvas comparándolo con objetos reales.',
  'fracciones-1': 'Cuenta el total de partes iguales en que se divide el entero y fíjate cuántas partes se toman o destacan.',
  'fracciones-2': 'El numerador (arriba) indica las partes tomadas o pintadas, y el denominador (abajo) indica el total de partes iguales del entero.',
  'fracciones-3': 'Si tienen el mismo denominador, gana quien tenga más partes; si comparas tamaños de trozo, a menos partes iguales, más grande es cada trozo.',
  'problemas-1': 'Identifica las palabras clave: «juntar» o «en total» suele indicar suma, mientras que «se van», «quitan» o «quedan» indica resta.',
  'problemas-2': 'Si hay varios grupos con la misma cantidad, multiplica (o suma repetidamente); si repartes en partes iguales, divide.',
  'problemas-3': 'Resuélvelo en dos pasos: haz primero la operación inicial (juntar o agrupar) y luego aplica la segunda sobre ese resultado.'
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
    ],
  'divisiones-1': [
    { tipo: 'escrita', q: 'Tienes 12 lápices y los repartes entre 4 niños por igual. ¿Cuántos lápices recibe cada niño?', respuestas: ['3', 'tres'], numerico: true,
      pista: 'Reparte los lápices de uno en uno entre los 4 niños y repite hasta que no quede ninguno. Después cuenta los de un niño.' },
    { tipo: 'relacionar', q: 'Une cada reparto con lo que recibe cada niño.',
      pares: [['4 dulces entre 2 niños', '2'], ['9 dulces entre 3 niños', '3'], ['8 dulces entre 2 niños', '4'], ['10 dulces entre 2 niños', '5']],
      pista: 'Reparte los dulces de uno en uno entre los niños y cuenta cuántos le tocan a cada uno. Después busca ese número en la otra columna.' },
    { tipo: 'arrastrar', q: 'Arrastra cada reparto a la caja con lo que recibe cada niño.',
      zonas: [{ id: 'a', titulo: 'Cada niño recibe 2' }, { id: 'b', titulo: 'Cada niño recibe 3' }],
      fichas: [{ t: '4 entre 2', zona: 'a' }, { t: '6 entre 3', zona: 'a' }, { t: '10 entre 5', zona: 'a' },
               { t: '6 entre 2', zona: 'b' }, { t: '9 entre 3', zona: 'b' }, { t: '12 entre 4', zona: 'b' }],
      pista: 'Calcula cuánto recibe cada niño en cada reparto. Para comprobar, multiplica lo que recibe cada uno por el número de niños: debe darte el total.' }
  ],
  'divisiones-2': [
    { tipo: 'escrita', q: 'Hay 14 manzanas y se reparten entre 2 cestas por igual. ¿Cuántas manzanas hay en cada cesta?', respuestas: ['7', 'siete'], numerico: true,
      pista: '«Entre 2 cestas» significa 2 grupos. Piensa en la división de las 14 manzanas y reparte de una en una.' },
    { tipo: 'relacionar', q: 'Une cada historia con la división que la representa.',
      pares: [['Repartes 8 galletas entre 2 niños', '8 ÷ 2'], ['Repartes 9 dulces entre 3 amigos', '9 ÷ 3'],
              ['Repartes 10 lápices entre 5 niños', '10 ÷ 5'], ['Repartes 12 estrellas entre 4 cajas', '12 ÷ 4']],
      pista: 'En cada historia, el primer número es lo que se reparte y el número que va después de «entre» es el de grupos. Escribe la división en ese orden.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para convertir una historia en una división.',
      pasos: ['Lee la historia y busca cuántas cosas hay que repartir', 'Busca entre cuántas personas o grupos se reparte',
              'Escribe la cantidad total, el signo ÷ y el número de grupos', 'Calcula cuánto recibe cada uno y escríbelo después del signo ='],
      pista: 'Primero entiendes la historia, luego escribes la división y, por último, calculas lo que recibe cada uno.' }
  ],
  'divisiones-3': [
    { tipo: 'escrita', q: 'Escribe el resultado de 24 ÷ 4.', respuestas: ['6', 'seis'], numerico: true,
      pista: 'Busca el número que multiplicado por 4 da 24. Puedes saltar de 4 en 4 y contar los saltos que das hasta llegar a 24.' },
    { tipo: 'arrastrar', q: 'Arrastra cada división a la caja con su resultado.',
      zonas: [{ id: 'a', titulo: 'El resultado es 3' }, { id: 'b', titulo: 'El resultado es 5' }],
      fichas: [{ t: '6 ÷ 2', zona: 'a' }, { t: '9 ÷ 3', zona: 'a' }, { t: '12 ÷ 4', zona: 'a' },
               { t: '10 ÷ 2', zona: 'b' }, { t: '15 ÷ 3', zona: 'b' }, { t: '20 ÷ 4', zona: 'b' }],
      pista: 'Resuelve cada división con la tabla de multiplicar del número que divide. Para comprobar, multiplica el resultado por ese número.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para resolver 12 ÷ 3 usando la multiplicación.',
      pasos: ['Lee la división: 12 ÷ 3', 'Busca qué número multiplicado por 3 da 12', 'Prueba con la tabla del 3: 3 x 4 = 12', 'Escribe el resultado: 12 ÷ 3 = 4'],
      pista: 'Primero lees la división, luego buscas el número que falta con la tabla y, al final, escribes el resultado.' }
  ],
  'numeros-1': [
    { tipo: 'escrita', q: 'Cuenta los globos y escribe cuántos hay.', respuestas: ['12', 'doce'], numerico: true,
      visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈',
      pista: 'Cuenta de uno en uno y señala cada globo con el dedo para no repetir ninguno. El último número que digas es el total.' },
    { tipo: 'relacionar', q: 'Une cada número con su nombre.',
      pares: [['3', 'tres'], ['5', 'cinco'], ['8', 'ocho'], ['10', 'diez']],
      pista: 'Recuerda la lista de nombres: uno, dos, tres, cuatro, cinco... Cuenta con los dedos hasta llegar a cada número.' },
    { tipo: 'arrastrar', q: 'Arrastra cada número a la caja que le corresponde.',
      zonas: [{ id: 'a', titulo: 'Del 1 al 5' }, { id: 'b', titulo: 'Del 6 al 10' }],
      fichas: [{ t: '2', zona: 'a' }, { t: '4', zona: 'a' }, { t: '5', zona: 'a' },
               { t: '7', zona: 'b' }, { t: '9', zona: 'b' }, { t: '10', zona: 'b' }],
      pista: 'Cuenta desde el 1 y fíjate en si el número aparece antes o después del 5. El 5 pertenece a la primera caja.' }
  ],
  'numeros-2': [
    { tipo: 'escrita', q: '¿Qué número es menor: 14 o 11? Escríbelo.', respuestas: ['11', 'once'], numerico: true,
      pista: 'Los dos tienen una decena. Compara las unidades y elige el número que tenga menos.' },
    { tipo: 'relacionar', q: 'Une cada pareja de números con el número mayor.',
      pares: [['4 y 7', '7'], ['9 y 6', '9'], ['12 y 15', '15'], ['20 y 18', '20']],
      pista: 'En cada pareja, el número mayor es el que tiene más cosas. Si tienen igual de decenas, compara las unidades.' },
    { tipo: 'ordenar', q: 'Ordena estos números de menor a mayor.',
      pasos: ['3', '8', '12', '17', '21'],
      pista: 'Empieza por el número más pequeño y avanza hacia el más grande. Los de una cifra siempre son menores que los de dos cifras.' }
  ],
  'numeros-3': [
    { tipo: 'escrita', q: 'Escribe el número que sigue: 10, 12, 14, 16, __', respuestas: ['18', 'dieciocho'], numerico: true,
      pista: 'Fíjate de cuánto en cuánto avanzan los números. Súmale esa misma cantidad al último que ves.' },
    { tipo: 'arrastrar', q: 'Clasifica cada número: ¿es par o impar?',
      zonas: [{ id: 'p', titulo: 'Pares' }, { id: 'i', titulo: 'Impares' }],
      fichas: [{ t: '14', zona: 'p' }, { t: '9', zona: 'i' }, { t: '20', zona: 'p' },
               { t: '17', zona: 'i' }, { t: '6', zona: 'p' }, { t: '5', zona: 'i' }],
      pista: 'Mira la última cifra: si es 0, 2, 4, 6 u 8, el número es par. Si no, es impar.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para saber si un número es par o impar.',
      pasos: ['Mira el número que quieres clasificar', 'Fíjate en su última cifra', 'Compara esa cifra con 0, 2, 4, 6 y 8', 'Decide: si coincide es par; si no coincide es impar'],
      pista: 'Primero miras el número, luego te fijas en la última cifra, la comparas con la lista y, al final, decides.' }
  ],
  'figuras-1': [
    { tipo: 'escrita', q: 'Escribe cuántos lados tiene un cuadrado.', respuestas: ['4', 'cuatro'], numerico: true,
      pista: 'Imagina que dibujas un cuadrado con tu dedo y cuenta cuántas líneas rectas trazas hasta cerrarlo.' },
    { tipo: 'relacionar', q: 'Une cada objeto con la figura que tiene.',
      pares: [['Una moneda', 'Círculo'], ['Una baldosa cuadrada', 'Cuadrado'], ['Una señal de precaución', 'Triángulo'], ['Una puerta', 'Rectángulo']],
      pista: 'Piensa en la forma del contorno de cada objeto: si es redondo, cuántos lados rectos tiene y si todos miden lo mismo.' },
    { tipo: 'arrastrar', q: 'Arrastra cada figura u objeto a la caja según tenga esquinas o no.',
      zonas: [{ id: 'e', titulo: 'Tiene esquinas' }, { id: 'n', titulo: 'No tiene esquinas' }],
      fichas: [{ t: 'Cuadrado', zona: 'e' }, { t: 'Triángulo', zona: 'e' }, { t: 'Puerta', zona: 'e' },
               { t: 'Círculo', zona: 'n' }, { t: 'Moneda', zona: 'n' }, { t: 'Rueda', zona: 'n' }],
      pista: 'Las figuras con lados rectos tienen esquinas donde se juntan sus lados. Las redondas no tienen ninguna.' }
  ],
  'figuras-2': [
    { tipo: 'escrita', q: 'Si juntas un cuadrado y un triángulo, ¿cuántos lados tienen entre las dos figuras?', respuestas: ['7', 'siete'], numerico: true,
      pista: 'Recuerda cuántos lados tiene cada figura y suma las dos cantidades.' },
    { tipo: 'relacionar', q: 'Une cada figura con su número de lados.',
      pares: [['Triángulo', '3 lados'], ['Cuadrado', '4 lados'], ['Pentágono', '5 lados'], ['Hexágono', '6 lados']],
      pista: 'Los nombres te dan una pista: el triángulo tiene tres ángulos y el pentágono es el que tiene cinco. Cuenta con el dedo los lados de cada figura.' },
    { tipo: 'ordenar', q: 'Ordena estas figuras de la que tiene menos lados a la que tiene más.',
      pasos: ['Triángulo', 'Cuadrado', 'Pentágono', 'Hexágono'],
      pista: 'Recuerda cuántos lados tiene cada figura y empieza por la que tenga menos.' }
  ],
  'figuras-3': [
    { tipo: 'escrita', q: 'Una pelota es una esfera. ¿Cuántas esquinas tiene una esfera?', respuestas: ['0', 'cero', 'ninguna'], numerico: true,
      pista: 'Piensa en una pelota: ¿hay algún punto donde se junten dos lados, o es toda curva?' },
    { tipo: 'arrastrar', q: 'Arrastra cada objeto a la caja del cuerpo geométrico al que se parece.',
      zonas: [{ id: 'e', titulo: 'Se parece a una esfera' }, { id: 'c', titulo: 'Se parece a un cilindro' }],
      fichas: [{ t: 'Pelota', zona: 'e' }, { t: 'Canica', zona: 'e' }, { t: 'Globo terráqueo', zona: 'e' },
               { t: 'Lata', zona: 'c' }, { t: 'Tubo de cartón', zona: 'c' }, { t: 'Barril', zona: 'c' }],
      pista: 'La esfera es toda redonda, como una pelota. El cilindro tiene dos círculos planos y un lado curvo, como una lata.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para reconocer un cuerpo geométrico.',
      pasos: ['Mira el objeto y toca su forma', 'Pregúntate si tiene partes planas o es todo curvo', 'Cuenta sus caras y sus esquinas', 'Compáralo con el cubo, la esfera, el cilindro y el cono, y elige su nombre'],
      pista: 'Primero observas el objeto, luego te fijas en sus partes y, al final, lo comparas con los cuerpos que conoces.' }
  ],
  'fracciones-1': [
    { tipo: 'escrita', q: 'Una pizza se partió en 6 trozos iguales y te comes 1. Escribe la fracción que comiste (por ejemplo, 1/2).', respuestas: ['1/6', '1 / 6'],
      visual: svgFraccion(1, 6, 90),
      pista: 'Cuenta en cuántos trozos iguales se partió la pizza: ese número va abajo. Después cuenta los trozos que comiste: ese va arriba.' },
    { tipo: 'relacionar', q: 'Une cada parte de una pizza con su fracción.',
      pares: [['La mitad de una pizza', '1/2'], ['Un tercio de una pizza', '1/3'], ['Un cuarto de una pizza', '1/4'], ['Un sexto de una pizza', '1/6']],
      pista: 'Mientras más trozos iguales tiene la pizza, más grande es el número de abajo. La mitad es la que se parte en solo 2 trozos.' },
    { tipo: 'arrastrar', q: 'Arrastra cada fracción a la caja que dice en cuántas partes iguales está partido el entero.',
      zonas: [{ id: 'a', titulo: 'Partido en 4 partes' }, { id: 'b', titulo: 'Partido en 8 partes' }],
      fichas: [{ t: '1/4', zona: 'a' }, { t: '3/4', zona: 'a' }, { t: '2/4', zona: 'a' },
               { t: '1/8', zona: 'b' }, { t: '5/8', zona: 'b' }, { t: '7/8', zona: 'b' }],
      pista: 'Fíjate solo en el número de abajo de cada fracción: ese es el que dice en cuántas partes iguales se partió el entero.' }
  ],
  'fracciones-2': [
    { tipo: 'escrita', q: 'Una pizza está partida en 8 trozos iguales y te comes 3. Escribe la fracción que comiste (por ejemplo, 1/2).', respuestas: ['3/8', '3 / 8'],
      visual: svgFraccion(3, 8, 90),
      pista: 'El número de abajo es el total de trozos de la pizza y el de arriba son los trozos que comiste.' },
    { tipo: 'relacionar', q: 'Une cada fracción con la forma de leerla.',
      pares: [['1/2', 'un medio'], ['1/3', 'un tercio'], ['1/4', 'un cuarto'], ['3/4', 'tres cuartos']],
      pista: 'El numerador dice cuántas partes tomamos y el denominador le da su nombre: medios, tercios, cuartos... En 3/4 son tres de esos cuartos.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para escribir la fracción que representa una pizza.',
      pasos: ['Cuenta en cuántas partes iguales está partida la pizza', 'Escribe ese número abajo, como denominador',
              'Cuenta cuántas partes están pintadas', 'Escribe ese número arriba, como numerador'],
      pista: 'Primero se cuentan todas las partes de la pizza y se escribe el denominador; después se cuentan las pintadas y se escribe el numerador.' }
  ],
  'fracciones-3': [
    { tipo: 'escrita', q: 'Escribe la fracción mayor: 2/6 o 5/6.', respuestas: ['5/6', '5 / 6'],
      visual: `${svgBarra(2, 6)}<br>${svgBarra(5, 6)}`,
      pista: 'Los dos denominadores son 6, así que los trozos son iguales. La fracción con más trozos, es decir, el numerador mayor, es la más grande.' },
    { tipo: 'arrastrar', q: 'Todas estas pizzas están partidas en 8 trozos. Arrastra cada fracción a la caja correcta.',
      zonas: [{ id: 'a', titulo: 'Menos de la mitad' }, { id: 'b', titulo: 'Más de la mitad' }],
      fichas: [{ t: '1/8', zona: 'a' }, { t: '2/8', zona: 'a' }, { t: '3/8', zona: 'a' },
               { t: '5/8', zona: 'b' }, { t: '6/8', zona: 'b' }, { t: '7/8', zona: 'b' }],
      pista: 'La mitad de 8 trozos son 4 trozos (4/8). Si tomas menos de 4 es menos de la mitad y si tomas más de 4 es más de la mitad.' },
    { tipo: 'ordenar', q: 'Ordena estas fracciones de la más pequeña a la más grande.',
      pasos: ['1/6', '2/6', '4/6', '5/6'],
      pista: 'Todas tienen denominador 6, así que solo debes comparar los numeradores. Empieza por la que tiene el numerador más pequeño.' }
  ],
  'problemas-1': [
    { tipo: 'escrita', q: 'En una caja hay 15 galletas y te comes 6. ¿Cuántas galletas quedan?', respuestas: ['9', 'nueve'], numerico: true,
      pista: '«Te comes» y «quedan» avisan de una resta. Parte de 15 y quita las 6 que te comes.' },
    { tipo: 'relacionar', q: 'Une cada historia con la operación que la resuelve.',
      pares: [['Tienes 5 y te regalan 3', '5 + 3'], ['Tienes 9 y regalas 4', '9 - 4'], ['Hay 6 y llegan 2 más', '6 + 2'], ['Hay 8 y se van 3', '8 - 3']],
      pista: 'Busca la palabra que avisa: «te regalan» y «llegan más» juntan cantidades; «regalas» y «se van» las quitan.' },
    { tipo: 'arrastrar', q: 'Arrastra cada situación a la caja de la operación que necesita.',
      zonas: [{ id: 's', titulo: 'Se suma' }, { id: 'r', titulo: 'Se resta' }],
      fichas: [{ t: 'Ganas 3 canicas', zona: 's' }, { t: 'Llegan 4 amigos', zona: 's' }, { t: 'Compras 2 globos', zona: 's' },
               { t: 'Te comes 2 galletas', zona: 'r' }, { t: 'Se van 5 patos', zona: 'r' }, { t: 'Regalas 3 colores', zona: 'r' }],
      pista: 'Si la historia añade o junta cosas, se suma. Si quita, regala o se va algo, se resta.' }
  ],
  'problemas-2': [
    { tipo: 'escrita', q: 'Una caja tiene 6 huevos. ¿Cuántos huevos hay en 3 cajas?', respuestas: ['18', 'dieciocho'], numerico: true,
      pista: 'Son 3 grupos iguales de 6 huevos. Suma el 6 tres veces o salta de 6 en 6.' },
    { tipo: 'arrastrar', q: 'Arrastra cada problema a la caja de la operación que necesita.',
      zonas: [{ id: 'm', titulo: 'Se multiplica (grupos iguales)' }, { id: 'd', titulo: 'Se divide (repartir)' }],
      fichas: [{ t: '4 filas de 5 sillas', zona: 'm' }, { t: '3 bolsas con 6 dulces cada una', zona: 'm' }, { t: '5 cajas con 2 lápices cada una', zona: 'm' },
               { t: 'Repartes 12 galletas entre 3', zona: 'd' }, { t: 'Repartes 20 estrellas entre 4 niños', zona: 'd' }, { t: 'Compartes 10 uvas entre 2 amigos', zona: 'd' }],
      pista: 'Si te dan varios grupos iguales y pides el total, multiplica. Si te piden repartir una cantidad entre varios, divide.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para resolver: «Hay 3 bolsas con 4 naranjas cada una. ¿Cuántas naranjas hay?»',
      pasos: ['Veo que hay 3 bolsas iguales con 4 naranjas cada una', 'Como son grupos iguales, multiplico', 'Calculo 3 x 4 = 12', 'Respondo: hay 12 naranjas'],
      pista: 'Primero entiendes la historia, luego eliges la operación, después calculas y, al final, respondes la pregunta.' }
  ],
  'problemas-3': [
    { tipo: 'escrita', q: 'Marta tenía 20 pesos, compró un dulce de 8 pesos y una paleta de 5 pesos. ¿Cuántos pesos le quedan?', respuestas: ['7', 'siete'], numerico: true,
      pista: 'Resta en dos pasos: primero quita los 8 pesos del dulce y, a lo que te quedó, quítale los 5 pesos de la paleta.' },
    { tipo: 'ordenar', q: 'Ordena los pasos para resolver un problema de dos pasos.',
      pasos: ['Lee el problema y busca sus dos partes', 'Resuelve la primera operación', 'Usa ese resultado para resolver la segunda operación', 'Escribe la respuesta final'],
      pista: 'Se resuelve una parte a la vez: lo que obtienes en la primera operación lo necesitas para la segunda.' },
    { tipo: 'relacionar', q: 'Une cada problema con las dos operaciones que necesita.',
      pares: [['Tienes 5, ganas 3 y regalas 2', '5 + 3 - 2'], ['Hay 10, llegan 4 y se van 6', '10 + 4 - 6'],
              ['Tienes 9, regalas 4 y luego regalas 2', '9 - 4 - 2'], ['2 bolsas con 5 dulces y se pierden 3', '2 x 5 - 3']],
      pista: 'Escribe las operaciones en el mismo orden en que ocurren en la historia: «ganas» suma, «regalas» o «se van» resta y los grupos iguales se multiplican.' }
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
    ],
  'divisiones-1': [
    '🍪🍪🍪🍪🍪🍪<br>👦 &nbsp; 👧<br><small>6 galletas para 2 niños: ¡a repartir!</small>',
    '🍬🍬🍬🍬 &nbsp; 🍬🍬🍬🍬<br><small>Dos grupos con la misma cantidad</small>'
  ],
  'divisiones-2': [
    '6️⃣ &nbsp;➗&nbsp; 2️⃣<br><small>Seis entre dos</small>',
    '🔟 &nbsp;➗&nbsp; 5️⃣<br><small>Diez entre cinco</small>'
  ],
  'divisiones-3': [
    '3️⃣ &nbsp;✖️&nbsp; 4️⃣ &nbsp;=&nbsp; 1️⃣2️⃣<br><small>La multiplicación te ayuda a dividir</small>',
    '1️⃣2️⃣ &nbsp;➗&nbsp; 3️⃣ &nbsp;=&nbsp; 4️⃣<br><small>La división deshace la multiplicación</small>'
  ],
  'numeros-1': [
    '1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣<br><small>Contamos de uno en uno</small>',
    '🍎🍎🍎🍎🍎🍎<br><small>Un número por cada manzana</small>'
  ],
  'numeros-2': [
    '9️⃣ &nbsp;&gt;&nbsp; 4️⃣<br><small>Nueve es mayor que cuatro</small>',
    '2️⃣ &nbsp;&lt;&nbsp; 7️⃣<br><small>Dos es menor que siete</small>'
  ],
  'numeros-3': [
    '2️⃣ 4️⃣ 6️⃣ 8️⃣<br><small>Números pares</small>',
    '1️⃣ 3️⃣ 5️⃣ 7️⃣<br><small>Números impares</small>'
  ],
  'figuras-1': [
    `${svgFigura('circulo')} ${svgFigura('cuadrado')} ${svgFigura('triangulo')} ${svgFigura('rectangulo')}<br><small>Círculo, cuadrado, triángulo y rectángulo</small>`,
    '🚪 &nbsp; 📖 &nbsp; 🖼️<br><small>Rectángulos de todos los días</small>'
  ],
  'figuras-2': [
    `${svgFigura('triangulo')} ${svgFigura('cuadrado')} ${svgFigura('pentagono')} ${svgFigura('hexagono')}<br><small>3, 4, 5 y 6 lados</small>`,
    `${svgFigura('pentagono', 70)}<br><small>Un pentágono: 5 lados y 5 vértices</small>`
  ],
  'figuras-3': [
    '⚽ &nbsp; 🎲 &nbsp; 🥫 &nbsp; 🍦<br><small>Esfera, cubo, cilindro y cono</small>',
    '🎲<br><small>Un dado es un cubo</small>'
  ],
  'fracciones-1': [
    `${svgFraccion(1, 2)} ${svgFraccion(1, 3)} ${svgFraccion(1, 4)}<br><small>Una pizza partida en partes iguales</small>`,
    `${svgBarra(1, 4)}<br><small>Una barra de chocolate: 1 cuadrito de 4</small>`
  ],
  'fracciones-2': [
    `${svgFraccion(3, 4)}<br><small>3 trozos de 4: la fracción es 3/4</small>`,
    `${svgBarra(2, 6)}<br><small>2 cuadritos de 6: la fracción es 2/6</small>`
  ],
  'fracciones-3': [
    `${svgBarra(2, 6)}<br>${svgBarra(5, 6)}<br><small>5/6 es mayor que 2/6</small>`,
    `${svgFraccion(1, 2)} ${svgFraccion(1, 4)} ${svgFraccion(1, 8)}<br><small>Más trozos, trozos más pequeños</small>`
  ],
  'problemas-1': [
    '🍎🍎🍎🍎🍎🍎🍎🍎 &nbsp;+&nbsp; 🍎🍎🍎🍎🍎<br><small>«En total» avisa de una suma</small>',
    '🐥🐥🐥🐥🐥🐥<br>❌❌ &nbsp; Se van 2 &nbsp; ❌❌<br><small>«Quedan» avisa de una resta</small>'
  ],
  'problemas-2': [
    '🍊🍊🍊 &nbsp; 🍊🍊🍊 &nbsp; 🍊🍊🍊 &nbsp; 🍊🍊🍊<br><small>4 bolsas con 3 naranjas: 4 x 3</small>',
    '🍪🍪🍪🍪🍪🍪<br>👦 &nbsp; 👧 &nbsp; 🧒<br><small>Repartir en partes iguales: dividir</small>'
  ],
  'problemas-3': [
    '5️⃣ &nbsp;➕&nbsp; 3️⃣ &nbsp;➖&nbsp; 2️⃣<br><small>Primero sumamos y después restamos</small>',
    '🪜<br><small>Un escalón a la vez: una operación a la vez</small>'
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
    ],
  'divisiones-1': [
    { t: 'Dividir es repartir', visual: true, p: ['@teoria',
      'Para que sea un reparto justo, todos los grupos deben recibir la misma cantidad. En este curso solo repartiremos cantidades que se dividen justo, sin que sobre nada.'] },
    { t: 'Paso a paso: repartir de uno en uno',
      pasos: ['Cuenta cuántos objetos tienes para repartir.', 'Fíjate entre cuántos niños o grupos los vas a repartir.',
              'Da un objeto a cada grupo, uno por uno, y repite hasta que se acaben.',
              'Cuenta cuántos objetos tiene un grupo: esa es la cantidad que recibe cada uno.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 6 galletas entre 3 niños', visual: '🍪🍪🍪🍪🍪🍪<br>👦 &nbsp; 👧 &nbsp; 🧒',
        lineas: ['Tengo 6 galletas y 3 niños.', 'Doy una galleta a cada niño y repito: primero 3 galletas y luego otras 3.',
                 'Cada niño recibe 2 galletas.'] } },
    { t: 'Dos ideas que te ayudarán',
      p: ['Todos los grupos deben quedar con la misma cantidad; si no, no es una división.',
          'Al repartir, cada grupo recibe menos objetos que el total, porque el total se divide en varias partes.'],
      tip: 'Puedes dibujar los grupos o usar fichas para repartir. ¡Es más fácil verlo!' }
  ],
  'divisiones-2': [
    { t: 'El signo ÷', visual: true, p: ['@teoria',
      'Una división se escribe con tres partes: el total, el signo ÷ y el número de grupos. Después ponemos el signo = (igual) y el resultado. Por ejemplo, 8 ÷ 2 = 4 se lee «ocho entre dos es igual a cuatro».'] },
    { t: 'De una historia a una división',
      pasos: ['Lee la historia y busca cuántas cosas hay que repartir.',
              'Busca entre cuántas personas o grupos se reparten: casi siempre aparece la palabra «entre».',
              'Escribe la cantidad total, el signo ÷ y el número de grupos.',
              'Calcula cuánto recibe cada uno y escríbelo después del signo =.'],
      ejemplo: { titulo: 'Ejemplo resuelto', visual: '🍎🍎🍎🍎🍎🍎🍎🍎🍎<br>🧺 &nbsp; 🧺 &nbsp; 🧺',
        lineas: ['Historia: «Reparto 9 manzanas entre 3 cestas».', '«Entre 3» significa 3 grupos, así que escribo 9 ÷ 3.',
                 'Reparto de una en una: cada cesta recibe 3. Entonces 9 ÷ 3 = 3.'] } },
    { t: 'Cuidado con el orden',
      p: ['En la división el orden sí importa: primero va la cantidad que se reparte y después el número de grupos. 6 ÷ 2 da 3, pero 2 ÷ 6 no se puede repartir en partes enteras.'],
      tip: 'Palabras que avisan de una división: «reparte», «entre», «en partes iguales» y «cada uno».' }
  ],
  'divisiones-3': [
    { t: 'La división y la multiplicación son amigas', visual: true, p: ['@teoria',
      'Mira: 3 grupos de 4 son 12 (3 x 4 = 12). Si ahora repartes esos 12 en 3 grupos, a cada grupo le tocan 4 (12 ÷ 3 = 4).'] },
    { t: 'Paso a paso: dividir con las tablas',
      pasos: ['Lee la división, por ejemplo 20 ÷ 4.', 'Piensa: ¿qué número multiplicado por 4 da 20?',
              'Recuerda la tabla del 4 o salta de 4 en 4 hasta llegar a 20.', 'Cuenta cuántos saltos diste: ese número es el resultado.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 15 ÷ 3', visual: '3️⃣ &nbsp;✖️&nbsp; ❓ &nbsp;=&nbsp; 1️⃣5️⃣',
        lineas: ['Busco qué número multiplicado por 3 da 15.', 'Salto de 3 en 3: 3, 6, 9, 12, 15. Son 5 saltos.',
                 'Como 3 x 5 = 15, entonces 15 ÷ 3 = 5.'] } },
    { t: 'Comprobar con una multiplicación',
      p: ['Para saber si tu división está bien, multiplica el resultado por el número entre el que dividiste: debes volver al número del principio.',
          'Por ejemplo, 12 ÷ 4 = 3, y lo comprobamos con 3 x 4 = 12.'],
      tip: 'Dividir entre 1 deja el número igual (7 ÷ 1 = 7) y dividir un número entre sí mismo siempre da 1 (7 ÷ 7 = 1).' }
  ],
  'numeros-1': [
    { t: 'Contar es poner un número a cada objeto', visual: true, p: ['@teoria',
      'Los números que usamos para contar empiezan en 1 y no nos saltamos ninguno.'] },
    { t: 'Paso a paso: contar objetos',
      pasos: ['Señala el primer objeto y di «uno».', 'Señala el siguiente objeto y di el número que sigue.',
              'Sigue así sin saltarte ni repetir ningún objeto.', 'El último número que dijiste es la cantidad total.'],
      ejemplo: { titulo: 'Ejemplo resuelto: contar patitos', visual: '🐥🐥🐥🐥🐥',
        lineas: ['Señalo el primer patito: 1.', 'Sigo con los demás: 2, 3, 4, 5.', 'El último número fue 5, así que hay 5 patitos.'] } },
    { t: 'Los nombres de los números',
      p: ['Cada número tiene su nombre: 1 uno, 2 dos, 3 tres, 4 cuatro, 5 cinco, 6 seis, 7 siete, 8 ocho, 9 nueve y 10 diez.',
          'Después del 10 siguen once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve y veinte.'],
      tip: 'Si te pierdes al contar, empieza otra vez y ve tachando con el dedo cada objeto que ya contaste.' }
  ],
  'numeros-2': [
    { t: 'Mayor, menor e igual', visual: true, p: ['@teoria',
      'Si dos números tienen la misma cantidad, son iguales. Si uno tiene más que el otro, ese es el mayor.'] },
    { t: 'Paso a paso: comparar dos números',
      pasos: ['Mira cuántas cifras tiene cada número: el que tenga más cifras es el mayor.',
              'Si tienen las mismas cifras, compara primero las decenas (la cifra de la izquierda).',
              'Si las decenas son iguales, compara las unidades.', 'Escribe el signo: la boca se abre hacia el número mayor.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 27 y 24', visual: '2️⃣7️⃣ &nbsp;❓&nbsp; 2️⃣4️⃣',
        lineas: ['Los dos tienen 2 decenas, así que empatan en las decenas.', 'Comparo las unidades: 7 es más que 4.',
                 'Entonces 27 es mayor que 24, y se escribe 27 &gt; 24.'] } },
    { t: 'Los signos &gt; y &lt;',
      p: ['El signo &gt; significa «mayor que», el signo &lt; significa «menor que» y el signo = significa «igual a».',
          'Truco: imagina que el signo es la boca de un cocodrilo hambriento. ¡Siempre se quiere comer al número más grande!'],
      tip: '8 &gt; 5 se lee «ocho es mayor que cinco» y 5 &lt; 8 se lee «cinco es menor que ocho».' }
  ],
  'numeros-3': [
    { t: 'Pares e impares', visual: true, p: ['@teoria',
      'Prueba con tus juguetes: si los puedes poner en parejas y no sobra ninguno, el número es par. Si sobra uno solito, es impar.'] },
    { t: 'Paso a paso: saber si un número es par',
      pasos: ['Mira el número y fíjate en su última cifra.', 'Compara esa cifra con 0, 2, 4, 6 y 8.',
              'Si coincide con alguna, el número es par.', 'Si no coincide con ninguna, el número es impar.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 24 y 35', visual: '2️⃣4️⃣ &nbsp; 3️⃣5️⃣',
        lineas: ['El 24 termina en 4. El 4 está en la lista de los pares, así que 24 es par.',
                 'El 35 termina en 5. El 5 no está en la lista, así que 35 es impar.'] } },
    { t: 'Contar de 2 en 2',
      p: ['Si cuentas de 2 en 2 empezando en 2, obtienes los números pares: 2, 4, 6, 8, 10... Si empiezas en 1, obtienes los impares: 1, 3, 5, 7, 9...',
          'Los pares y los impares se van alternando: un par, un impar, un par, un impar...'],
      tip: 'Si sumas dos números pares, el resultado siempre es par. ¡Pruébalo con 4 + 6!' }
  ],
  'figuras-1': [
    { t: 'Las figuras están en todas partes', visual: true, p: ['@teoria',
      'A estas figuras planas se les llama figuras geométricas. Las puedes dibujar sobre una hoja de papel.'] },
    { t: 'Paso a paso: reconocer una figura',
      pasos: ['Mira la figura: ¿es redonda o tiene lados rectos?', 'Si es redonda y no tiene esquinas, es un círculo.',
              'Si tiene lados rectos, cuéntalos.',
              'Con 3 lados es un triángulo. Con 4 lados iguales es un cuadrado. Con 4 lados, dos largos y dos cortos, es un rectángulo.'],
      ejemplo: { titulo: 'Ejemplo resuelto: una puerta', visual: svgFigura('rectangulo'),
        lineas: ['Una puerta no es redonda: tiene lados rectos.', 'Tiene 4 lados: dos largos y dos cortos.', 'Entonces la puerta tiene forma de rectángulo.'] } },
    { t: 'Cuadrado y rectángulo: ¿en qué se parecen?',
      p: ['Los dos tienen 4 lados y 4 esquinas. La diferencia es que el cuadrado tiene sus 4 lados iguales y el rectángulo tiene lados largos y lados cortos.'],
      tip: 'Busca figuras a tu alrededor: una moneda es un círculo, una baldosa puede ser un cuadrado y una puerta es un rectángulo.' }
  ],
  'figuras-2': [
    { t: 'Lados y vértices', visual: true, p: ['@teoria',
      'En cada figura de lados rectos hay tantos vértices como lados. Por eso, si cuentas los lados, también sabes cuántas esquinas tiene.'] },
    { t: 'Paso a paso: contar lados',
      pasos: ['Elige una esquina como punto de partida y márcala con tu dedo.', 'Sigue el borde de la figura y cuenta cada lado que recorras.',
              'Cuando vuelvas al punto de partida, deja de contar.', 'El último número es la cantidad de lados, y también de vértices.'],
      ejemplo: { titulo: 'Ejemplo resuelto: un pentágono', visual: svgFigura('pentagono', 64),
        lineas: ['Empiezo en una esquina y recorro el borde.', 'Cuento los lados: 1, 2, 3, 4, 5.', 'Tiene 5 lados y 5 vértices, por eso se llama pentágono.'] } },
    { t: 'Los nombres de las figuras',
      p: ['El triángulo tiene 3 lados, el cuadrado y el rectángulo tienen 4, el pentágono tiene 5 y el hexágono tiene 6.',
          'Mientras más lados tiene una figura, más se parece a un círculo.'],
      tip: 'Las abejas construyen sus panales con hexágonos: ¡cada celdita tiene 6 lados!' }
  ],
  'figuras-3': [
    { t: 'Figuras que se pueden tocar', visual: true, p: ['@teoria',
      'Las figuras planas solo tienen largo y ancho. Los cuerpos geométricos tienen además altura, por eso ocupan espacio y puedes sostenerlos con las manos.'] },
    { t: 'Paso a paso: reconocer un cuerpo',
      pasos: ['Toca el objeto y fíjate si tiene partes planas o es todo curvo.', 'Si es todo curvo, como una pelota, es una esfera.',
              'Si tiene caras cuadradas, como un dado, es un cubo.',
              'Si tiene dos círculos planos y un lado curvo, es un cilindro. Si termina en punta, es un cono.'],
      ejemplo: { titulo: 'Ejemplo resuelto: una lata de atún', visual: '🥫',
        lineas: ['La lata tiene un lado curvo.', 'Arriba y abajo tiene dos círculos planos.', 'Entonces es un cilindro.'] } },
    { t: 'Las caras de un cuerpo',
      p: ['Las superficies planas de un cuerpo se llaman caras. El cubo tiene 6 caras y todas son cuadrados iguales.',
          'La esfera no tiene caras planas: ¡es toda curva y no tiene esquinas!'],
      tip: 'Mira un dado y cuenta sus caras: la de arriba, la de abajo y las cuatro de los lados.' }
  ],
  'fracciones-1': [
    { t: 'Partes iguales de un entero', visual: true, p: ['@teoria',
      'Para que sea una fracción, todas las partes deben ser iguales. Si un trozo es más grande que otro, ya no podemos escribirlo como fracción.'] },
    { t: 'Paso a paso: escribir una fracción',
      pasos: ['Mira el entero (una pizza o una barra de chocolate) y cuenta en cuántas partes iguales está partido.',
              'Escribe ese número abajo, debajo de una raya.', 'Cuenta cuántas partes tomas o están pintadas.',
              'Escribe ese número arriba de la raya.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 1 trozo de pizza', visual: svgFraccion(1, 4),
        lineas: ['La pizza está partida en 4 trozos iguales.', 'Me como 1 trozo.', 'La fracción es 1/4 y se lee «un cuarto».'] } },
    { t: 'Fracciones con nombre propio',
      p: ['Algunas fracciones tienen un nombre especial: 1/2 es «un medio» o «la mitad», 1/3 es «un tercio» y 1/4 es «un cuarto».',
          'Si juntas todos los trozos de la pizza, vuelves a tener la pizza completa.'],
      tip: 'Una pizza bien repartida siempre tiene trozos del mismo tamaño. ¡Eso es lo que hace justa a una fracción!' }
  ],
  'fracciones-2': [
    { t: 'Numerador y denominador', visual: true, p: ['@teoria',
      'Truco para no confundirte: la palabra «denominador» empieza con D, como «debajo». El numerador es el que queda arriba.'] },
    { t: 'Paso a paso: leer una fracción',
      pasos: ['Mira el número de abajo: es el denominador y dice en cuántas partes iguales se partió el entero.',
              'Mira el número de arriba: es el numerador y dice cuántas partes tomamos.',
              'Lee primero el numerador y después el nombre de las partes: tres cuartos, dos quintos...',
              'Comprueba dibujando el entero y pintando las partes que indica el numerador.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 3/4', visual: svgFraccion(3, 4),
        lineas: ['El denominador es 4: la pizza está partida en 4 trozos iguales.', 'El numerador es 3: comimos 3 trozos.', 'Se lee «tres cuartos».'] } },
    { t: 'Cada fracción se lee con su nombre',
      p: ['Según el denominador, las partes se llaman: 2 medios, 3 tercios, 4 cuartos, 5 quintos, 6 sextos y 8 octavos.',
          'Por eso 5/8 se lee «cinco octavos»: son 5 trozos de una pizza partida en 8.'],
      tip: 'Si el numerador es igual al denominador, tomaste todas las partes: ¡es el entero completo!' }
  ],
  'fracciones-3': [
    { t: 'Comparar fracciones', visual: true, p: ['@teoria',
      'Piensa en una barra de chocolate partida en cuadritos iguales: la fracción mayor es la que se come más cuadritos.'] },
    { t: 'Paso a paso: comparar con el mismo denominador',
      pasos: ['Mira los denominadores: si son iguales, los trozos tienen el mismo tamaño.', 'Compara los numeradores.',
              'La fracción con el numerador más grande es la mayor.', 'Escribe el signo &gt; o &lt; para comparar.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 2/6 y 5/6', visual: `${svgBarra(2, 6)}<br>${svgBarra(5, 6)}`,
        lineas: ['Los dos denominadores son 6: los trozos son iguales.', 'Comparo los numeradores: 5 es más que 2.', 'Entonces 5/6 es mayor que 2/6 y se escribe 5/6 &gt; 2/6.'] } },
    { t: 'Trozos más grandes y más pequeños',
      p: ['Si partes el entero en más trozos, cada trozo es más pequeño. Por eso 1/8 es menor que 1/4: los octavos son trozos más chiquitos que los cuartos.',
          'La mitad es muy útil para comparar: en una pizza de 8 trozos, 4/8 es la mitad.'],
      tip: 'Si el numerador es menor que la mitad del denominador, la fracción es menor que 1/2.' }
  ],
  'problemas-1': [
    { t: 'Un problema es una historia con una pregunta', visual: true, p: ['@teoria',
      'Los datos son los números de la historia y la pregunta nos dice qué tenemos que averiguar.'] },
    { t: 'Paso a paso: resolver un problema',
      pasos: ['Lee el problema con calma, una o dos veces.', 'Busca los datos (los números) y la pregunta.',
              'Decide la operación: ¿se junta o se quita algo?', 'Calcula y escribe la respuesta con una frase.',
              'Comprueba que tu respuesta contesta lo que preguntaban.'],
      ejemplo: { titulo: 'Ejemplo resuelto', visual: '🐥🐥🐥🐥🐥🐥🐥🐥🐥<br>❌❌❌ se van 3',
        lineas: ['Problema: «Hay 9 patitos y se van 3. ¿Cuántos quedan?».', '«Se van» y «quedan» avisan de una resta, así que escribo 9 - 3.',
                 'Cuento hacia atrás desde 9: 8, 7, 6. Quedan 6 patitos.'] } },
    { t: 'Palabras que te ayudan',
      p: ['Para sumar: «en total», «juntos», «ganas», «llegan», «te regalan», «compras».',
          'Para restar: «quedan», «se van», «regalas», «te comes», «pierdes», «se rompen».'],
      tip: 'Cuando termines, lee tu respuesta dentro de la historia. Si tiene sentido, ¡lo hiciste bien!' }
  ],
  'problemas-2': [
    { t: 'Grupos iguales y repartos', visual: true, p: ['@teoria',
      'Fíjate en la historia: si todos los grupos tienen la misma cantidad y pide el total, multiplica; si hay que repartir, divide.'] },
    { t: 'Paso a paso: multiplicar o dividir',
      pasos: ['Lee la historia y busca si habla de grupos iguales o de un reparto.',
              'Si son grupos iguales y quieres el total, multiplica: grupos x cantidad en cada grupo.',
              'Si repartes entre varios, divide: total ÷ número de grupos.', 'Calcula y responde con una frase.'],
      ejemplo: { titulo: 'Ejemplo resuelto', visual: '🍬🍬🍬🍬<br>🍬🍬🍬🍬<br>🍬🍬🍬🍬',
        lineas: ['Problema: «Hay 3 platos con 4 dulces cada uno. ¿Cuántos dulces hay?».', 'Son grupos iguales y pide el total, así que multiplico: 3 x 4.',
                 'Sumo 4 + 4 + 4 = 12. Hay 12 dulces.'] } },
    { t: 'Comprueba con la operación contraria',
      p: ['La multiplicación y la división son operaciones contrarias. Si 12 ÷ 3 = 4, lo puedes comprobar con 4 x 3 = 12.',
          'Palabras que ayudan: «cada uno», «en cada», «grupos de» suelen avisar de multiplicar; «entre», «reparte» y «por igual» avisan de dividir.'],
      tip: 'Si no estás seguro, dibuja los grupos o los objetos. ¡Un dibujo sencillo ayuda mucho!' }
  ],
  'problemas-3': [
    { t: 'Problemas de dos pasos', visual: true, p: ['@teoria',
      'Para saber si un problema tiene dos pasos, busca si la historia cuenta dos cosas que pasan una después de la otra.'] },
    { t: 'Paso a paso: resolver en dos partes',
      pasos: ['Lee el problema y marca las dos cosas que suceden.', 'Resuelve la primera operación y anota su resultado.',
              'Usa ese resultado como punto de partida de la segunda operación.', 'El último resultado es la respuesta del problema.'],
      ejemplo: { titulo: 'Ejemplo resuelto: 6 + 4 - 3', visual: '🍎🍎🍎🍎🍎🍎 &nbsp;+&nbsp; 🍎🍎🍎🍎 &nbsp;➖&nbsp; 3️⃣',
        lineas: ['Problema: «Tengo 6 manzanas, me regalan 4 y me como 3. ¿Cuántas quedan?».', 'Primero sumo: 6 + 4 = 10.', 'Después resto: 10 - 3 = 7. Me quedan 7 manzanas.'] } },
    { t: 'No te saltes ningún paso',
      p: ['Escribe el resultado de cada paso para no perderte. En el ejemplo, primero apuntas 10 y después lo usas para restar.',
          'También hay problemas de dos pasos que mezclan operaciones distintas, como multiplicar y después restar.'],
      tip: 'Si te atoras, resuelve solo la primera parte y detente: a veces la segunda parte se ve mucho más fácil.' }
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
    'multiplicaciones-3': 'Vas a pasar de filas a multiplicaciones y a calcular resultados de varias tablas. Imagina las filas o suma de forma repetida.',
  'divisiones-1': 'En los ejercicios repartirás objetos en partes iguales y calcularás cuánto recibe cada uno. Reparte de uno en uno, como en el ejemplo de las galletas.',
  'divisiones-2': 'Aquí convertirás historias en divisiones y ordenarás los pasos para hacerlo. Fíjate en la palabra «entre»: te dice cuántos grupos hay.',
  'divisiones-3': 'Los ejercicios usan las tablas de multiplicar para dividir y para comprobar resultados. Recuerda el ejemplo de 15 ÷ 3.',
  'numeros-1': 'En los ejercicios contarás objetos, leerás los nombres de los números y los clasificarás. Cuenta de uno en uno y no te saltes ninguno.',
  'numeros-2': 'Aquí compararás números con los signos &gt; y &lt; y ordenarás una lista de menor a mayor. Compara primero las decenas y después las unidades.',
  'numeros-3': 'Vas a reconocer números pares e impares, seguir secuencias de 2 en 2 y ordenar los pasos para clasificar un número. Fíjate siempre en la última cifra.',
  'figuras-1': 'En los ejercicios reconocerás círculos, cuadrados, triángulos y rectángulos, y los clasificarás según tengan esquinas o no. Fíjate si la figura es redonda o tiene lados rectos.',
  'figuras-2': 'Aquí contarás lados y vértices y ordenarás figuras de menos a más lados. Recuerda que en cada figura hay tantos vértices como lados.',
  'figuras-3': 'Vas a reconocer esfera, cubo, cilindro y cono en objetos de todos los días y a ordenar los pasos para reconocerlos. Toca el objeto en tu mente: ¿es plano o curvo?',
  'fracciones-1': 'En los ejercicios escribirás fracciones de pizzas y chocolates y las clasificarás según en cuántas partes está partido el entero. Cuenta primero todos los trozos iguales.',
  'fracciones-2': 'Aquí leerás fracciones, distinguirás el numerador del denominador y ordenarás los pasos para escribirlas. Recuerda: el denominador va debajo.',
  'fracciones-3': 'Vas a comparar fracciones con el mismo denominador y a ordenarlas de menor a mayor. Fíjate en los numeradores y recuerda la mitad como ayuda.',
  'problemas-1': 'En los ejercicios convertirás historias en sumas y restas y clasificarás las palabras pista. Busca siempre lo que se junta o lo que se quita.',
  'problemas-2': 'Aquí decidirás si un problema se resuelve multiplicando o dividiendo y ordenarás los pasos para hacerlo. Fíjate si hay grupos iguales o un reparto.',
  'problemas-3': 'Vas a resolver problemas en dos partes y a unirlos con sus operaciones. Resuelve un paso a la vez y usa el primer resultado para el segundo.'
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
  contenedorListaLecciones.innerHTML = '';

  curso.lecciones.forEach((lec, i) => {
    const e = estadoLeccion(cursoActual, i);
    const icono = { dominada: '✔', actual: i + 1, 'en-proceso': i + 1, refuerzo: '!', bloqueada: '🔒' }[e.estado];
    const etiqueta = { dominada: 'Repasar', actual: 'Empezar', 'en-proceso': 'Mejorar', refuerzo: 'Repasar', bloqueada: 'Bloqueada' }[e.estado];
    const clase = { dominada: 'completada', actual: 'actual', 'en-proceso': 'actual en-proceso', refuerzo: 'actual refuerzo', bloqueada: 'bloqueada' }[e.estado];
    const descripcion = e.estado === 'bloqueada' && e.nodo ? motivoBloqueo(cursoActual, i) : `${lec.teoria.split('. ')[0].replace(/\.$/, '')}.`;
    const avance = e.nodo && e.nodo.sesiones > 0 && e.estado !== 'bloqueada'
      ? `<span class="tl-avance"><span aria-label="${e.estrellas} de 3 estrellas">${estrellasTexto(e.estrellas)}</span> Dominio ${Math.round(e.dominio)}%${e.repaso ? ' · 🔁 Repaso recomendado' : ''}</span>`
      : (e.repaso ? '<span class="tl-avance">🔁 Repaso recomendado</span>' : '');

    const tarjeta = document.createElement('button');
    tarjeta.type = 'button';
    tarjeta.className = `tarjeta-leccion ${clase}${e.repaso ? ' repaso' : ''}`;
    tarjeta.innerHTML = `
      <span class="num-leccion">${icono}</span>
      <span class="info-leccion">
        <span class="tl-titulo">${lec.titulo}</span>
        <span class="tl-desc">${descripcion}</span>
        ${avance}
      </span>
      <span class="badge-leccion">${etiqueta}</span>`;
    tarjeta.addEventListener('click', () => {
      if (e.estado === 'bloqueada') {
        mostrarToast(e.nodo ? motivoBloqueo(cursoActual, i) : 'Termina la lección anterior para desbloquearla 🔒');
        return;
      }
      abrirLeccion(cursoActual, i);
    });
    contenedorListaLecciones.appendChild(tarjeta);
  });
}

cerrarLecciones.addEventListener('click', () => pantallaLecciones.classList.remove('visible'));

// ========== MOTOR ADAPTATIVO (cliente): grafo, Sumi y mapa de aprendizaje ==========
// El servidor decide (puntaje, dominio, desbloqueos, repasos). Aquí solo se envía cada sesión y se refleja el resultado.
let grafo = null;   // última "ruta" recibida de /api/ruta; null = sin conexión o motor no instalado (se usa el modo local de siempre)
const CLAVES_CURSO = ['sumas', 'restas', 'multiplicaciones', 'divisiones', 'numeros', 'figuras', 'fracciones', 'problemas'];
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const infoDeNodo = (id) => ({ clave: CLAVES_CURSO[Math.floor((id - 1) / 3)], indice: (id - 1) % 3 });
const nodoGrafo = (id) => (grafo ? grafo.nodos.find((n) => n.id_nodo === id) : null);

async function fetchConTiempo(url, opciones = {}, ms = 6000) {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), ms);
  try { return await fetch(url, { ...opciones, signal: control.signal }); }
  finally { clearTimeout(temporizador); }
}

// ---------- Sumi, la mascota ----------
function sumiHTML(animo = 'feliz') {
  // La mascota ahora es una imagen (img/sumi.png). El ánimo cambia la animación y el emoji que la acompaña.
  const extras = {
    celebra: '<span class="sumi-extra sumi-extra-1">✨</span><span class="sumi-extra sumi-extra-2">⭐</span>',
    piensa: '<span class="sumi-extra sumi-extra-2">❓</span>',
    anima: '<span class="sumi-extra sumi-extra-2">💪</span>',
    feliz: ''
  };
  return `<span class="sumi sumi-${animo}" aria-hidden="true"><img class="sumi-img" src="img/sumi.png" alt="" draggable="false">${extras[animo] || ''}</span>`;
}

const estrellasTexto = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

// ---------- Pantalla final: solo el puntaje ----------
function calcularPuntaje(resultados, s) {
  if (resultados && resultados.length) {
    const suma = resultados.reduce((t, r) => t + Number(r.puntaje || 0), 0);
    return Math.round(suma / resultados.length);
  }
  // Sin conexión: puntaje local = porcentaje de aciertos
  let aciertos = 0;
  let errores = 0;
  Object.values(s.porNodo).forEach((st) => { aciertos += st.aciertos; errores += st.errores; });
  return aciertos + errores ? Math.round((aciertos / (aciertos + errores)) * 100) : 0;
}

function mostrarPuntajeFinal(slot, puntaje, cargando = false) {
  const animo = cargando ? 'piensa' : puntaje >= 80 ? 'celebra' : puntaje >= 50 ? 'feliz' : 'anima';
  slot.innerHTML = `<div class="puntaje-final${cargando ? ' cargando' : ''}">
    <div class="puntaje-sumi">${sumiHTML(animo)}</div>
    <div class="puntaje-caja" role="status">
      <span class="puntaje-etiqueta">Puntaje</span>
      <span class="puntaje-numero">${cargando ? '…' : puntaje}</span>
    </div>
  </div>`;
}

function irALeccion(clave, indice) {
  cerrarLeccion(false);
  pantallaLecciones.classList.remove('visible');
  abrirLeccion(clave, indice);
}

// ---------- Estado de cada lección según el grafo (o según el avance local si no hay servidor) ----------
function estadoLeccion(clave, indice) {
  const n = nodoGrafo(idNodo(clave, indice + 1));
  if (!n) {
    const hechas = leccionesCompletadas(clave);
    return { estado: indice < hechas ? 'dominada' : indice === hechas ? 'actual' : 'bloqueada', dominio: null, estrellas: 0, nodo: null, repaso: false };
  }
  const equivalencia = { 'Bloqueado': 'bloqueada', 'Desbloqueado': 'actual', 'En proceso': 'en-proceso', 'Necesita refuerzo': 'refuerzo', 'Dominado': 'dominada' };
  return {
    estado: equivalencia[n.estado] || 'bloqueada', dominio: n.dominio, estrellas: n.estrellas, nodo: n,
    repaso: grafo.refuerzos.some((r) => r.id_nodo_refuerzo === n.id_nodo)
  };
}

function motivoBloqueo(clave, indice) {
  const n = nodoGrafo(idNodo(clave, indice + 1));
  const pendientes = n ? n.prerrequisitos.filter((p) => !p.cumplido) : [];
  if (!pendientes.length) return 'Termina la lección anterior para desbloquearla 🔒';
  return pendientes.map((p) => `Domina «${p.titulo}» (${p.dominio_minimo}%) para desbloquearla. Llevas ${Math.round(p.dominio_actual)}%.`).join(' ');
}

function leccionEvaluada(clave, indice) {
  const n = nodoGrafo(idNodo(clave, indice + 1));
  if (n && (n.estado === 'Dominado' || n.estado === 'En proceso')) return true;
  return indice < Math.min(leccionesCompletadas(clave), cursosData[clave].lecciones.length);
}

// ---------- Sincronización con el servidor ----------
function aplicarGrafo(ruta) {
  grafo = ruta;
  // El avance del servidor también se guarda en el dispositivo (lo usa el modo sin conexión)
  ruta.nodos.forEach((n) => { if (n.estado === 'Dominado') { const { clave, indice } = infoDeNodo(n.id_nodo); marcarCompletada(clave, indice); } });
  refrescarVistasDelGrafo();
}

function refrescarVistasDelGrafo() {
  actualizarRutaSumi();
  actualizarPracticaMixta();
  if (cursoActual && pantallaLecciones.classList.contains('visible')) renderizarListaLecciones();
  renderizarMapa();   // el mapa ya no es un modal: siempre refleja el estado del grafo
}

async function sincronizarGrafo() {
  if (!idUsuarioActual) return;
  try {
    const respuesta = await fetchConTiempo(`${API_URL}/ruta/${idUsuarioActual}`);
    const ruta = await respuesta.json();
    if (!respuesta.ok || !Array.isArray(ruta.nodos)) throw new Error(ruta.mensaje || `HTTP ${respuesta.status}`);
    aplicarGrafo(ruta);
  } catch (error) {
    grafo = null;
    console.warn('Motor adaptativo no disponible; se usa el modo local.', error.message);
    refrescarVistasDelGrafo();
  }
}

/** Envía al servidor lo ocurrido en la sesión (una evaluación por nodo practicado). Devuelve null si no hay conexión. */
async function evaluarSesionEnServidor(s) {
  if (!idUsuarioActual) return null;
  const resultados = [];
  for (const [id, st] of Object.entries(s.porNodo)) {
    if (st.aciertos + st.errores === 0) continue;
    try {
      const respuesta = await fetchConTiempo(`${API_URL}/evaluar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: idUsuarioActual, id_nodo: Number(id),
          aciertos: st.aciertos, errores: st.errores,
          tiempo_invertido_segundos: st.tiempo, pistas_solicitadas: st.pistas,
          completada: st.resueltas >= st.preguntas,
          origen: s.modo === 'mixta' ? 'mixta' : 'leccion'
        })
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ruta) throw new Error(resultado.mensaje || `HTTP ${respuesta.status}`);
      resultados.push(resultado);
    } catch (error) {
      console.warn('No se pudo evaluar la sesión en el servidor.', error.message);
      return null;
    }
  }
  return resultados.length ? resultados : null;
}

async function evaluarYMostrarPuntaje(s) {
  const slot = document.getElementById('sumi-slot');
  const esperarFinal = s.fase === 'final' && s.modo === 'leccion';
  if (slot) mostrarPuntajeFinal(slot, 0, true);
  if (esperarFinal) configurarPie('ok', '', 'Calculando…', true);

  const resultados = await evaluarSesionEnServidor(s);   // el motor adaptativo sigue registrando la sesión
  if (resultados) aplicarGrafo(resultados[resultados.length - 1].ruta);
  if (sesion !== s) return;   // el estudiante ya salió de la pantalla

  const destino = document.getElementById('sumi-slot');
  if (destino) mostrarPuntajeFinal(destino, calcularPuntaje(resultados, s));
  if (esperarFinal) configurarPie('ok', '', textoBotonFinal(s));
}

function siguienteLeccionDisponible(s) {
  return s.modo === 'leccion' && s.indice < s.curso.lecciones.length - 1 && estadoLeccion(s.clave, s.indice + 1).estado !== 'bloqueada';
}
const textoBotonFinal = (s) => (s.modo === 'mixta' ? 'Volver al inicio' : siguienteLeccionDisponible(s) ? 'Siguiente lección' : 'Volver al camino');

// ---------- Tarjeta «La ruta de Sumi» (pantalla principal) ----------
const rutaSumiAvatar = document.getElementById('ruta-sumi-avatar');
const rutaSumiMensaje = document.getElementById('ruta-sumi-mensaje');
const rutaSumiIr = document.getElementById('ruta-sumi-ir');
let destinoRutaSumi = null;

function actualizarRutaSumi() {
  destinoRutaSumi = null;
  if (!grafo) {
    rutaSumiAvatar.innerHTML = sumiHTML('anima');
    rutaSumiMensaje.textContent = 'No pude conectarme con el servidor, pero puedes seguir practicando. Tu avance se guarda en este dispositivo.';
    rutaSumiIr.hidden = true;
    return;
  }
  const sig = grafo.siguiente;
  const empezo = grafo.nodos.some((n) => n.sesiones > 0);
  const min = grafo.config.dominio_minimo;
  let animo = 'feliz';
  let texto;
  let boton = 'Ir ahora';
  if (sig.motivo === 'refuerzo') {
    animo = 'piensa';
    texto = sig.origen_titulo && sig.origen_titulo !== sig.titulo
      ? `Antes de seguir con «${sig.origen_titulo}», te recomiendo repasar «${sig.titulo}». ¡Así avanzas más fácil!`
      : `Te recomiendo repetir «${sig.titulo}». ¡Con las pistas 💡 lo vas a lograr!`;
    boton = 'Repasar ahora';
  } else if (sig.motivo === 'mejorar') {
    animo = 'anima';
    texto = `Estás cerca de dominar «${sig.titulo}». Inténtalo otra vez para llegar al ${min}%.`;
    boton = 'Mejorar';
  } else if (sig.motivo === 'continuar') {
    texto = empezo ? `¡Sigue con «${sig.titulo}»! Es tu siguiente paso.` : `¡Hola! Soy Sumi. Empecemos con «${sig.titulo}».`;
    boton = empezo ? 'Continuar' : 'Empezar';
  } else {
    animo = 'celebra';
    texto = '¡Dominaste todo el mapa! Usa la práctica mixta para no olvidar nada.';
  }
  // El texto incluye títulos de la base de datos: se inserta como texto, no como HTML
  rutaSumiMensaje.textContent = texto;
  rutaSumiAvatar.innerHTML = sumiHTML(animo);
  if (sig.id_nodo) {
    destinoRutaSumi = infoDeNodo(sig.id_nodo);
    rutaSumiIr.textContent = boton;
    rutaSumiIr.hidden = false;
  } else {
    rutaSumiIr.hidden = true;
  }
}
rutaSumiIr.addEventListener('click', () => { if (destinoRutaSumi) irALeccion(destinoRutaSumi.clave, destinoRutaSumi.indice); });
rutaSumiAvatar.innerHTML = sumiHTML('feliz');

// ---------- Mapa de aprendizaje: camino sinuoso (vista general) ----------
const mapaContenedor = document.getElementById('mapa-contenedor');
const mapaDetalle = document.getElementById('mapa-detalle');
// Cada curso es una "unidad" del camino, con su propio color
const UNIDADES_MAPA = [
  { clave: 'sumas',            emoji: '➕', nombre: 'Sumas',            color: '#3a86ff', oscuro: '#1f55c4' },
  { clave: 'restas',           emoji: '➖', nombre: 'Restas',           color: '#ff4d94', oscuro: '#c2004f' },
  { clave: 'multiplicaciones', emoji: '✖️', nombre: 'Multiplicaciones', color: '#14b87a', oscuro: '#0a7d52' },
  { clave: 'divisiones',       emoji: '➗', nombre: 'Divisiones',       color: '#ff9f1c', oscuro: '#b86a00' },
  { clave: 'numeros',          emoji: '🔢', nombre: 'Los Números',      color: '#9b5cf6', oscuro: '#6a35c4' },
  { clave: 'figuras',          emoji: '🔺', nombre: 'Figuras',          color: '#00b4d8', oscuro: '#007f99' },
  { clave: 'fracciones',       emoji: '🍕', nombre: 'Fracciones',       color: '#ff6b57', oscuro: '#c23a28' },
  { clave: 'problemas',        emoji: '🧩', nombre: 'Problemas',        color: '#e0a800', oscuro: '#9a7400' }
];
// Cuánto se mueve cada círculo a la izquierda/derecha para formar la curva del camino (en píxeles)
const CURVA_CAMINO = [0, 45, 75, 45, 0, -45, -75, -45];
const CLASE_ESTADO_NODO = { 'Bloqueado': 'est-bloqueado', 'Desbloqueado': 'est-disponible', 'En proceso': 'est-proceso', 'Necesita refuerzo': 'est-refuerzo', 'Dominado': 'est-dominado' };
const ICONO_ESTADO_NODO = { 'Bloqueado': '🔒', 'Desbloqueado': '▶', 'En proceso': '▶', 'Necesita refuerzo': '🔁', 'Dominado': '✔' };
const TEXTO_ESTADO_NODO = { 'Bloqueado': 'Bloqueada', 'Desbloqueado': '¡Lista para jugar!', 'En proceso': 'Casi la dominas', 'Necesita refuerzo': 'Hay que repasar', 'Dominado': '¡Dominada!' };
let nodoMapaSeleccionado = null;

function renderizarMapa() {
  if (!grafo) {
    mapaContenedor.innerHTML = '<p class="mapa-cargando">Preparando tu camino…</p>';
    mapaDetalle.innerHTML = '';
    return;
  }
  const idActual = grafo.siguiente ? grafo.siguiente.id_nodo : null;
  let posicion = 0;   // lleva la cuenta para que la curva continúe de una unidad a la siguiente

  const unidades = UNIDADES_MAPA.map((u) => {
    const nodos = grafo.nodos.filter((n) => infoDeNodo(n.id_nodo).clave === u.clave);
    if (!nodos.length) return '';
    const botones = nodos.map((n) => {
      const dx = CURVA_CAMINO[posicion % CURVA_CAMINO.length];
      posicion++;
      const jugada = n.sesiones > 0 && n.estado !== 'Bloqueado';
      const progreso = n.estado === 'Dominado' ? 100 : jugada ? Math.min(100, Math.round(n.dominio)) : 0;
      const esActual = n.id_nodo === idActual;
      const etiqueta = `${n.titulo}: ${TEXTO_ESTADO_NODO[n.estado]}`;
      // La mascota se para al lado del círculo donde toca jugar (del lado con más espacio)
      const mascota = esActual
        ? `<span class="camino-sumi ${dx > 0 ? 'izq' : 'der'}" aria-hidden="true">${sumiHTML('feliz')}<span class="camino-globo">¡Aquí!</span></span>`
        : '';
      return `<button type="button" class="camino-nodo ${CLASE_ESTADO_NODO[n.estado]}${esActual ? ' actual' : ''}${nodoMapaSeleccionado === n.id_nodo ? ' seleccionado' : ''}" data-id="${n.id_nodo}" style="--dx:${dx}px" aria-label="${esc(etiqueta)}">
        ${mascota}
        <span class="nodo-anillo" style="--p:${progreso}"><span class="nodo-boton"><span class="nodo-icono" aria-hidden="true">${ICONO_ESTADO_NODO[n.estado]}</span></span></span>
        <span class="nodo-titulo">${esc(n.titulo)}</span>
        ${jugada ? `<span class="nodo-estrellas" aria-hidden="true">${'⭐'.repeat(n.estrellas)}${'<span class="estrella-vacia">⭐</span>'.repeat(3 - n.estrellas)}</span>` : ''}
      </button>`;
    }).join('');
    return `<section class="camino-unidad" style="--c:${u.color};--c-osc:${u.oscuro}" aria-label="${esc(u.nombre)}">
      <div class="unidad-banner"><span class="unidad-emoji" aria-hidden="true">${u.emoji}</span><span class="unidad-nombre">${esc(u.nombre)}</span></div>
      <div class="camino-nodos">${botones}</div>
    </section>`;
  }).join('');

  mapaContenedor.innerHTML = `<div class="camino" role="group" aria-label="Mi camino de lecciones">${unidades}<div class="camino-meta" aria-hidden="true">🏆</div></div>`;
  mapaContenedor.querySelectorAll('.camino-nodo').forEach((b) => {
    b.addEventListener('click', () => mostrarDetalleNodo(Number(b.dataset.id)));
  });
  mostrarDetalleNodo(nodoMapaSeleccionado || (idActual ?? grafo.nodos[0].id_nodo), false);
  centrarCaminoEnActual();
}

function centrarCaminoEnActual() {
  requestAnimationFrame(() => {
    const actual = mapaContenedor.querySelector('.camino-nodo.actual');
    if (!actual) return;
    mapaContenedor.scrollTop = Math.max(0, actual.offsetTop - mapaContenedor.clientHeight / 2 + 60);
  });
}

function mostrarDetalleNodo(id, volverAPintar = true) {
  const n = nodoGrafo(id);
  if (!n) return;
  nodoMapaSeleccionado = id;
  mapaContenedor.querySelectorAll('.camino-nodo').forEach((b) => b.classList.toggle('seleccionado', Number(b.dataset.id) === id));
  const { clave, indice } = infoDeNodo(id);
  const unidad = UNIDADES_MAPA.find((u) => u.clave === clave) || UNIDADES_MAPA[0];
  const pendientes = n.prerrequisitos.filter((p) => !p.cumplido);
  const hayRepaso = grafo.refuerzos.some((r) => r.id_nodo_refuerzo === id);
  const etiquetaBoton = { 'Desbloqueado': '¡Vamos!', 'En proceso': '¡Mejorar!', 'Necesita refuerzo': '¡Repasar!', 'Dominado': 'Jugar otra vez' }[n.estado];

  let mensaje;
  if (n.estado === 'Bloqueado') {
    mensaje = pendientes.length
      ? `🔒 Primero juega «${esc(pendientes[0].titulo)}» para abrir esta lección.`
      : '🔒 Termina la lección anterior para abrir esta.';
  } else if (hayRepaso) {
    mensaje = '🔁 Sumi te recomienda repasar esta lección.';
  } else {
    mensaje = esc(n.descripcion);
  }
  const estrellas = n.sesiones > 0 && n.estado !== 'Bloqueado'
    ? `<div class="detalle-estrellas" aria-label="${n.estrellas} de 3 estrellas">${'⭐'.repeat(n.estrellas)}${'<span class="estrella-vacia">⭐</span>'.repeat(3 - n.estrellas)}</div>` : '';

  mapaDetalle.style.setProperty('--c', unidad.color);
  mapaDetalle.style.setProperty('--c-osc', unidad.oscuro);
  mapaDetalle.innerHTML = `
    <div class="detalle-texto">
      <h3>${unidad.emoji} ${esc(n.titulo)}</h3>
      <p class="detalle-mensaje">${mensaje}</p>
      ${estrellas}
    </div>
    ${etiquetaBoton ? `<button type="button" class="btn-ruta btn-ruta-principal btn-detalle" id="mapa-ir">${etiquetaBoton}</button>` : ''}`;
  const ir = document.getElementById('mapa-ir');
  if (ir) ir.addEventListener('click', () => irALeccion(clave, indice));
}

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
const NOMBRES_CURSO = { sumas: 'Sumas', restas: 'Restas', multiplicaciones: 'Multiplicaciones', divisiones: 'Divisiones', numeros: 'Los Números', figuras: 'Figuras Geométricas', fracciones: 'Fracciones', problemas: 'Problemas' };
// Cada lección se registra en el nodo de conocimiento de la base de datos (nodo_conocimiento: 1-3 sumas, 4-6 restas, 7-9 multiplicaciones, 10-12 divisiones, 13-15 números, 16-18 figuras, 19-21 fracciones, 22-24 problemas)
const NODO_BASE = { sumas: 0, restas: 3, multiplicaciones: 6, divisiones: 9, numeros: 12, figuras: 15, fracciones: 18, problemas: 21 };
const idNodo = (clave, leccionId) => NODO_BASE[clave] + leccionId;

const ETIQUETAS_TIPO = {
  opcion: 'Elige la respuesta',
  escrita: 'Escribe tu respuesta',
  relacionar: 'Relaciona',
  arrastrar: 'Arrastra y suelta',
  ordenar: 'Ordena'
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
  return {
    t: 'Lo que vas a practicar',
    p: [conexiones[id] || ''],
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
  if (p.tip) partes.push(`<p class="teoria-ojo"><span aria-hidden="true">💡</span> ${p.tip}</p>`);
  return partes.join('');
}

// Estadísticas de la sesión por nodo de conocimiento: es lo que se envía al motor adaptativo
function estadisticasDe(preguntas) {
  const porNodo = {};
  preguntas.forEach((q) => {
    porNodo[q.nodo] = porNodo[q.nodo] || { aciertos: 0, errores: 0, tiempo: 0, pistas: 0, preguntas: 0, resueltas: 0 };
    porNodo[q.nodo].preguntas++;
  });
  return porNodo;
}

function abrirLeccion(clave, indice) {
  if (estadoLeccion(clave, indice).estado === 'bloqueada') {
    mostrarToast(motivoBloqueo(clave, indice));
    return;
  }
  const curso = cursosData[clave];
  const lec = curso.lecciones[indice];
  const id = `${clave}-${lec.id}`;
  const preguntas = preguntasDeLeccion(clave, indice);

  sesion = {
    modo: 'leccion', id, clave, indice, lec, curso, visual: visuales[id] || '',
    cola: preguntas, total: preguntas.length, resueltas: 0,
    vidas: VIDAS_MAX, fase: 'teoria', paginaTeoria: 0, paginasTeoria: armarPaginasTeoria(id, lec, preguntas),
    opciones: [], seleccion: null, comprobado: false, actual: null, porNodo: estadisticasDe(preguntas)
  };
  pantallaLeccion.classList.add('visible');
  document.body.classList.add('leccion-abierta');
  pintarPaso();
}

// ---------- Práctica mixta ----------
function leccionesCompletadasLista() {
  const lista = [];
  Object.keys(cursosData).forEach(clave => {
    cursosData[clave].lecciones.forEach((_, i) => { if (leccionEvaluada(clave, i)) lista.push([clave, i]); });
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
    vidas: VIDAS_MAX, fase: 'pregunta', opciones: [], seleccion: null, comprobado: false, actual: null, porNodo: estadisticasDe(preguntas)
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
    // Los números, las figuras, las fracciones y los problemas no usan dibujos automáticos: llevan su propio visual (q.visual) cuando lo necesitan
    if (['numeros', 'figuras', 'fracciones', 'problemas'].some(c => claveCurso.includes(c))) return '';
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
    // Si no encontró ninguna palabra específica, usamos un emoji por defecto según el curso
  if (!emoji) {
    if (claveCurso.includes('restas')) emoji = '🎈';
    else if (claveCurso.includes('multiplicaciones')) emoji = '🟦';
    else if (claveCurso.includes('divisiones')) emoji = '🍪';
    else emoji = '🍎';
  }

  // --- CASO DIVISIONES ---
  if (claveCurso.includes('divisiones')) {
    const reparto = texto.match(/(\d+)\s*÷\s*(\d+)/) || texto.match(/(\d+)\D+?entre\s+(\d+)/);
    if (!reparto) return '';
    const total = parseInt(reparto[1]);
    const grupos = parseInt(reparto[2]);
    // Se dibuja solo lo que se reparte (no el resultado) y se evita un dibujo demasiado largo
    if (total > 20) return '';
    return `<div class="visual-leccion" aria-hidden="true" style="font-size: 1.6rem; text-align: center; padding: 0.8rem;">
              ${emoji.repeat(total)}
              <br><small style="font-size: 0.9rem; color: var(--texto-secundario);">Repartimos ${total} en ${grupos} grupos iguales</small>
            </div>`;
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
      <h2>${q.q}</h2>
      ${visualHTML}
      <div class="zona-ejercicio" id="zona-ejercicio"></div>
      ${q.pista ? `<details class="pista${q.apoyo ? ' sugerida' : ''}"${q.apoyo ? ' open' : ''}>
        <summary>${q.apoyo ? `<span class="pista-sumi" aria-hidden="true">${sumiHTML('anima')}</span> Sumi te sugiere una pista` : '💡 ¿Necesitas una pista?'}</summary>
        <p>${q.pista}</p>
      </details>` : ''}
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
const COLORES_PAREJA = ['#3a86ff'];

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

  const segundos = Math.max(1, Math.round((Date.now() - s.inicioPregunta) / 1000));
  const est = s.porNodo[q.nodo];
  est.tiempo += segundos;
  est.pistas += s.pistasPresentacion || 0;
  if (acierto) { est.aciertos++; est.resueltas++; } else { est.errores++; }

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
  const s = sesion;
  leccionRelleno.style.width = '0%';
  leccionCuerpo.innerHTML = `
    <div class="paso paso-final">
      <div class="emoji-final">💔</div>
      <h2>¡Te quedaste sin vidas!</h2>
      <div id="sumi-slot" class="sumi-slot"></div>
    </div>`;
  pintarVidas();
  configurarPie('mal', '', 'Intentar de nuevo');
  s.fase = 'sin-vidas';
  evaluarYMostrarPuntaje(s);   // el motor adaptativo evalúa la sesión y se muestra solo el puntaje
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
  leccionCuerpo.innerHTML = `
    <div class="paso paso-final">
      <div class="estrellas" aria-label="${estrellas} de 3 estrellas">${'⭐'.repeat(estrellas)}${'☆'.repeat(3 - estrellas)}</div>
      <h2>${s.modo === 'mixta' ? '¡Práctica mixta completada!' : '¡Lección completada!'}</h2>
      <div id="sumi-slot" class="sumi-slot"></div>
    </div>`;
  configurarPie('ok', '', textoBotonFinal(s));
  evaluarYMostrarPuntaje(s);   // el motor adaptativo evalúa la sesión y se muestra solo el puntaje
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
    const { clave, indice, modo } = s;
    const abrirSiguiente = siguienteLeccionDisponible(s);
    cerrarLeccion(false);
    if (modo === 'leccion' && abrirSiguiente) abrirLeccion(clave, indice + 1);
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
  actualizarRutaSumi();
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