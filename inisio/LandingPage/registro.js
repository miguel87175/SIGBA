// ==================== BASE DE DATOS SIMULADA ====================
function cargarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        return [];
    }
}

let usuarios = cargarUsuarios();

// ==================== REFERENCIAS AL DOM ====================
const registroForm    = document.getElementById("registroForm");
const mensajeRegistro = document.getElementById("mensajeRegistro");

// Datos personales
const regUsuarioInput  = document.getElementById("regUsuario");
const regEmailInput    = document.getElementById("regEmail");
const regTipoDocInput  = document.getElementById("regTipoDoc");
const regNumDocInput   = document.getElementById("regNumDoc");
const regFechaNacInput = document.getElementById("regFechaNac");

// Acudiente
const campoAcudiente          = document.getElementById("campoAcudiente");
const regNombreAcudienteInput = document.getElementById("regNombreAcudiente");
const regTelAcudienteInput    = document.getElementById("regTelAcudiente");

// Contraseñas
const regPasswordInput  = document.getElementById("regPassword");
const regPassword2Input = document.getElementById("regPassword2");

// Términos y condiciones
const aceptaTerminosInput = document.getElementById("aceptaTerminos");
const errorAceptaTerminos = document.getElementById("errorAceptaTerminos");
const abrirTerminosLink   = document.getElementById("abrirTerminos");
const abrirPrivacidadLink = document.getElementById("abrirPrivacidad");

// Modal
const modalOverlay    = document.getElementById("modalOverlay");
const modalTitulo     = document.getElementById("modalTitulo");
const modalBody       = document.getElementById("modalBody");
const cerrarModalBtn  = document.getElementById("cerrarModal");
const aceptarModalBtn = document.getElementById("aceptarModal");

// Spans de error
const errorRegUsuario         = document.getElementById("errorRegUsuario");
const errorRegEmail           = document.getElementById("errorRegEmail");
const errorRegTipoDoc         = document.getElementById("errorRegTipoDoc");
const errorRegNumDoc          = document.getElementById("errorRegNumDoc");
const errorRegFechaNac        = document.getElementById("errorRegFechaNac");
const errorRegNombreAcudiente = document.getElementById("errorRegNombreAcudiente");
const errorRegTelAcudiente    = document.getElementById("errorRegTelAcudiente");
const errorRegPassword        = document.getElementById("errorRegPassword");
const errorRegPassword2       = document.getElementById("errorRegPassword2");

// ==================== REGEX ====================
const regexEmail       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexSoloLetras  = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/;
const regexSoloNumeros = /^[0-9]+$/;

// ==================== FECHA MÁXIMA (hoy) ====================
(function setMaxFechaNac() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    regFechaNacInput.max = `${yyyy}-${mm}-${dd}`;
})();

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
    input.classList.toggle("ok", mensaje === "" && (input.type === "checkbox" ? input.checked : input.value.trim() !== ""));
}

function calcularEdad(fechaStr) {
    if (!fechaStr) return null;
    const hoy = new Date();
    const nac = new Date(fechaStr + "T00:00:00");
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}

// ==================== VALIDADORES ====================
function validarRegUsuario(valor) {
    valor = valor.trim();
    if (valor === "")                 return "El nombre es obligatorio";
    if (valor.length < 3)             return "El nombre debe tener al menos 3 caracteres";
    if (valor.length > 50)            return "El nombre no puede superar los 50 caracteres";
    if (!regexSoloLetras.test(valor)) return "El nombre solo puede contener letras y espacios";
    return "";
}

function validarRegEmail(valor) {
    valor = valor.trim().toLowerCase();
    if (valor === "")            return "El correo es obligatorio";
    if (!regexEmail.test(valor)) return "El correo no es válido";
    if (usuarios.some(u => u.email.toLowerCase() === valor)) return "Ese correo ya está registrado";
    return "";
}

function validarRegTipoDoc(valor) {
    if (valor === "")                       return "Selecciona el tipo de documento";
    if (valor !== "T.I" && valor !== "C.C") return "Tipo de documento no válido";
    return "";
}

function validarRegNumDoc(valor) {
    valor = valor.trim();
    if (valor === "")                          return "El número de documento es obligatorio";
    if (!regexSoloNumeros.test(valor))         return "El número de documento solo puede contener números";
    if (valor.length < 6 || valor.length > 12) return "El documento debe tener entre 6 y 12 dígitos";
    return "";
}

