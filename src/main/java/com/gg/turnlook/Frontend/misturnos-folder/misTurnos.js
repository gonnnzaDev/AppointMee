import { authHeaders } from "../recursos/modulos";

const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

renderTurnos(user.id);

function renderTurnos(id) {

    const container = document.getElementById("info");

    if (container) {

        const turnosLista = buscarMisTurnos("Pendientes");


        turnosLista.forEach(turnos => {

            container.innerHTML +=
                `

             <div class="turno-misTurnos">
                        <p>${turnos.nombreS}</p>
                        <p>${turnos.fechaT}</p>
            </div>

                `

        });



    }




}

function cargarTurnos() {


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
