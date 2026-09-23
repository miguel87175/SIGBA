// ==================== BASE DE DATOS SIMULADA ====================
function cargarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        return [];
    }
}

let usuarios = cargarUsuarios();

let codigoGenerado = "";
let emailRecuperacion = "";
let codigoExpira = 0;

// ==================== REFERENCIAS AL DOM ====================
const olvidoForm = document.getElementById("olvidoForm");
const resetForm  = document.getElementById("resetForm");

const mensajeOlvido = document.getElementById("mensajeOlvido");
const mensajeReset  = document.getElementById("mensajeReset");

const olvidoEmailInput = document.getElementById("olvidoEmail");
const errorOlvidoEmail = document.getElementById("errorOlvidoEmail");

const resetCodigoInput    = document.getElementById("resetCodigo");
const resetPasswordInput  = document.getElementById("resetPassword");
const resetPassword2Input = document.getElementById("resetPassword2");

const errorResetCodigo    = document.getElementById("errorResetCodigo");
const errorResetPassword  = document.getElementById("errorResetPassword");
const errorResetPassword2 = document.getElementById("errorResetPassword2");

const todosLosForms = [olvidoForm, resetForm];

// ==================== REGEX ====================
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==================== NAVEGACIÓN ====================
function mostrarFormulario(formMostrar) {
    todosLosForms.forEach(f => f.classList.add("oculto"));
    formMostrar.classList.remove("oculto");
    formMostrar.style.animation = "none";
    setTimeout(() => formMostrar.style.animation = "", 10);
    limpiarMensajes();
    limpiarErroresCampos();
}

// ==================== AUXILIARES ====================
function mostrarMensaje(elemento, texto, tipo) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = "mensaje " + tipo;
}

function limpiarMensajes() {
    [mensajeOlvido, mensajeReset].forEach(m => {
        if (m) {
            m.textContent = "";
            m.className = "mensaje";
        }
    });
}

function pintarError(input, spanError, mensaje) {
    if (!input || !spanError) return;
    spanError.textContent = mensaje;
    input.classList.toggle("error", mensaje !== "");
    input.classList.toggle("ok", mensaje === "" && input.value.trim() !== "");
}

function limpiarErroresCampos() {
    if (olvidoEmailInput) olvidoEmailInput.classList.remove("error", "ok");
    if (errorOlvidoEmail) errorOlvidoEmail.textContent = "";

    [resetCodigoInput, resetPasswordInput, resetPassword2Input]
        .forEach(inp => inp && inp.classList.remove("error", "ok"));
    [errorResetCodigo, errorResetPassword, errorResetPassword2].forEach(span => {
        if (span) span.textContent = "";
    });
}

// ==================== VALIDADORES ====================
function validarOlvidoEmail(valor) {
    valor = valor.trim().toLowerCase();
    if (valor === "")            return "El correo es obligatorio";
    if (!regexEmail.test(valor)) return "El correo no es válido";
    return "";
}

function validarResetCodigo(valor) {
    valor = valor.trim();
    if (valor === "")           return "El código es obligatorio";
    if (!/^\d{6}$/.test(valor)) return "El código debe tener 6 dígitos numéricos";
    return "";
}

function validarResetPassword(valor) {
    if (valor === "")     return "La contraseña es obligatoria";
    if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
}

function validarResetPassword2(valor, original) {
    if (valor === "")       return "Debes confirmar la contraseña";
    if (valor !== original) return "Las contraseñas no coinciden";
    return "";
}

// ==================== VALIDACIÓN EN VIVO ====================
if (olvidoEmailInput) {
    olvidoEmailInput.addEventListener("input", () => {
        pintarError(olvidoEmailInput, errorOlvidoEmail, validarOlvidoEmail(olvidoEmailInput.value));
        if (mensajeOlvido.textContent) mostrarMensaje(mensajeOlvido, "", "");
    });
}

if (resetCodigoInput) {
    resetCodigoInput.addEventListener("input", () => {
        resetCodigoInput.value = resetCodigoInput.value.replace(/\D/g, "").slice(0, 6);
        pintarError(resetCodigoInput, errorResetCodigo, validarResetCodigo(resetCodigoInput.value));
        if (mensajeReset.textContent) mostrarMensaje(mensajeReset, "", "");
    });
}