function validarRegFechaNac(valor) {
    if (valor === "") return "La fecha de nacimiento es obligatoria";
    const edad = calcularEdad(valor);
    if (edad === null) return "Fecha no válida";
    if (edad < 0)      return "La fecha no puede ser futura";
    if (edad > 100)    return "La fecha no es válida (edad mayor a 100)";
    return "";
}

function validarRegNombreAcudiente(valor) {
    valor = valor.trim();
    if (valor === "")                 return "El nombre del acudiente es obligatorio";
    if (valor.length < 3)             return "El nombre debe tener al menos 3 caracteres";
    if (valor.length > 50)            return "El nombre no puede superar los 50 caracteres";
    if (!regexSoloLetras.test(valor)) return "El nombre solo puede contener letras y espacios";
    return "";
}

function validarRegTelAcudiente(valor) {
    valor = valor.trim();
    if (valor === "")                          return "El teléfono del acudiente es obligatorio";
    if (!regexSoloNumeros.test(valor))         return "El teléfono solo puede contener números";
    if (valor.length < 7 || valor.length > 10) return "El teléfono debe tener entre 7 y 10 dígitos";
    return "";
}

function validarRegPassword(valor) {
    if (valor === "")     return "La contraseña es obligatoria";
    if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
}

function validarRegPassword2(valor, original) {
    if (valor === "")       return "Debes confirmar la contraseña";
    if (valor !== original) return "Las contraseñas no coinciden";
    return "";
}

function validarAceptaTerminos(checked) {
    if (!checked) return "Debes aceptar los Términos y Condiciones y la Política de Privacidad";
    return "";
}

// ==================== MOSTRAR / OCULTAR ACUDIENTE ====================
function actualizarCampoAcudiente() {
    const fecha = regFechaNacInput.value;
    const edad  = calcularEdad(fecha);
    const esMenor = edad !== null && edad >= 0 && edad < 18;

    if (esMenor) {
        campoAcudiente.hidden = false;
        regNombreAcudienteInput.required = true;
        regTelAcudienteInput.required = true;
    } else {
        campoAcudiente.hidden = true;
        regNombreAcudienteInput.required = false;
        regTelAcudienteInput.required = false;
        regNombreAcudienteInput.value = "";
        regTelAcudienteInput.value = "";
        pintarError(regNombreAcudienteInput, errorRegNombreAcudiente, "");
        pintarError(regTelAcudienteInput, errorRegTelAcudiente, "");
    }
}

// ==================== TEXTOS LEGALES ====================
const TEXTO_TERMINOS = `
    <h4>1. Aceptación de los términos</h4>
    <p>Al crear una cuenta en esta plataforma, aceptas cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos no completar el registro.</p>

    <h4>2. Uso de la cuenta</h4>
    <p>El usuario es responsable de mantener la confidencialidad de su contraseña y de toda actividad que ocurra en su cuenta. Está prohibido:</p>
    <ul>
        <li>Usar la plataforma para fines ilegales o no autorizados.</li>
        <li>Suplantar la identidad de otra persona.</li>
        <li>Compartir la cuenta con terceros sin autorización.</li>
    </ul>

    <h4>3. Datos del usuario</h4>
    <p>El usuario garantiza que la información proporcionada (nombre, correo, documento, fecha de nacimiento, entre otros) es verídica y actualizada.</p>

    <h4>4. Menores de edad</h4>
    <p>Si el usuario es menor de 18 años, el registro debe realizarse con el conocimiento y autorización de un acudiente, cuyos datos serán solicitados durante el proceso.</p>

    <h4>5. Modificaciones</h4>
    <p>La plataforma se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de los canales oficiales.</p>
`;

const TEXTO_PRIVACIDAD = `
    <h4>1. Información que recopilamos</h4>
    <p>Recopilamos los siguientes datos personales al momento del registro:</p>
    <ul>
        <li>Nombre completo.</li>
        <li>Correo electrónico.</li>
        <li>Tipo y número de documento.</li>
        <li>Fecha de nacimiento.</li>
        <li>Datos del acudiente (solo si el usuario es menor de edad).</li>
    </ul>

    <h4>2. Finalidad del tratamiento</h4>
    <p>Los datos serán utilizados para:</p>
    <ul>
        <li>Gestionar el acceso a la plataforma.</li>
        <li>Verificar la identidad del usuario.</li>
        <li>Enviar comunicaciones relacionadas con el servicio.</li>
        <li>Cumplir con obligaciones legales.</li>
    </ul>

    <h4>3. Protección de los datos</h4>
    <p>Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.</p>

    <h4>4. Derechos del usuario</h4>
    <p>Puedes solicitar en cualquier momento el acceso, corrección o eliminación de tus datos personales escribiendo a nuestro correo de soporte.</p>

    <h4>5. Cookies</h4>
    <p>Esta plataforma puede usar almacenamiento local (localStorage) para recordar tu sesión. No usamos cookies de terceros con fines publicitarios.</p>
`;

