import { authHeaders, sesionActiva } from "../recursos/modulos.js";

const user = await sesionActiva();



if (!user) {
    window.location.href = "../login.html";
}

renderTurnos();

document.getElementById("estados").addEventListener("change", () => {
    renderTurnos();
});

async function renderTurnos() {
    const container = document.getElementById("info");
    if (!container) return;

    const estadoP = document.getElementById("estados").value;
    const turnosLista = await buscarMisTurnos();

    container.innerHTML = ``;

    turnosLista.forEach(turno => {
        const idActual = turno.id || turno.idTurno;

        if (turno.estadoTurno == estadoP) {
            container.innerHTML += `
            <div class="turno-misTurnos">
                <p><strong>${turno.nombreServicio}</strong></p>
                <p>${turno.fechaTurno}</p>
                <p><span class="badge ${obtenerClaseBadge(turno.estadoTurno)}">${turno.estadoTurno}</span></p>
                <p>⭐ ${turno.puntuacion || 'Sin calificar'}</p>
                <button class="btn-submit btn-ver-detalle" data-id="${idActual}">Ver Detalle</button>
            </div>
        `;
        }
    });

    container.querySelectorAll(".btn-ver-detalle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            window.location.href = `./detalleTurno/detalle.html?id=${id}`;
        });
    });
}

function obtenerClaseBadge(estado) {
    if (estado === 'CANCELADO') return 'badge--amber';
    if (estado === 'PENDIENTE') return 'badge--red';
    if (estado === 'CONFIRMADO') return 'badge--blue';
    if (estado === 'REALIZADO') return 'badge--green';
    return 'badge--cyan';
}


async function buscarMisTurnos() {
    try {

        const response = await fetch(
            `/turnos/propios`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        alert(error.message);
        return [];
    }
}