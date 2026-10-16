// ========== Referencias ==========
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
      entrarAlSistema(resultado.nombre_usuario);
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
});

// ========== Clic en tarjetas de tema ==========
document.querySelectorAll('.tarjeta-tema').forEach((tarjeta) => {
  tarjeta.addEventListener('click', () => {
    const tema = tarjeta.dataset.tema;
    alert(`¡Pronto abriremos ${tema}!`);
  });
});

document.getElementById('correo-login').focus();