if (resetPasswordInput) {
    resetPasswordInput.addEventListener("input", () => {
        pintarError(resetPasswordInput, errorResetPassword, validarResetPassword(resetPasswordInput.value));
        if (resetPassword2Input.value !== "") {
            pintarError(resetPassword2Input, errorResetPassword2,
                validarResetPassword2(resetPassword2Input.value, resetPasswordInput.value));
        }
        if (mensajeReset.textContent) mostrarMensaje(mensajeReset, "", "");
    });
}

if (resetPassword2Input) {
    resetPassword2Input.addEventListener("input", () => {
        pintarError(resetPassword2Input, errorResetPassword2,
            validarResetPassword2(resetPassword2Input.value, resetPasswordInput.value));
        if (mensajeReset.textContent) mostrarMensaje(mensajeReset, "", "");
    });
}

// ==================== OLVIDO (SUBMIT) ====================
olvidoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = olvidoEmailInput.value.trim().toLowerCase();
    const msgEmail = validarOlvidoEmail(email);
    pintarError(olvidoEmailInput, errorOlvidoEmail, msgEmail);

    if (msgEmail) {
        mostrarMensaje(mensajeOlvido, "Revisa el campo marcado en rojo", "error");
        olvidoEmailInput.focus();
        return;
    }

    const encontrado = usuarios.find(u => u.email.toLowerCase() === email);

    if (!encontrado) {
        pintarError(olvidoEmailInput, errorOlvidoEmail, "No existe una cuenta con ese correo");
        mostrarMensaje(mensajeOlvido, "No existe una cuenta con ese correo", "error");
        return;
    }

    codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    emailRecuperacion = email;
    codigoExpira = Date.now() + 1000 * 60 * 10; // 10 minutos

    mostrarMensaje(mensajeOlvido, "Código enviado (DEMO: " + codigoGenerado + ")", "exito");

    setTimeout(() => {
        olvidoForm.reset();
        mostrarFormulario(resetForm);
        resetCodigoInput.focus();
    }, 1200);
});

// ==================== RESET (SUBMIT) ====================
resetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo    = resetCodigoInput.value.trim();
    const password  = resetPasswordInput.value;
    const password2 = resetPassword2Input.value;

    const msgCodigo    = validarResetCodigo(codigo);
    const msgPassword  = validarResetPassword(password);
    const msgPassword2 = validarResetPassword2(password2, password);

    pintarError(resetCodigoInput,    errorResetCodigo,    msgCodigo);
    pintarError(resetPasswordInput,  errorResetPassword,  msgPassword);
    pintarError(resetPassword2Input, errorResetPassword2, msgPassword2);

    if (msgCodigo || msgPassword || msgPassword2) {
        mostrarMensaje(mensajeReset, "Revisa los campos marcados en rojo", "error");
        if (msgCodigo)        resetCodigoInput.focus();
        else if (msgPassword) resetPasswordInput.focus();
        else                  resetPassword2Input.focus();
        return;
    }

    if (Date.now() > codigoExpira) {
        pintarError(resetCodigoInput, errorResetCodigo, "El código expiró, solicita uno nuevo");
        mostrarMensaje(mensajeReset, "El código expiró", "error");
        return;
    }

    if (codigo !== codigoGenerado) {
        pintarError(resetCodigoInput, errorResetCodigo, "Código de verificación incorrecto");
        mostrarMensaje(mensajeReset, "Código de verificación incorrecto", "error");
        resetCodigoInput.focus();
        return;
    }

    const index = usuarios.findIndex(u => u.email.toLowerCase() === emailRecuperacion);
    if (index === -1) {
        mostrarMensaje(mensajeReset, "Error: usuario no encontrado", "error");
        return;
    }

    usuarios[index].password = password;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje(mensajeReset, "¡Contraseña actualizada con éxito!", "exito");

    codigoGenerado = "";
    emailRecuperacion = "";
    codigoExpira = 0;

    setTimeout(() => {
        resetForm.reset();
        window.location.href = "login.html";
    }, 1500);
});