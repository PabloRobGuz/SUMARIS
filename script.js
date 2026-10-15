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

// ========== Login con admin / 1234 ==========
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo-login').value.trim();
  const contrasena = document.getElementById('contrasena-login').value;

  if (correo === 'admin' && contrasena === '1234') {
    // Acceso correcto
    errorLogin.classList.remove('visible');
    entrarAlSistema('Admin');
  } else {
    // Mostrar error
    errorLogin.classList.add('visible');

    // Reiniciar la animación de sacudida
    errorLogin.style.animation = 'none';
    void errorLogin.offsetWidth;
    errorLogin.style.animation = '';

    // Sacudir la tarjeta
    formLogin.style.animation = 'none';
    void formLogin.offsetWidth;
    formLogin.style.animation = 'sacudir 0.5s ease';
    setTimeout(() => { formLogin.style.animation = ''; }, 600);
  }
});

// ========== Registro (por ahora solo simula) ==========
formRegistro.addEventListener('submit', (e) => {
  e.preventDefault();
  const correo = document.getElementById('correo-registro').value.trim();
  const pass = document.getElementById('contrasena-registro').value;
  const confirmar = document.getElementById('confirmar-contrasena').value;

  if (pass !== confirmar) {
    alert('¡Ups! Las contraseñas no son iguales\nIntenta de nuevo.');
    return;
  }

  alert('¡Cuenta creada con éxito!');

  // Volver al login
  formRegistro.classList.remove('activa');
  formLogin.classList.add('activa');
  document.body.classList.remove('modo-registro');
});

// ========== Función para entrar al sistema ==========
function entrarAlSistema(nombre) {
  // Ocultar la pantalla de login
  pantallaAuth.style.display = 'none';

  // Mostrar interfaz principal con fade
  interfazPrincipal.classList.add('visible');
  interfazPrincipal.style.opacity = '0';
  requestAnimationFrame(() => {
    interfazPrincipal.style.opacity = '1';
  });

  // Personalizar el nombre
  nombreMostrado.textContent = nombre;
  saludoTitulo.textContent = `¡Hola de nuevo, ${nombre}!`;

  // Cambiar título de la pestaña
  document.title = 'SUMARIS - Inicio';
}

// ========== Cerrar sesión ==========
document.getElementById('btn-salir').addEventListener('click', () => {
  // Ocultar interfaz principal
  interfazPrincipal.classList.remove('visible');

  // Mostrar login de nuevo
  pantallaAuth.style.display = 'flex';

  // Resetear formularios
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

// ========== Enfocar el campo de correo al cargar ==========
document.getElementById('correo-login').focus();