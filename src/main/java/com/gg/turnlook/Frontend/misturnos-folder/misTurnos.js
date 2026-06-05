renderTurnos();

function renderTurnos() {

    const container = document.getElementById("turnos-persona-info");
    if (container) {

        container.innerHTML = `
        <div class="filtrar">

                         <label for="estados">Estado:</label>
            
             <select name="estados" id="estados">
               <option value="pendientes">Pendientes</option>
               <option value="confirmados">Confirmados</option>
               <option value="finalizados">Finalizados</option>
             </select>

        </div>
         <div class="persona-info">

             <div class="turno-misTurnos">
                        <p>Nombre del servicio</p>
                        <p>Fecha</p>
                        
                    </div>

            </div>

`;

    }


}

function cargarTurnos() {

    const cancelados = document.getElementById("turnos-cancelados");
    const pendientes = document.getElementById("turnos-pendientes");
    const finalizados = document.getElementById("turnos-finalizados");






}

/*  <div class="turno-misTurnos">
                        <p>Nombre del servicio</p>
                        <p>Fecha</p>
                        
                    </div> */