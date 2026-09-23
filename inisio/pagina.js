// ==================== PROTECCIÓN DE SESIÓN ====================
let sesion = null;
try {
    sesion = JSON.parse(localStorage.getItem("sesionActiva"))
          || JSON.parse(sessionStorage.getItem("sesionActiva"));
} catch {
    sesion = null;
}

if (!sesion) {
    window.location.href = "LandingPage/login.html";
}

const OCHO_HORAS = 1000 * 60 * 60 * 8;
if (sesion && Date.now() - sesion.hora > OCHO_HORAS) {
    localStorage.removeItem("sesionActiva");
    sessionStorage.removeItem("sesionActiva");
    window.location.href = "LandingPage/login.html";
}

// ==================== CERRAR SESIÓN ====================
const btnCerrar = document.getElementById("btnCerrarSesion");
if (btnCerrar) {
    btnCerrar.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("sesionActiva");
        sessionStorage.removeItem("sesionActiva");
        window.location.href = "LandingPage/login.html";
    });
}

// ==================== INICIALIZACIÓN SEGÚN ROL ====================
window.addEventListener("DOMContentLoaded", () => {

    const nombreEl = document.getElementById("nombreUsuario");
    const badgeEl  = document.getElementById("badgeRol");

    if (nombreEl && sesion) {
        nombreEl.textContent = "SIGBA · " + sesion.usuario;
    }
    if (badgeEl && sesion) {
        badgeEl.textContent = sesion.rol;
        if (sesion.rol.toLowerCase() === "profesional") {
            badgeEl.classList.add("profesional");
        }
    }

    const panelProfesional    = document.getElementById("panelProfesional");
    const panelAprendiz       = document.getElementById("panelAprendiz");
    const carruselSec         = document.getElementById("carruselSection");

    const esProfesional = sesion && sesion.rol.toLowerCase() === "profesional";

    if (esProfesional) {
        panelProfesional?.classList.remove("oculto");
        panelAprendiz?.classList.add("oculto");
        carruselSec?.classList.add("oculto");
        inicializarPanelProfesional();
    } else {
        panelAprendiz?.classList.remove("oculto");
        panelProfesional?.classList.add("oculto");
        inicializarPanelAprendiz();
    }
});

