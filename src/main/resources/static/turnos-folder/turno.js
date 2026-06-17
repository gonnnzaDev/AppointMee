import { authHeaders } from "../recursos/modulos.js";



const API = "http://localhost:8080";
const IMG_FALLBACK = "https://xentra.glomastore.mx/img/sin_imagen.png";
const sucursalId = new URLSearchParams(window.location.search).get("sucursalId");

let empleadoSeleccionado = null;
let servicioSeleccionado = null;
let fechaHoraSeleccionada = null;

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const hoy = new Date();
let vistaYear = hoy.getFullYear();
let vistaMes = hoy.getMonth();
let diaSeleccionado = null;
let horariosDelDia = [];
let turnoSeleccionado = null;

if (!sucursalId) {
    document.getElementById("agendarTurno-container").innerHTML =
        `<p class="turno-sin-dia">No se encontró la sucursal. Volvé atrás e intentá de nuevo.</p>`;
} else {
    renderPaso1();
}

function renderPaso2() {
    const c = document.getElementById("agendarTurno-container");
    c.innerHTML = `
        <div class="agendarTurno-info">
            <h2 class="turno-paso-titulo">Elegí un profesional</h2>
            <div class="empleados-container" id="empleados-container">
                <p class="turno-sin-dia">Cargando profesionales…</p>
            </div>
            <div class="info-seleccionada" id="info-seleccionada"></div>
            <button class="btn-proceso" id="volver">Volver</button>
            <button class="btn-proceso" id="siguiente" disabled>Siguiente</button>

        </div>`;

    cargarEmpleados();

    document.getElementById("volver").addEventListener("click", () => {
        renderPaso1();
    });

    document.getElementById("siguiente").addEventListener("click", () => {

        renderPaso3();

    });

}

