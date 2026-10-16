// ==================== REFERENCIAS AL DOM ====================
const sidebar          = document.getElementById("sidebar");
const overlay          = document.getElementById("overlay");
const abrirSidebarBtn  = document.getElementById("abrirSidebar");
const cerrarSidebarBtn = document.getElementById("cerrarSidebar");
const btnCerrarSesion  = document.getElementById("btnCerrarSesion");

const nombreAdmin    = document.getElementById("nombreAdmin");
const emailAdmin     = document.getElementById("emailAdmin");
const fechaHoy       = document.getElementById("fechaHoy");
const tituloSeccion  = document.getElementById("tituloSeccion");

const kpiUsuarios      = document.getElementById("kpiUsuarios");
const kpiAprendices    = document.getElementById("kpiAprendices");
const kpiProfesionales = document.getElementById("kpiProfesionales");
const kpiSesion        = document.getElementById("kpiSesion");
const kpiSesionDetalle = document.getElementById("kpiSesionDetalle");

const barraAprendices         = document.getElementById("barraAprendices");
const barraAprendicesValor    = document.getElementById("barraAprendicesValor");
const barraProfesionales      = document.getElementById("barraProfesionales");
const barraProfesionalesValor = document.getElementById("barraProfesionalesValor");

const listaActividad = document.getElementById("listaActividad");

const buscadorUsuarios = document.getElementById("buscadorUsuarios");
const tablaUsuarios    = document.getElementById("tablaUsuarios");

const kpiMes      = document.getElementById("kpiMes");
const kpiSemana   = document.getElementById("kpiSemana");
const kpiMenores  = document.getElementById("kpiMenores");
const kpiTerminos = document.getElementById("kpiTerminos");

const barraTI      = document.getElementById("barraTI");
const barraTIValor = document.getElementById("barraTIValor");
const barraCC      = document.getElementById("barraCC");
const barraCCValor = document.getElementById("barraCCValor");

const btnExportarCSV  = document.getElementById("btnExportarCSV");
const modoOscuroCheck = document.getElementById("modoOscuro");

// ==================== BASE DE DATOS SIMULADA ====================
function cargarUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch {
        return [];
    }
}

function cargarSesion() {
    try {
        return JSON.parse(localStorage.getItem("sesionActiva"))
            || JSON.parse(sessionStorage.getItem("sesionActiva"));
    } catch {
        return null;
    }
}

const usuarios = cargarUsuarios();
const sesion   = cargarSesion();

