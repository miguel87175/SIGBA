// ==================== BASE DE DATOS SIMULADA ====================
const USUARIO_DEFAULT = {
    usuario: "admin",
    email: "admin@test.com",
    password: "1234567",
};

function cargarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        return [];
    }
}

let usuarios = cargarUsuarios();

if (usuarios.length === 0) {
    usuarios.push(USUARIO_DEFAULT);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ==================== REFERENCIAS AL DOM ====================
const loginForm    = document.getElementById("loginForm");
const mensajeLogin = document.getElementById("mensajeLogin");
const inputUsuario  = document.getElementById("loginUsuario");
const inputPassword = document.getElementById("loginPassword");
const errorUsuario  = document.getElementById("errorUsuario");
const errorPassword = document.getElementById("errorPassword");

// ==================== REGEX ====================
const regexEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9._\s]{3,50}$/;

// ==================== AUXILIARES ====================
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = "mensaje " + tipo;
}

function pintarError(input, spanError, mensaje) {
    if (!input || !spanError) return;
    spanError.textContent = mensaje;
    input.classList.toggle("error", mensaje !== "");
    input.classList.toggle("ok", mensaje === "" && input.value.trim() !== "");
}

// ==================== VALIDADORES ====================
function validarUsuario(valor) {
    valor = valor.trim();
    if (valor === "") return "El nombre o correo es obligatorio";
    if (valor.includes("@")) {
        return regexEmail.test(valor) ? "" : "El correo no es válido";
    }
    return regexNombre.test(valor) ? "" : "El nombre debe tener al menos 3 caracteres";
}

function validarPassword(valor) {
    if (valor === "")     return "La contraseña es obligatoria";
    if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
}

// ==================== VALIDACIÓN EN VIVO ====================
inputUsuario.addEventListener("input", () => {
    pintarError(inputUsuario, errorUsuario, validarUsuario(inputUsuario.value));
    if (mensajeLogin.textContent) mostrarMensaje(mensajeLogin, "", "");
});

inputPassword.addEventListener("input", () => {
    pintarError(inputPassword, errorPassword, validarPassword(inputPassword.value));
    if (mensajeLogin.textContent) mostrarMensaje(mensajeLogin, "", "");
});

// ==================== LOGIN (SUBMIT) ====================
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario  = inputUsuario.value.trim();
    const password = inputPassword.value;
    const recordar = document.getElementById("recordarme").checked;

    const rolSeleccionado = document.querySelector('input[name="tipoUsuario"]:checked');
    const rol = rolSeleccionado ? rolSeleccionado.value : "";

    const msgUsuario  = validarUsuario(usuario);
    const msgPassword = validarPassword(password);

    pintarError(inputUsuario, errorUsuario, msgUsuario);
    pintarError(inputPassword, errorPassword, msgPassword);

    if (!rol) {
        mostrarMensaje(mensajeLogin, "Selecciona el tipo de usuario", "error");
        return;
    }

    if (msgUsuario || msgPassword) {
        mostrarMensaje(mensajeLogin, "Revisa los campos marcados en rojo", "error");
        (msgUsuario ? inputUsuario : inputPassword).focus();
        return;
    }

    mostrarMensaje(mensajeLogin, "Verificando...", "");

    setTimeout(() => {
        const encontrado = usuarios.find(u =>
            (u.usuario.toLowerCase() === usuario.toLowerCase() ||
             u.email.toLowerCase()   === usuario.toLowerCase()) &&
            u.password === password
        );

        if (encontrado) {
            mostrarMensaje(mensajeLogin, "¡Bienvenido, " + encontrado.usuario + "!", "exito");

            const sesion = {
                usuario: encontrado.usuario,
                email: encontrado.email,
                rol: rol,
                hora: Date.now()
            };

            if (recordar) {
                localStorage.setItem("sesionActiva", JSON.stringify(sesion));
                sessionStorage.removeItem("sesionActiva");
            } else {
                sessionStorage.setItem("sesionActiva", JSON.stringify(sesion));
                localStorage.removeItem("sesionActiva");
            }

            setTimeout(() => {
    // El admin va al dashboard, los demás a la página normal
    if (encontrado.usuario === "admin" || encontrado.email === "admin@test.com") {
        window.location.href = "../dashboard.html";
    } else {
        if (sesion.usuario === "admin" || sesion.email === "admin@test.com") {
    window.location.href = "../dashboard.html";
} else {
    window.location.href = "../pagina.html";
}
    }
}, 900);

        } else {
            mostrarMensaje(mensajeLogin, "Usuario o contraseña incorrectos", "error");
            inputPassword.value = "";
            inputPassword.classList.remove("ok");
            inputPassword.focus();
        }
    }, 700);
});

// ==================== SESIÓN AL RECARGAR ====================
window.addEventListener("DOMContentLoaded", () => {
    const sesion = JSON.parse(localStorage.getItem("sesionActiva"))
                || JSON.parse(sessionStorage.getItem("sesionActiva"));

    if (sesion) {
        const OCHO_HORAS = 1000 * 60 * 60 * 8;
        if (Date.now() - sesion.hora > OCHO_HORAS) {
            localStorage.removeItem("sesionActiva");
            sessionStorage.removeItem("sesionActiva");
            return;
        }
        window.location.href = "inisio/pagina.html";
    }
});

// login.js
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && inputPassword) {
    togglePassword.addEventListener("click", () => {
        const esPassword = inputPassword.type === "password";
        
        // Cambiar tipo de input
        inputPassword.type = esPassword ? "text" : "password";
        
        // Cambiar ícono visual
        togglePassword.textContent = esPassword ? "🙈" : "👁️";
    });
}