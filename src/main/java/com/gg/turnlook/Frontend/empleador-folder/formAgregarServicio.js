import { authHeaders } from "../recursos/modulos";

const apiBaseURL = "http://localhost:8080/servicios";

const params = new URLSearchParams(window.location.search);
const sucursalId = parseInt(params.get("sucursalId"));

render();

function render() {

    const container = document.getElementById("formulario-agregarServicio");

    if (container) {

        container.innerHTML = `
        <div class="agregarServicio-container">
        <div class="agregarServicio-info">

            <p>Nombre del servicio</p>
            <div class="input-group mb-1">
                <input type="text" class="form-control" placeholder="Nombre" id="nombre-input" minlength="4" maxlength="60" required>
            </div>

            <p>Descripción</p>
            <div class="input-group mb-1">
                <textarea class="form-control" placeholder="Descripción" id="descripcion-input" minlength="10" maxlength="500" rows="4" required></textarea>
            </div>

            <p>Duración (minutos)</p>
            <div class="input-group mb-1">
                <input type="number" class="form-control" placeholder="Ej: 30" id="duracion-input" min="30" max="360" required>
            </div>

            <p>Precio</p>
            <div class="input-group mb-1">
                <input type="number" class="form-control" placeholder="Ej: 1500.00" id="precio-input" min="0.01" max="999999.99" step="0.01" required>
            </div>

            <p>URL foto de perfil</p>
            <div class="input-group mb-1">
                <input type="url" class="form-control" placeholder="https://..." id="foto-url-input" required>
            </div>

            <div class="agregarServicio-botones">
                <button id="cancelar">Cancelar</button>
                <button id="enviar">Enviar</button>
            </div>

        </div>
        </div>
        `;

        document.getElementById("cancelar").addEventListener("click", () => {
            window.history.back();
        });

        document.getElementById("enviar").addEventListener("click", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre-input").value;
            const descripcion = document.getElementById("descripcion-input").value;
            const duracion = parseInt(document.getElementById("duracion-input").value);
            const precio = parseFloat(document.getElementById("precio-input").value);
            const fotoUrl = document.getElementById("foto-url-input").value;

            postServicio(nombre, descripcion, duracion, precio, sucursalId, fotoUrl);
        });
    }
}

async function postServicio(nombre, descripcion, duracion, precio, sucursalId, fotoUrl) {
    const datos = {
        nombre,
        descripcion,
        duracion,
        precio,
        sucursalId,
        fotoUrl
    };

    try {
        const response = await fetch(apiBaseURL + '/crear', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(datos)
        });

        const data = await response.text();
        alert(data);

        if (response.ok) window.history.back();

    } catch (error) {
        alert("Error al guardar: " + error.message);
    }
}