// ==================== MODAL (protegido) ====================
if (abrirTerminosLink) {
    abrirTerminosLink.addEventListener("click", (e) => {
        e.preventDefault();
        abrirModal("Términos y Condiciones", TEXTO_TERMINOS);
    });
}

if (abrirPrivacidadLink) {
    abrirPrivacidadLink.addEventListener("click", (e) => {
        e.preventDefault();
        abrirModal("Política de Privacidad", TEXTO_PRIVACIDAD);
    });
}

if (cerrarModalBtn)  cerrarModalBtn.addEventListener("click", cerrarModal);
if (aceptarModalBtn) aceptarModalBtn.addEventListener("click", cerrarModal);

if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) cerrarModal();
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && !modalOverlay.hidden) cerrarModal();
});

// ==================== CHECKBOX TÉRMINOS (protegido) ====================
if (aceptaTerminosInput) {
    aceptaTerminosInput.addEventListener("change", () => {
        pintarError(aceptaTerminosInput, errorAceptaTerminos,
            validarAceptaTerminos(aceptaTerminosInput.checked));
        if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
    });
}

// ==================== VALIDACIÓN EN VIVO ====================
regUsuarioInput.addEventListener("input", () => {
    pintarError(regUsuarioInput, errorRegUsuario, validarRegUsuario(regUsuarioInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regEmailInput.addEventListener("input", () => {
    pintarError(regEmailInput, errorRegEmail, validarRegEmail(regEmailInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regTipoDocInput.addEventListener("change", () => {
    pintarError(regTipoDocInput, errorRegTipoDoc, validarRegTipoDoc(regTipoDocInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regNumDocInput.addEventListener("input", () => {
    regNumDocInput.value = regNumDocInput.value.replace(/\D/g, "").slice(0, 12);
    pintarError(regNumDocInput, errorRegNumDoc, validarRegNumDoc(regNumDocInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

function manejarCambioFecha() {
    pintarError(regFechaNacInput, errorRegFechaNac, validarRegFechaNac(regFechaNacInput.value));
    actualizarCampoAcudiente();
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
}

regFechaNacInput.addEventListener("change", manejarCambioFecha);
regFechaNacInput.addEventListener("input",  manejarCambioFecha);
regFechaNacInput.addEventListener("blur",   manejarCambioFecha);

regNombreAcudienteInput.addEventListener("input", () => {
    pintarError(regNombreAcudienteInput, errorRegNombreAcudiente,
        validarRegNombreAcudiente(regNombreAcudienteInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regTelAcudienteInput.addEventListener("input", () => {
    regTelAcudienteInput.value = regTelAcudienteInput.value.replace(/\D/g, "").slice(0, 10);
    pintarError(regTelAcudienteInput, errorRegTelAcudiente,
        validarRegTelAcudiente(regTelAcudienteInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regPasswordInput.addEventListener("input", () => {
    pintarError(regPasswordInput, errorRegPassword, validarRegPassword(regPasswordInput.value));
    if (regPassword2Input.value !== "") {
        pintarError(regPassword2Input, errorRegPassword2,
            validarRegPassword2(regPassword2Input.value, regPasswordInput.value));
    }
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

regPassword2Input.addEventListener("input", () => {
    pintarError(regPassword2Input, errorRegPassword2,
        validarRegPassword2(regPassword2Input.value, regPasswordInput.value));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

aceptaTerminosInput.addEventListener("change", () => {
    pintarError(aceptaTerminosInput, errorAceptaTerminos,
        validarAceptaTerminos(aceptaTerminosInput.checked));
    if (mensajeRegistro.textContent) mostrarMensaje(mensajeRegistro, "", "");
});

// ==================== REGISTRO (SUBMIT) ====================
registroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // --- Datos personales ---
    const usuario  = regUsuarioInput.value.trim();
    const email    = regEmailInput.value.trim().toLowerCase();
    const tipoDoc  = regTipoDocInput.value;
    const numDoc   = regNumDocInput.value.trim();
    const fechaNac = regFechaNacInput.value;

    // --- Acudiente (solo si es menor) ---
    const edad = calcularEdad(fechaNac);
    const esMenor = edad !== null && edad >= 0 && edad < 18;
    const nombreAcudiente = esMenor ? regNombreAcudienteInput.value.trim() : "";
    const telAcudiente    = esMenor ? regTelAcudienteInput.value.trim()    : "";

    // --- Contraseñas ---
    const password  = regPasswordInput.value;
    const password2 = regPassword2Input.value;

    // --- Términos ---
    const aceptaTerminos = aceptaTerminosInput.checked;

    // --- Validaciones ---
    const msgUsuario   = validarRegUsuario(usuario);
    const msgEmail     = validarRegEmail(email);
    const msgTipoDoc   = validarRegTipoDoc(tipoDoc);
    const msgNumDoc    = validarRegNumDoc(numDoc);
    const msgFechaNac  = validarRegFechaNac(fechaNac);
    const msgNomAcud   = esMenor ? validarRegNombreAcudiente(nombreAcudiente) : "";
    const msgTelAcud   = esMenor ? validarRegTelAcudiente(telAcudiente)       : "";
    const msgPassword  = validarRegPassword(password);
    const msgPassword2 = validarRegPassword2(password2, password);
    const msgTerminos  = validarAceptaTerminos(aceptaTerminos);

    // --- Pintar errores ---
    pintarError(regUsuarioInput,   errorRegUsuario,   msgUsuario);
    pintarError(regEmailInput,     errorRegEmail,     msgEmail);
    pintarError(regTipoDocInput,   errorRegTipoDoc,   msgTipoDoc);
    pintarError(regNumDocInput,    errorRegNumDoc,    msgNumDoc);
    pintarError(regFechaNacInput,  errorRegFechaNac,  msgFechaNac);
    pintarError(regPasswordInput,  errorRegPassword,  msgPassword);
    pintarError(regPassword2Input, errorRegPassword2, msgPassword2);
    pintarError(aceptaTerminosInput, errorAceptaTerminos, msgTerminos);

    if (esMenor) {
        pintarError(regNombreAcudienteInput, errorRegNombreAcudiente, msgNomAcud);
        pintarError(regTelAcudienteInput,    errorRegTelAcudiente,    msgTelAcud);
    }

    const hayError = msgUsuario || msgEmail || msgTipoDoc || msgNumDoc || msgFechaNac ||
                     msgNomAcud || msgTelAcud || msgPassword || msgPassword2 || msgTerminos;

    if (hayError) {
        mostrarMensaje(mensajeRegistro, "Revisa los campos marcados en rojo", "error");

        if (msgUsuario)        regUsuarioInput.focus();
        else if (msgEmail)     regEmailInput.focus();
        else if (msgTipoDoc)   regTipoDocInput.focus();
        else if (msgNumDoc)    regNumDocInput.focus();
        else if (msgFechaNac)  regFechaNacInput.focus();
        else if (msgNomAcud)   regNombreAcudienteInput.focus();
        else if (msgTelAcud)   regTelAcudienteInput.focus();
        else if (msgPassword)  regPasswordInput.focus();
        else if (msgPassword2) regPassword2Input.focus();
        else                   aceptaTerminosInput.focus();
        return;
    }

    // --- Verificar documento duplicado ---
    const docDuplicado = usuarios.some(u =>
        u.tipoDoc === tipoDoc && u.numDoc === numDoc
    );
    if (docDuplicado) {
        pintarError(regNumDocInput, errorRegNumDoc, "Ya existe una cuenta con ese documento");
        mostrarMensaje(mensajeRegistro, "Ya existe una cuenta con ese documento", "error");
        regNumDocInput.focus();
        return;
    }

    // --- Guardar usuario ---
    const nuevoUsuario = {
        usuario,
        email,
        tipoDoc,
        numDoc,
        fechaNac,
        password,
        rol: "Aprendiz",
        aceptaTerminos: true,
        fechaAceptacion: new Date().toISOString()
    };

    if (esMenor) {
        nuevoUsuario.nombreAcudiente = nombreAcudiente;
        nuevoUsuario.telAcudiente    = telAcudiente;
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarMensaje(mensajeRegistro, "¡Registro exitoso! Redirigiendo al login...", "exito");

    setTimeout(() => {
        registroForm.reset();
        campoAcudiente.hidden = true;
        window.location.href = "login.html";
    }, 1500);
});