import { authHeaders } from "../recursos/modulos.js";

const user = await sesionActiva();

renderTurnos();

function renderTurnos() {

    const container = document.getElementById("info");

    if (container) {


        const estadoP = document.getElementById("estado").value;

        const turnosLista = buscarMisTurnos(estadoP);

        turnosLista.forEach(turno => {


                container.innerHTML +=
                    `

             <div class="turno-misTurnos">
                        <p>${turno.nombreS}</p>
                        <p>${turno.fechaT}</p>
            </div>

                `

        });



    }




}

function buscarMisTurnos(estadoTurno) {
    try {
        const response = await fetch(`http://localhost:8080/turnos/propios/${estadoTurno}`,
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
