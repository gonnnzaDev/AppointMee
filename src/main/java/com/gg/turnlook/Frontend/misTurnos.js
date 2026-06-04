renderTurnos();

function renderTurnos(){

    const container = document.getElementById("turnos-persona-info");
    if(container){

        container.innerHTML = `
         <div class="persona-info">
                <h2>Cancelar</h2>
                <div id="turnos-cancelados">
                  
                </div>
            </div>
            <div class="persona-info">
                <h2>Pendientes</h2>
                <div id="turnos-pendientes">

                </div>
            </div>
            <div class="persona-info">
                <h2>Finalizados</h2>
                <div id="turnos-finalizados">

                </div>

            </div>

`;

    }


}

function cargarTurnos(){

    const cancelados = document.getElementById("turnos-cancelados");
    const pendientes = document.getElementById("turnos-pendientes");
    const finalizados = document.getElementById("turnos-finalizados");

    

}

/*  <div class="turno-misTurnos">
                        <p>Nombre del servicio</p>
                        <p>Fecha</p>
                        
                    </div> */