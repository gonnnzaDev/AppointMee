import { API_URL, authHeaders, sesionActiva, checkRes } from "../recursos/modulos.js";

const user = await sesionActiva();

if (!user) {
    window.location.href = "../login-folder/Login.html";
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

    if (turnosLista.length === 0) {
        container.innerHTML = `<p style="color:var(--t3);font-family:var(--mono);text-align:center;padding:32px 0;">No tenés turnos registrados.</p>`;
        return;
    }

    const filtrados = turnosLista.filter(t => t.estadoTurno === estadoP);

    if (filtrados.length === 0) {
        container.innerHTML = `<p style="color:var(--t3);font-family:var(--mono);text-align:center;padding:32px 0;">No hay turnos con estado "${estadoP}".</p>`;
        return;
    }

    filtrados.forEach(turno => {
        const idActual = turno.id;

        const fecha = new Date(turno.fechaTurno);
        const fechaFormateada = isNaN(fecha.getTime())
            ? turno.fechaTurno
            : fecha.toLocaleString("es-AR");

        container.innerHTML += `
            <div class="turno-misTurnos">
                <p><strong>${turno.nombreServicio}</strong></p>
                <p>${fechaFormateada}</p>
                <p><span class="badge ${obtenerClaseBadge(turno.estadoTurno)}">${turno.estadoTurno}</span></p>
                <p>🐝 ${turno.puntuacion != null ? turno.puntuacion : 'Sin calificar'}</p>
                <button class="btn-submit btn-ver-detalle" data-id="${idActual}">Ver Detalle</button>
            </div>
        `;
    });

    container.querySelectorAll(".btn-ver-detalle").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            window.location.href = `../detalle-mis-turnos-folder/detalleMisTurnos.html?id=${id}`;
        });
    });
}

function obtenerClaseBadge(estado) {
    if (estado === 'CANCELADO') return 'badge--red';
    if (estado === 'PENDIENTE') return 'badge--yellow';
    if (estado === 'REALIZADO') return 'badge--green';
    return 'badge--cyan';
}


async function buscarMisTurnos() {
    try {
        const response = await fetch(
            API_URL + `/turnos/propios`,
            { headers: authHeaders() }
        );
        await checkRes(response);
        return await response.json();
    } catch (error) {
        console.error("Error al buscar turnos:", error);
        return [];
    }
}