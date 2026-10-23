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

// ========== Referencias del Test ==========
const pantallaTest = document.getElementById('pantalla-test');
const testInicio = document.getElementById('test-inicio');
const testPreguntas = document.getElementById('test-preguntas');
const testFinal = document.getElementById('test-final');
const textoProgreso = document.getElementById('texto-progreso');
const preguntaTexto = document.getElementById('pregunta-texto');
const preguntaEmoji = document.getElementById('pregunta-emoji');
const preguntaOpciones = document.getElementById('pregunta-opciones');
const btnSiguiente = document.getElementById('btn-siguiente');

// ========== Variables del Test ==========
let idUsuarioActual = null;
let indicePregunta = 0;
let puntosTest = 0;
let opcionSeleccionada = null;

const preguntas = [
  { texto: "Ana tenía 90 canicas y regaló 35. ¿Cuántas le quedan?", emoji: "🟠", opciones: ["45", "55", "65", "50"], correcta: 0 },
  { texto: "Si cada caja tiene 6 lápices y hay 7 cajas. ¿Cuántos lápices hay en total?", emoji: "✏️", opciones: ["36", "42", "48", "13"], correcta: 1 },
  { texto: "Se reparten 48 dulces entre 6 niños por igual. ¿Cuántos dulces recibe cada uno?", emoji: "🍬", opciones: ["6", "7", "8", "9"], correcta: 2 },
  { texto: "¿Cuál fracción representa 'la mitad de una pizza'?", emoji: "🍕", opciones: ["1/4", "1/2", "3/4", "2/3"], correcta: 1 },
  { texto: "¿Cuántas caras tiene un cubo?", emoji: "🎲", opciones: ["4", "6", "8", "12"], correcta: 1 },
  { texto: "Un rectángulo mide 5 cm de largo y 3 cm de ancho. ¿Cuál es su área?", emoji: "📐", opciones: ["8 cm²", "15 cm²", "16 cm²", "10 cm²"], correcta: 1 }
];

// ========== Cambiar entre login y registro ==========
btnIrRegistro.addEventListener('click', () => {
  formLogin.classList.remove('activa');
  formRegistro.classList.add('activa');
  document.body.classList.add('modo-registro');
  document.title = 'SUMARIS - Crear cuenta';
});

btnIrLogin.addEventListener('click', () => {
  formRegistro.classList.remove('activa');
  formLogin.classList.add('activa');
  document.body.classList.remove('modo-registro');
  document.title = 'SUMARIS - Iniciar sesión';
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
      
      // Guardamos el ID del usuario para usarlo en el test
      idUsuarioActual = resultado.id_usuario;
      
      // Entramos a la interfaz
      entrarAlSistema(resultado.nombre_usuario);

      // Si el test_completado es falso (0), mostramos el test
      if (!resultado.test_completado) {
        pantallaTest.classList.add('visible');
        mostrarPantallaTest('test-inicio');
      }
      
    } else {
      errorLogin.textContent = resultado.mensaje || '¡Ups! Correo o contraseña incorrectos';
      activarErrorLogin();
    }
  } catch (error) {
    console.error('Error de conexión:', error);
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
    alert('¡Ups! Las contraseñas no coinciden\nIntenta de nuevo.');
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
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      formRegistro.reset();
      formRegistro.classList.remove('activa');
      formLogin.classList.add('activa');
      document.body.classList.remove('modo-registro');
    } else {
      alert(resultado.mensaje || 'No se pudo crear la cuenta.');
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Error al conectar con el servidor backend.');
  }
});

// ========== Función para entrar al sistema ==========
function entrarAlSistema(nombre) {
  pantallaAuth.style.display = 'none';
  interfazPrincipal.classList.add('visible');
  interfazPrincipal.style.opacity = '0';
  requestAnimationFrame(() => {
    interfazPrincipal.style.opacity = '1';
  });

  nombreMostrado.textContent = nombre;
  saludoTitulo.textContent = `¡Hola de nuevo, ${nombre}!`;
  document.title = 'SUMARIS - Inicio';
}

// ========== Cerrar sesión ==========
document.getElementById('btn-salir').addEventListener('click', () => {
  interfazPrincipal.classList.remove('visible');
  pantallaAuth.style.display = 'flex';
  formLogin.reset();
  document.getElementById('correo-login').focus();
  errorLogin.classList.remove('visible');
  document.title = 'SUMARIS';
  
  // Ocultar test por si acaso
  pantallaTest.classList.remove('visible');
});

// ========== Clic en tarjetas de tema ==========
document.querySelectorAll('.tarjeta-tema').forEach((tarjeta) => {
  tarjeta.addEventListener('click', () => {
    const tema = tarjeta.dataset.tema;
    alert(`¡Pronto abriremos ${tema}!`);
  });
});


// ==================================================
// LÓGICA DEL TEST DE DIAGNÓSTICO
// ==================================================

function mostrarPantallaTest(idPantalla) {
  document.querySelectorAll('.test-pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(idPantalla).classList.add('activa');
}

document.getElementById('btn-empezar-cero').addEventListener('click', async () => {
  await guardarResultadoTest(0); // 0 puntos = Principiante
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
    btn.addEventListener('click', () => seleccionarOpcion(btn, index));
    preguntaOpciones.appendChild(btn);
  });
}

function seleccionarOpcion(btn, index) {
  document.querySelectorAll('.opcion').forEach(b => b.classList.remove('seleccionada'));
  btn.classList.add('seleccionada');
  opcionSeleccionada = index;
  btnSiguiente.disabled = false;
}

btnSiguiente.addEventListener('click', () => {
  if (opcionSeleccionada === null) return;

  // Verificar si es correcta
  if (opcionSeleccionada === preguntas[indicePregunta].correcta) {
    puntosTest++;
  }

  indicePregunta++;

  if (indicePregunta < preguntas.length) {
    cargarPregunta();
  } else {
    // Terminó el test
    guardarResultadoTest(puntosTest);
    mostrarPantallaTest('test-final');
  }
});

async function guardarResultadoTest(puntos) {
  try {
    await fetch(`${API_URL}/completar-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: idUsuarioActual, puntos: puntos })
    });
  } catch (error) {
    console.error('Error al guardar el test:', error);
  }
}

document.getElementById('btn-ir-temas').addEventListener('click', () => {
  pantallaTest.classList.remove('visible');
});

// Enfocar el correo al cargar la página
document.getElementById('correo-login').focus();