// ==================== UTILIDADES ====================
function formatearFecha(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
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

function escaparHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ==================== FECHA DEL DÍA ====================
(function mostrarFechaHoy() {
    const hoy = new Date();
    fechaHoy.textContent = hoy.toLocaleDateString("es-CO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
})();

// ==================== DATOS DEL ADMIN ====================
(function mostrarAdmin() {
    if (sesion) {
        nombreAdmin.textContent = sesion.usuario || "Administrador";
        emailAdmin.textContent  = sesion.email   || "admin@test.com";
        kpiSesion.textContent   = "Activa";
        kpiSesionDetalle.textContent = `${sesion.usuario} (${sesion.rol || "—"})`;
    } else {
        nombreAdmin.textContent = "Invitado";
        emailAdmin.textContent  = "Sin sesión";
        kpiSesion.textContent   = "—";
        kpiSesionDetalle.textContent = "Sin sesión";
    }
})();

// ==================== KPIs ====================
(function calcularKPIs() {
    const total = usuarios.length;
    const aprendices    = usuarios.filter(u => u.rol === "Aprendiz").length;
    const profesionales = usuarios.filter(u => u.rol === "Profesional").length;

    kpiUsuarios.textContent      = total;
    kpiAprendices.textContent    = aprendices;
    kpiProfesionales.textContent = profesionales;

    const max = Math.max(aprendices, profesionales, 1);
    barraAprendices.style.width       = ((aprendices / max) * 100) + "%";
    barraProfesionales.style.width    = ((profesionales / max) * 100) + "%";
    barraAprendicesValor.textContent  = aprendices;
    barraProfesionalesValor.textContent = profesionales;
})();

// ==================== ESTADÍSTICAS ====================
(function calcularEstadisticas() {
    const ahora  = new Date();
    const hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hace7  = new Date(ahora.getTime() - 7  * 24 * 60 * 60 * 1000);

    const delMes = usuarios.filter(u => {
        if (!u.fechaAceptacion) return false;
        return new Date(u.fechaAceptacion) >= hace30;
    }).length;

    const deLaSemana = usuarios.filter(u => {
        if (!u.fechaAceptacion) return false;
        return new Date(u.fechaAceptacion) >= hace7;
    }).length;

    const menores = usuarios.filter(u => {
        const edad = calcularEdad(u.fechaNac);
        return edad !== null && edad >= 0 && edad < 18;
    }).length;

    const aceptaronTerminos = usuarios.filter(u => u.aceptaTerminos === true).length;

    kpiMes.textContent      = delMes;
    kpiSemana.textContent   = deLaSemana;
    kpiMenores.textContent  = menores;
    kpiTerminos.textContent = aceptaronTerminos;

    // Barras por tipo de documento
    const ti = usuarios.filter(u => u.tipoDoc === "T.I").length;
    const cc = usuarios.filter(u => u.tipoDoc === "C.C").length;
    const maxDoc = Math.max(ti, cc, 1);

    barraTI.style.width      = ((ti / maxDoc) * 100) + "%";
    barraCC.style.width      = ((cc / maxDoc) * 100) + "%";
    barraTIValor.textContent = ti;
    barraCCValor.textContent = cc;
})();

// ==================== ACTIVIDAD RECIENTE ====================
(function mostrarActividad() {
    const recientes = usuarios
        .filter(u => u.fechaAceptacion)
        .sort((a, b) => new Date(b.fechaAceptacion) - new Date(a.fechaAceptacion))
        .slice(0, 5);

    if (recientes.length === 0) {
        listaActividad.innerHTML = '<li class="vacio">Sin actividad registrada</li>';
        return;
    }

    listaActividad.innerHTML = recientes.map(u => `
        <li>
            <span><strong>${escaparHTML(u.usuario)}</strong> se registró como ${escaparHTML(u.rol || "Aprendiz")}</span>
            <span class="fecha-actividad">${formatearFecha(u.fechaAceptacion)}</span>
        </li>
    `).join("");
})();

// ==================== TABLA DE USUARIOS ====================
function renderizarTabla(filtro = "") {
    const texto = filtro.trim().toLowerCase();

    const filtrados = usuarios.filter(u => {
        if (texto === "") return true;
        const nombre = (u.usuario || "").toLowerCase();
        const email  = (u.email || "").toLowerCase();
        return nombre.includes(texto) || email.includes(texto);
    });

    if (filtrados.length === 0) {
        tablaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="vacio">
                    ${texto === "" ? "Sin usuarios registrados" : "Sin resultados para la búsqueda"}
                </td>
            </tr>`;
        return;
    }

    tablaUsuarios.innerHTML = filtrados.map(u => {
        const claseBadge = (u.rol === "Profesional") ? "profesional" : "aprendiz";
        return `
            <tr>
                <td>${escaparHTML(u.usuario)}</td>
                <td>${escaparHTML(u.email)}</td>
                <td>${escaparHTML(u.tipoDoc || "—")} ${escaparHTML(u.numDoc || "")}</td>
                <td><span class="badge ${claseBadge}">${escaparHTML(u.rol || "Aprendiz")}</span></td>
                <td>${formatearFecha(u.fechaAceptacion)}</td>
            </tr>`;
    }).join("");
}

renderizarTabla();

if (buscadorUsuarios) {
    buscadorUsuarios.addEventListener("input", (e) => {
        renderizarTabla(e.target.value);
    });
}

// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
const navLinks = document.querySelectorAll(".nav-link");
const secciones = document.querySelectorAll(".seccion");
const titulos = {
    resumen:       "Resumen",
    usuarios:      "Usuarios",
    estadisticas:  "Estadísticas",
    reportes:      "Reportes",
    configuracion: "Configuración"
};

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const seccion = link.dataset.seccion;

        navLinks.forEach(l => l.classList.remove("activo"));
        link.classList.add("activo");

        secciones.forEach(s => s.classList.remove("activa"));
        const destino = document.getElementById("seccion-" + seccion);
        if (destino) destino.classList.add("activa");

        tituloSeccion.textContent = titulos[seccion] || "Resumen";

        // En móvil, cerrar el menú después de elegir
        if (window.innerWidth <= 900) cerrarSidebar();
    });
});

// ==================== SIDEBAR MÓVIL ====================
function abrirSidebar() {
    sidebar.classList.add("abierto");
    overlay.hidden = false;
}

function cerrarSidebar() {
    sidebar.classList.remove("abierto");
    overlay.hidden = true;
}

if (abrirSidebarBtn)  abrirSidebarBtn.addEventListener("click", abrirSidebar);
if (cerrarSidebarBtn) cerrarSidebarBtn.addEventListener("click", cerrarSidebar);
if (overlay)          overlay.addEventListener("click", cerrarSidebar);

// ==================== CERRAR SESIÓN ====================
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("sesionActiva");
        sessionStorage.removeItem("sesionActiva");
        window.location.href = "LandingPage/login.html";
    });
}

// ==================== EXPORTAR CSV ====================
if (btnExportarCSV) {
    btnExportarCSV.addEventListener("click", () => {
        if (usuarios.length === 0) {
            alert("No hay usuarios para exportar.");
            return;
        }

        const columnas = ["usuario", "email", "tipoDoc", "numDoc", "fechaNac", "rol", "fechaAceptacion"];
        const encabezado = columnas.join(",");

        const filas = usuarios.map(u =>
            columnas.map(col => {
                const valor = u[col] ?? "";
                return `"${String(valor).replace(/"/g, '""')}"`;
            }).join(",")
        );

        const csv = [encabezado, ...filas].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "usuarios_" + new Date().toISOString().slice(0, 10) + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// ==================== MODO OSCURO ====================
if (modoOscuroCheck) {
    const modoGuardado = localStorage.getItem("modoOscuro") === "true";
    modoOscuroCheck.checked = modoGuardado;
    if (modoGuardado) document.body.classList.add("modo-oscuro");

    modoOscuroCheck.addEventListener("change", () => {
        const activo = modoOscuroCheck.checked;
        document.body.classList.toggle("modo-oscuro", activo);
        localStorage.setItem("modoOscuro", String(activo));
    });
}