// ==================================================================
// ==================== PANEL PROFESIONAL ========================
// ==================================================================
function inicializarPanelProfesional() {

    const solicitudes = [
        { id: 1, nombre: "Tomas Luna Ramos",       ficha: "2555555", tipo: "Transporte",   estado: "Pendiente" },
        { id: 2, nombre: "María Fernanda Gómez",   ficha: "2555555", tipo: "Alimentación", estado: "Pendiente" },
        { id: 3, nombre: "Juan Sebastián Pérez",   ficha: "2555556", tipo: "Transporte",   estado: "Aprobado"  },
        { id: 4, nombre: "Laura Valentina Rojas",  ficha: "2555557", tipo: "Alimentación", estado: "Pendiente" }
    ];

    document.getElementById("totalAprendices").textContent = 124;
    document.getElementById("totalSubsidios").textContent  = 87;
    document.getElementById("totalEventos").textContent    = 6;
    document.getElementById("totalPendientes").textContent =
        solicitudes.filter(s => s.estado === "Pendiente").length;

    const tbody = document.getElementById("tablaPendientesBody");
    if (tbody) {
        tbody.innerHTML = "";
        solicitudes.forEach((s, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${s.nombre}</td>
                <td>${s.ficha}</td>
                <td>${s.tipo}</td>
                <td><span class="estado ${s.estado.toLowerCase()}">${s.estado}</span></td>
                <td>
                    <button class="btn-aprobar"  data-id="${s.id}">Aprobar</button>
                    <button class="btn-rechazar" data-id="${s.id}">Rechazar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            const id = btn.dataset.id;
            const accion = btn.classList.contains("btn-aprobar") ? "Aprobado" : "Rechazado";
            alert(`Solicitud #${id} → ${accion}`);
        });
    }

    const formEvento = document.getElementById("formEvento");

    document.getElementById("btnCrearEvento")?.addEventListener("click", () => {
        formEvento?.classList.remove("oculto");
        formEvento?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("btnCancelarEvento")?.addEventListener("click", () => {
        formEvento?.classList.add("oculto");
    });

    document.getElementById("btnAprobarSubsidio")?.addEventListener("click", () => {
        alert("Aquí abrirías el listado completo de subsidios pendientes.");
    });
    document.getElementById("btnVerAprendices")?.addEventListener("click", () => {
        alert("Aquí abrirías la tabla completa de aprendices.");
    });
    document.getElementById("btnGenerarReporte")?.addEventListener("click", () => {
        alert("Aquí generarías un PDF o Excel con el reporte.");
    });

    document.getElementById("crearEventoForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const titulo = document.getElementById("evTitulo").value.trim();
        const fecha  = document.getElementById("evFecha").value;
        const desc   = document.getElementById("evDescripcion").value.trim();
        const msg    = document.getElementById("mensajeEvento");

        if (!titulo || !fecha || !desc) {
            msg.textContent = "Completa todos los campos";
            msg.className = "mensaje error";
            return;
        }

        msg.textContent = "✅ Evento creado correctamente";
        msg.className = "mensaje exito";

        setTimeout(() => {
            document.getElementById("crearEventoForm").reset();
            formEvento?.classList.add("oculto");
            msg.textContent = "";
        }, 1500);
    });
}

// ==================================================================
// ==================== PANEL APRENDIZ ==============================
// ==================================================================
function inicializarPanelAprendiz() {

    // ---- CARRUSEL ----
    const carrusel    = document.getElementById("carrusel");
    const btnAtras    = document.getElementById("atras");
    const btnAdelante = document.getElementById("adelante");
    const imagenes    = document.querySelectorAll(".carrusel-item");

    if (carrusel && btnAtras && btnAdelante && imagenes.length > 0) {
        let indiceActual = 0;

        const actualizar = () => {
            carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
        };

        btnAdelante.addEventListener("click", () => {
            indiceActual = (indiceActual + 1) % imagenes.length;
            actualizar();
        });

        btnAtras.addEventListener("click", () => {
            indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
            actualizar();
        });

        setInterval(() => btnAdelante.click(), 5000);
    }

    // ---- CALENDARIO ----
    const eventos = [
        { fecha: "2026-09-10", titulo: "Taller de Prevención y Salud Sexual", descripcion: "Taller mensual organizado por el área de salud.", accion: "Inscribirme" },
        { fecha: "2026-09-15", titulo: "Convocatoria Apoyo de Alimentación",  descripcion: "Apertura de recepción de documentos.", accion: "Ver Requisitos" },
        { fecha: "2026-09-20", titulo: "Torneo de Ajedrez",                   descripcion: "Actividad de integración deportiva.", accion: "Inscribirme" }
    ];

    const grid        = document.getElementById("calendarioGrid");
    const mesActualEl = document.getElementById("mesActual");
    const detalleEl   = document.getElementById("eventoDetalle");
    const btnMesAnt   = document.getElementById("mesAnterior");
    const btnMesSig   = document.getElementById("mesSiguiente");

    if (grid && mesActualEl && detalleEl && btnMesAnt && btnMesSig) {
        let fechaActual = new Date(2026, 8, 1);

        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                       "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        const formatear = (y, m, d) =>
            `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        function renderizar() {
            const year = fechaActual.getFullYear();
            const mes  = fechaActual.getMonth();

            mesActualEl.textContent = `${meses[mes]} ${year}`;
            grid.innerHTML = "";

            const primerDia = new Date(year, mes, 1).getDay();
            const diasEnMes = new Date(year, mes + 1, 0).getDate();

            for (let i = 0; i < primerDia; i++) {
                const v = document.createElement("div");
                v.classList.add("dia", "vacio");
                grid.appendChild(v);
            }

            for (let d = 1; d <= diasEnMes; d++) {
                const dia = document.createElement("div");
                dia.classList.add("dia");
                dia.textContent = d;

                const fechaStr = formatear(year, mes, d);
                const ev = eventos.find(e => e.fecha === fechaStr);

                if (ev) {
                    dia.classList.add("con-evento");
                    dia.addEventListener("click", () => mostrarDetalle(ev));
                }

                const hoy = new Date();
                if (year === hoy.getFullYear() && mes === hoy.getMonth() && d === hoy.getDate()) {
                    dia.classList.add("hoy");
                }

                grid.appendChild(dia);
            }
        }

        function mostrarDetalle(ev) {
            detalleEl.innerHTML = `
                <h5>${ev.titulo}</h5>
                <p><strong>Fecha:</strong> ${ev.fecha}</p>
                <p>${ev.descripcion}</p>
                <button class="btn-evento">${ev.accion}</button>
            `;
        }

        btnMesAnt.addEventListener("click", () => {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
            renderizar();
        });
        btnMesSig.addEventListener("click", () => {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            renderizar();
        });

        renderizar();
    }

    // ---- TABLA TRANSPORTE ----
    const transporte = [
        { nombre: "Tomas Luna Ramos",         cedula: "1.020.345.678", ficha: "2555555", estado: "Activo" },
        { nombre: "María Fernanda Gómez",     cedula: "1.045.678.912", ficha: "2555555", estado: "Activo" },
        { nombre: "Juan Sebastián Pérez",     cedula: "1.098.765.432", ficha: "2555556", estado: "Pendiente" },
        { nombre: "Laura Valentina Rodríguez",cedula: "1.012.345.987", ficha: "2555557", estado: "Activo" }
    ];

    const tbodyT = document.getElementById("tablaSubsidioBody");
    if (tbodyT) {
        transporte.forEach((ap, i) => {
            const tr = document.createElement("tr");
            const clase = ap.estado.toLowerCase() === "activo" ? "activo" : "pendiente";
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${ap.nombre}</td>
                <td>${ap.cedula}</td>
                <td>${ap.ficha}</td>
                <td><span class="estado ${clase}">${ap.estado}</span></td>
            `;
            tbodyT.appendChild(tr);
        });
    }

    // ---- TABLA ALIMENTACIÓN ----
    const alimentacion = [
        { nombre: "Tomas Luna Ramos",       cedula: "1.020.345.678", ficha: "2555555", estado: "Activo" },
        { nombre: "María Fernanda Gómez",   cedula: "1.045.678.912", ficha: "2555555", estado: "Pendiente" },
        { nombre: "Sofía Carolina Herrera", cedula: "1.034.567.891", ficha: "2555558", estado: "Activo" }
    ];

    const tbodyA = document.getElementById("tablaAlimentacionBody");
    if (tbodyA) {
        alimentacion.forEach((ap, i) => {
            const tr = document.createElement("tr");
            const clase = ap.estado.toLowerCase() === "activo" ? "activo" : "pendiente";
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${ap.nombre}</td>
                <td>${ap.cedula}</td>
                <td>${ap.ficha}</td>
                <td><span class="estado ${clase}">${ap.estado}</span></td>
            `;
            tbodyA.appendChild(tr);
        });
    }
}