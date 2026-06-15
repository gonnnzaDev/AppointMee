render();

function render() {


    const container = document.getElementById("info");

    if (container) {
        container.innerHTML =

            `  <div class="configuracion-titulo" >   
        <h1>Configuracion</h1>
            </div>

            <div class="seccion-configuracion">
                <h2>¿Sos Empleador?</h2>

                <p>¿Sos empleador y todavia no tenes tu Cuenta de Empleador?
                </p>
                <p>Llena este
                    <a href="../formularioempleador-folder/FormularioEmpleador.html">
                        Formulario
                    </a>
                </p>
            </div>

            <div class="seccion-configuracion">

                <h2>Ayuda</h2>
                <p>¿Tuviste algun problema?
                    <a href="mailto:gonnnzaDev@gmail.com">Contactate</a>
                </p>


            </div>
            <div class="seccion-configuracion">

                <h2>Documentacion</h2>
                <p>Deseas ver la documentacion del proyecto?
                    <a href="../creditos-folder/Creditos.html">
                        Documentacion
                    </a>
                </p>
            </div>

              <div class="seccion-configuracion">

                <h2>Perdiste Tu Cuenta?</h2>
                <p>Rellena este formulario para hacer el reclamo
                    <a href="../creditos-folder/Creditos.html">
                        Formulario
                    </a>
                </p>
            </div>
            

            <div class="configuracion-botones">
                <button>Cerrar Sesion</button>
            </div>`;
    }




}