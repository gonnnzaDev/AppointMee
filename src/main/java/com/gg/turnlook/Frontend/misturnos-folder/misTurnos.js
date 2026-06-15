import { authHeaders } from "../recursos/modulos";

const user = await sesionActiva();

/*
if (!user) {
    window.location.href = "../login.html";
}
*/

renderTurnos(user.id);

function renderTurnos(id) {

    const container = document.getElementById("info");

    if (container) {


        const estadoP = document.getElementById("estado").value;

        const turnosLista = buscarMisTurnos();

        turnosLista.forEach(turno => {

            if (turno.estado === estadoP) {

                container.innerHTML +=
                    `

             <div class="turno-misTurnos">
                        <p>${turno.nombreS}</p>
                        <p>${turno.fechaT}</p>
            </div>

                `

            }
        });



    }




}

function buscarMisTurnos() {
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
