import { authHeaders, sesionActiva } from "../recursos/modulos.js";

const user = await sesionActiva();

renderTurnos();

document.getElementById("estados").addEventListener("change", () => {
    renderTurnos();
});

async function renderTurnos() {

    const container = document.getElementById("info");

    if (!container) return;

    const estadoP = document.getElementById("estados").value;

    const turnosLista = await buscarMisTurnos();

    container.innerHTML=``;

    console.log(estadoP);

    turnosLista.forEach(turno => {
        console.log(turno.estadoTurno);

        if (turno.estadoTurno == estadoP) {
            container.innerHTML += `
            <div class="turno-misTurnos">
                <p>${turno.nombreServicio}</p>
                <p>${turno.fechaTurno}</p>
                <p>${turno.estadoTurno}</p>
                <p>${turno.puntuacion}</p>
            </div>
        `;
        }



    });
}

async function buscarMisTurnos() {
    try {

        const response = await fetch(
            `http://localhost:8080/turnos/propios`,
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