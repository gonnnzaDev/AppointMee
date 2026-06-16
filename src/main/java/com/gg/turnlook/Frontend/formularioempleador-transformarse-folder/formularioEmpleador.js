import { authHeaders } from "../recursos/modulos.js";


render();

function render() {

    const container = document.getElementById("info");
    container.innerHTML =
        ` <h1>Empleador...</h1>
            <p>Ingresá tu información y, una vez que validemos tus datos, te registraremos en el sistema como empleador.
            </p>

            <div class="input-group mb-1">
                <textarea class="form-control" placeholder="Mensaje" id="mensaje"></textarea>
            </div>
            <div class="formulario-transformar-empleador-botones">

            <button id="volver">Volver</button>
                <button id="enviar">Enviar</button>
            </div>`;
    const enviar = document.getElementById("enviar");
    const volver = document.getElementById("volver");

    enviar.addEventListener('click', () => {

        const mensaje = document.getElementById("mensaje").value;

        if (!mensaje.lenght < 50) {
            alert("Tiene que superar los 50 caracteres");
        } else {

            postMensaje(mensaje);

        }

    });


    volver.addEventListener('click', () => {

        window.history.back();

    });
}

async function postMensaje(mensaje) {


    try {
        const response = await fetch(``, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(mensaje)
        });

        const data = await response.text();

        if (response.ok) alert("enviado con exito");

    } catch (error) {
        alert("Error al enviar: " + error.message);
    }




}