async function cargarEmpleados() {
    try {
        const res = await fetch(`${API}/sucursales/${sucursalId}/elegir-empleado`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const empleados = await res.json();

        const contenedor = document.getElementById("empleados-container");
        if (!contenedor) return;

        if (!empleados.length) {
            contenedor.innerHTML = `<p class="turno-sin-dia">Esta sucursal no tiene profesionales disponibles.</p>`;
            return;
        }

        contenedor.innerHTML = empleados.map(e => `
            <article class="empleado-article" data-id="${e.id}" onclick="seleccionarEmpleado(${e.id}, this)">
                <img src="${e.urlFotoPerfil || IMG_FALLBACK}"
                     alt="Foto de ${e.nombre}"
                     onerror="this.src='${IMG_FALLBACK}'">
                <p class="empleado-nombre">${e.nombre} ${e.apellido}</p>
                <p class="empleado-valoracion">
                    C:${e.puntuacion ? "🐝".repeat(Math.round(e.puntuacion)) : ""} 
                </p>
            </article>`).join("");

    } catch (err) {
        const contenedor = document.getElementById("empleados-container");
        if (contenedor) contenedor.innerHTML = `<p class="turno-sin-dia">No se pudieron cargar los profesionales.</p>`;
    }
}


window.seleccionarEmpleado = function (id, el) {
    document.querySelectorAll(".empleado-article").forEach(a =>
        a.classList.remove("empleado-article--seleccionado"));
    el.classList.add("empleado-article--seleccionado");

    empleadoSeleccionado = {
        id,
        nombre: el.querySelector(".empleado-nombre")?.textContent ?? "",
        imagen: el.querySelector("img")?.src ?? IMG_FALLBACK
    };

    const info = document.getElementById("info-seleccionada");
    if (info) info.innerHTML = `
        <img src="${empleadoSeleccionado.imagen}"
             alt="${empleadoSeleccionado.nombre}"
             onerror="this.src='${IMG_FALLBACK}'">
        <h3>${empleadoSeleccionado.nombre}</h3>`;

    document.getElementById("siguiente").disabled = false;
};

function renderPaso1() {
    const c = document.getElementById("agendarTurno-container");
    c.innerHTML = `
        <div class="agendarTurno-info">
            <h2 class="turno-paso-titulo">Elegí un servicio</h2>
            <div class="servicios-container" id="servicios-container">
                <p class="turno-sin-dia">Cargando servicios…</p>
            </div>
            <button class="btn-proceso btn-proceso--secundario" id="volver">Volver</button>
            <button class="btn-proceso" id="siguiente" disabled>Siguiente</button>
        </div>`;

    cargarServicios();
    document.getElementById("siguiente").addEventListener("click", renderPaso2);
    document.getElementById("volver").addEventListener("click", () => {
        history.go(-1);
    });
}

async function cargarServicios() {
    try {
        const res = await fetch(`${API}/servicios/listar/sucursal/${sucursalId}`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const servicios = await res.json();

        const contenedor = document.getElementById("servicios-container");
        if (!contenedor) return;

        if (!servicios.length) {
            contenedor.innerHTML = `<p class="turno-sin-dia">Esta sucursal no tiene servicios disponibles.</p>`;
            return;
        }

        contenedor.innerHTML = servicios.map(s => `
            <article class="empleado-article" data-id="${s.id}" onclick="seleccionarServicio(${s.id}, this, '${escapar(s.nombre)}')">
                <img src="${s.fotoPerfil || IMG_FALLBACK}"
                     alt="${s.nombre}"
                     onerror="this.src='${IMG_FALLBACK}'">
                <p class="empleado-nombre">${s.nombre}</p>
                <p class="empleado-valoracion">
                    ⏱ ${s.duracion} min 
                </p>
            </article>`).join("");

    } catch (err) {
        const contenedor = document.getElementById("servicios-container");
        if (contenedor) contenedor.innerHTML = `<p class="turno-sin-dia">No se pudieron cargar los servicios.</p>`;
    }
}

window.seleccionarServicio = function (id, el, nombre) {
    document.querySelectorAll(".servicios-container .empleado-article").forEach(a =>
        a.classList.remove("empleado-article--seleccionado"));
    el.classList.add("empleado-article--seleccionado");

    servicioSeleccionado = { id, nombre };
    document.getElementById("siguiente").disabled = false;
};

function escapar(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

let cacheDisponibilidad = null;

function renderPaso3() {
    diaSeleccionado = null;
    turnoSeleccionado = null;
    fechaHoraSeleccionada = null;
    cacheDisponibilidad = null;
    vistaYear = hoy.getFullYear();
    vistaMes = hoy.getMonth();

    const c = document.getElementById("agendarTurno-container");
    c.innerHTML = `
        <div class="agendarTurno-info">
            <div class="turno-container">
                <div class="turno-header">
                    <h1>¿Cuándo querés venir?</h1>
                    <p class="turno-paso-sub">
                        ${empleadoSeleccionado.nombre} &nbsp;·&nbsp; ${servicioSeleccionado.nombre}
                    </p>
                </div>

                <div class="cal-nav">
                    <button class="cal-nav-btn" id="btn-prev">&#8249;</button>
                    <span class="cal-mes-nombre" id="cal-mes-nombre"></span>
                    <button class="cal-nav-btn" id="btn-next">&#8250;</button>
                </div>

                <div class="cal-semana">
                    <div class="cal-semana-label">DO</div>
                    <div class="cal-semana-label">LU</div>
                    <div class="cal-semana-label">MA</div>
                    <div class="cal-semana-label">MI</div>
                    <div class="cal-semana-label">JU</div>
                    <div class="cal-semana-label">VI</div>
                    <div class="cal-semana-label">SA</div>
                </div>

                <div class="cal-grid" id="cal-grid"></div>

                <p class="turno-horarios-titulo" id="horarios-titulo">Horarios disponibles</p>
                <div class="turno-horarios-grid" id="horarios-grid">
                    <span class="turno-sin-dia">Seleccioná un día para ver los horarios.</span>
                </div>

                <div class="turno-resumen" id="turno-resumen" style="display:none">
                    <span class="turno-resumen-texto" id="turno-resumen-texto"></span>
                </div>

                <div class="turno-footer">
                    <button class="btn-proceso btn-proceso--secundario" id="volver">Volver</button>
                    <button class="turno-btn-siguiente" id="siguiente" disabled>
                        Confirmar turno <span>→</span>
                    </button>
                </div>
            </div>
        </div>`;

    document.getElementById("btn-prev").addEventListener("click", () => {
        if (--vistaMes < 0) { vistaMes = 11; vistaYear--; }
        renderCalendario();
    });
    document.getElementById("btn-next").addEventListener("click", () => {
        if (++vistaMes > 11) { vistaMes = 0; vistaYear++; }
        renderCalendario();
    });
    document.getElementById("volver").addEventListener("click", renderPaso2);
    document.getElementById("siguiente").addEventListener("click", confirmarTurno);

    cargarDisponibilidad();
}

async function cargarDisponibilidad() {
    try {
        const res = await fetch(
            `${API}/turnos/disponibilidad/empleado/${empleadoSeleccionado.id}/servicio/${servicioSeleccionado.id}`,
            { headers: authHeaders() }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        cacheDisponibilidad = await res.json();
    } catch (err) {
        cacheDisponibilidad = [];
        alert("No se pudo cargar la disponibilidad: " + err.message);
    }
    renderCalendario();
}

function horariosParaFecha(y, m, d) {
    if (!cacheDisponibilidad) return null;
    const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const entrada = cacheDisponibilidad.find(e => e.fecha === key);
    return entrada ? entrada.horarios : [];
}

function renderCalendario() {
    const grid = document.getElementById("cal-grid");
    if (!grid) return;

    document.getElementById("cal-mes-nombre").textContent =
        `${MESES[vistaMes]} ${vistaYear}`;
    grid.innerHTML = "";

    const primerDia = new Date(vistaYear, vistaMes, 1).getDay();
    const totalDias = new Date(vistaYear, vistaMes + 1, 0).getDate();
    const hoyNorm = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    for (let i = 0; i < primerDia; i++) {
        const v = document.createElement("div");
        v.className = "cal-dia cal-dia--vacio";
        grid.appendChild(v);
    }

    for (let d = 1; d <= totalDias; d++) {
        const btn = document.createElement("button");
        btn.className = "cal-dia";
        btn.textContent = d;

        const fecha = new Date(vistaYear, vistaMes, d);
        const esPasado = fecha < hoyNorm;
        const esHoy = d === hoy.getDate() && vistaMes === hoy.getMonth() && vistaYear === hoy.getFullYear();
        const esSel = diaSeleccionado?.d === d && diaSeleccionado?.m === vistaMes && diaSeleccionado?.y === vistaYear;
        const horarios = horariosParaFecha(vistaYear, vistaMes, d);
        const sinTurnos = horarios !== null && horarios.length === 0;

        if (esPasado || sinTurnos) { btn.classList.add("cal-dia--pasado"); btn.disabled = true; }
        if (esHoy) btn.classList.add("cal-dia--hoy");
        if (esSel) btn.classList.add("cal-dia--seleccionado");
        if (!esPasado && !sinTurnos) {
            btn.addEventListener("click", () => seleccionarDia(d, vistaMes, vistaYear));
        }
        grid.appendChild(btn);
    }
}

function seleccionarDia(d, m, y) {
    diaSeleccionado = { d, m, y };
    turnoSeleccionado = null;
    fechaHoraSeleccionada = null;

    const resumen = document.getElementById("turno-resumen");
    const btnSig = document.getElementById("siguiente");
    if (resumen) resumen.style.display = "none";
    if (btnSig) btnSig.disabled = true;

    renderCalendario();
    renderHorarios();
}

function renderHorarios() {
    const grid = document.getElementById("horarios-grid");
    const titulo = document.getElementById("horarios-titulo");
    if (!grid || !titulo) return;

    grid.innerHTML = "";

    if (!diaSeleccionado) {
        grid.innerHTML = `<span class="turno-sin-dia">Seleccioná un día para ver los horarios.</span>`;
        titulo.innerHTML = "Horarios disponibles";
        return;
    }

    const { d, m, y } = diaSeleccionado;
    const horarios = horariosParaFecha(y, m, d);
    titulo.innerHTML = `Horarios disponibles <span>— ${d} de ${MESES[m]}</span>`;

    if (!horarios || !horarios.length) {
        grid.innerHTML = `<span class="turno-sin-dia">Sin turnos disponibles para este día.</span>`;
        return;
    }

    horarios.forEach(t => {
        const label = t.slice(0, 5);
        const btn = document.createElement("button");
        btn.className = "turno-hora-btn" + (turnoSeleccionado === t ? " turno-hora-btn--seleccionado" : "");
        btn.textContent = label;
        btn.addEventListener("click", () => {
            turnoSeleccionado = t;
            const { d, m, y } = diaSeleccionado;

            const fecha = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            fechaHoraSeleccionada = `${fecha}T${label}`;

            document.getElementById("turno-resumen-texto").innerHTML =
                `Turno: <strong>${d} de ${MESES[m]} de ${y}</strong> a las <strong>${label} hs</strong>`;
            document.getElementById("turno-resumen").style.display = "flex";
            document.getElementById("siguiente").disabled = false;
            renderHorarios();
        });
        grid.appendChild(btn);
    });
}

async function confirmarTurno() {
    if (!empleadoSeleccionado || !servicioSeleccionado || !fechaHoraSeleccionada) return;

    window.location.href = "../pago-folder/Pago.html";
}