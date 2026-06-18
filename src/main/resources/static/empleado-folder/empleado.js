import {
    API_URL,
    sesionActiva,
    authHeaders,
    checkRes
} from "../recursos/modulos.js";


const user = await sesionActiva();

if (!user) {
    window.location.href = "../login-folder/Login.html";
}

let solicitudes = [];
let turnos = [];
let misSucursales = [];

document
    .getElementById("buscar-solicitud")
    .addEventListener("input", renderSolicitudes);

document
    .getElementById("buscar-turno")
    .addEventListener("input", renderTurnos);

await init();

async function init() {

    await cargarSolicitudes();
    await cargarSucursales();

    document.getElementById("filtro-sucursal-turnos").addEventListener("change", (e) => {
        const id = e.target.value;
        if (id) {
            cargarTurnos(parseInt(id));
        } else {
            turnos = [];
            renderTurnos();
        }
    });

}

async function cargarSucursales() {
    try {
        const res = await fetch(API_URL + `/usuarios/${user.id}`, { headers: authHeaders() });
        await checkRes(res);
        const perfil = await res.json();
        misSucursales = perfil.sucursalesEmpleado || [];
        const sel = document.getElementById("filtro-sucursal-turnos");
        sel.innerHTML = '<option value="">Seleccioná una sucursal</option>';
        misSucursales.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.nombre;
            sel.appendChild(opt);
        });
        if (misSucursales.length === 1) {
            sel.value = misSucursales[0].id;
            const event = new Event("change");
            sel.dispatchEvent(event);
        }
    } catch (e) {
        console.error("Error al cargar sucursales:", e);
    }
}

async function cargarSolicitudes() {

    try {

        const response = await fetch(
            API_URL + `/solicitudes-empleado/recibidas`,
            {
                headers: authHeaders()
            }
        );
        await checkRes(response);

        solicitudes = await response.json();

        renderSolicitudes();

    } catch (error) {

        alert(error);

    }

}

function renderSolicitudes() {

    const container =
        document.getElementById("solicitudes-container");

    const texto =
        document
            .getElementById("buscar-solicitud")
            .value
            .toLowerCase();

    container.innerHTML = "";

    const filtradas = solicitudes.filter(s =>
        (s.nombreSucursal || "")
            .toLowerCase()
            .includes(texto)
    );

    if (filtradas.length === 0) {

        container.innerHTML =
            "<p>No hay solicitudes pendientes.</p>";

        return;
    }

    filtradas.forEach(solicitud => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${solicitud.nombreSucursal}</h3>

            <p>
                Fecha:
                ${solicitud.fechaSolicitud}
            </p>

            <div style="display:flex;gap:10px;">
                <button class="aceptar-btn">
                    Aceptar
                </button>

                <button class="rechazar-btn">
                    Rechazar
                </button>
            </div>
        `;

        card
            .querySelector(".aceptar-btn")
            .addEventListener("click", () =>
                aprobarSolicitud(solicitud.id)
            );

        card
            .querySelector(".rechazar-btn")
            .addEventListener("click", () =>
                rechazarSolicitud(solicitud.id)
            );

        container.appendChild(card);

    });

}

async function aprobarSolicitud(id) {

    try {

        const response = await fetch(
            API_URL + `/solicitudes-empleado/${id}/aprobar`,
            {
                method: "PATCH",
                headers: authHeaders()
            }
        );
        await checkRes(response);

        await cargarSolicitudes();

        alert("Solicitud aceptada");

    } catch {

        alert("No se pudo aceptar la solicitud");

    }

}

async function rechazarSolicitud(id) {

    try {

        const response = await fetch(
            API_URL + `/solicitudes-empleado/${id}/rechazar`,
            {
                method: "PATCH",
                headers: authHeaders()
            }
        );
        await checkRes(response);

        await cargarSolicitudes();

        alert("Solicitud rechazada");

    } catch {

        alert("No se pudo rechazar la solicitud");

    }

}

async function cargarTurnos(sucursalId) {

    try {
        const res = await fetch(
            API_URL + `/turnos/de-sucursal/${sucursalId}/propios?estadoTurno=PENDIENTE`,
            { headers: authHeaders() }
        );
        await checkRes(res);
        turnos = await res.json();
    } catch (e) {
        turnos = [];
    }
    renderTurnos();

}

function renderTurnos() {

    const container =
        document.getElementById("turnos-container");

    const texto =
        document
            .getElementById("buscar-turno")
            .value
            .toLowerCase();

    container.innerHTML = "";

    const filtrados = turnos.filter(t =>
        JSON.stringify(t)
            .toLowerCase()
            .includes(texto)
    );

    if (filtrados.length === 0) {

        container.innerHTML =
            "<p style='color:var(--t3);font-family:var(--mono);font-size:12px;'>No hay turnos para mostrar.</p>";

        return;
    }

    filtrados.forEach(turno => {

        const fecha = new Date(turno.fechaTurno).toLocaleString("es-AR");
        const estadoBadge = {
            PENDIENTE: 'badge--amber',
            REALIZADO: 'badge--green',
            CANCELADO: 'badge--red',
            PAGO_RECHAZADO: 'badge--red'
        }[turno.estadoTurno] || 'badge--blue';

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="flex:1;min-width:0;">
                    <h3 style="font-size:13px;font-weight:500;color:var(--t);margin:0 0 4px;">${turno.nombreServicio}</h3>
                    <p style="font-size:11px;color:var(--t3);font-family:var(--mono);margin:0;">${fecha}</p>
                </div>
                <span class="badge ${estadoBadge}">${turno.estadoTurno}</span>
            </div>
        `;

        container.appendChild(card);

    });

}