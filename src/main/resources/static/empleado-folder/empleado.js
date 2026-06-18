import {
    sesionActiva,
    authHeaders
} from "../recursos/modulos.js";


const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

let solicitudes = [];
let turnos = [];

document
    .getElementById("buscar-solicitud")
    .addEventListener("input", renderSolicitudes);

document
    .getElementById("buscar-turno")
    .addEventListener("input", renderTurnos);

await init();

async function init() {

    await cargarSolicitudes();
    await cargarTurnos();

}

async function cargarSolicitudes() {

    try {

        const response = await fetch(
            `/solicitudes-empleado/recibidas`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error("Error cargando solicitudes");
        }

        solicitudes = await response.json();

        renderSolicitudes();

    } catch (error) {

        console.error(error);

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
            `/solicitudes-empleado/${id}/aprobar`,
            {
                method: "PATCH",
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        await cargarSolicitudes();

        alert("Solicitud aceptada");

    } catch {

        alert("No se pudo aceptar la solicitud");

    }

}

async function rechazarSolicitud(id) {

    try {

        const response = await fetch(
            `/solicitudes-empleado/${id}/rechazar`,
            {
                method: "PATCH",
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error();
        }

        await cargarSolicitudes();

        alert("Solicitud rechazada");

    } catch {

        alert("No se pudo rechazar la solicitud");

    }

}

async function cargarTurnos() {

    try {


        turnos = [];

        renderTurnos();

    } catch (error) {

        console.error(error);

    }

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
            "<p>No hay turnos para mostrar.</p>";

        return;
    }

    filtrados.forEach(turno => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${turno.servicio}</h3>

            <p>
                Cliente:
                ${turno.cliente}
            </p>

            <p>
                Fecha:
                ${turno.fecha}
            </p>

            <p>
                Estado:
                ${turno.estado}
            </p>
        `;

        container.appendChild(card);

    });

}