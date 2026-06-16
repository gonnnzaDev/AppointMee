import { authHeaders } from "../recursos/modulos.js";

const apiBaseURL = "http://localhost:8080/sucursales";

render();

async function render() {

    const container = document.getElementById("formulario-agregarSucursal");

    if (container) {

        container.innerHTML = `
        <div class="agregarServicio-container">
        <div class="agregarServicio-info">

            <p>Nombre de la sucursal</p>
            <div class="input-group mb-1">
                <input type="text" class="form-control" placeholder="Nombre" id="nombre-input" minlength="4" maxlength="120" required>
            </div>

            <p>Dirección</p>
            <div class="input-group mb-1">
                <input type="text" class="form-control" placeholder="Dirección" id="direccion-input" minlength="10" maxlength="60" required>
            </div>

            <p>Teléfono</p>
            <div class="input-group mb-1">
                <input type="tel" class="form-control" placeholder="Teléfono" id="telefono-input" minlength="8" maxlength="20">
            </div>

            <p>Descripción</p>
            <div class="input-group mb-1">
                <textarea class="form-control" placeholder="Descripción" id="descripcion-input" minlength="10" maxlength="1500" rows="4" required></textarea>
            </div>

            <p>Categoría</p>
            <div class="input-group mb-1">
                <select class="form-control" id="categoria-input" required>
                    <option value="">Seleccioná una categoría</option>
                </select>
            </div>

            <p>Hora de apertura</p>
            <div class="input-group mb-1">
                <input type="time" class="form-control" id="hora-apertura-input" required>
            </div>

            <p>Hora de cierre</p>
            <div class="input-group mb-1">
                <input type="time" class="form-control" id="hora-cierre-input" required>
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

        await cargarCategorias();

        document.getElementById("cancelar").addEventListener("click", () => {
            window.history.back();
        });

        document.getElementById("enviar").addEventListener("click", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre-input").value;
            const direccion = document.getElementById("direccion-input").value;
            const telefono = document.getElementById("telefono-input").value;
            const descripcion = document.getElementById("descripcion-input").value;
            const categoriaId = document.getElementById("categoria-input").value;
            const horaApertura = document.getElementById("hora-apertura-input").value;
            const horaCierre = document.getElementById("hora-cierre-input").value;
            const fotoUrl = document.getElementById("foto-url-input").value;

            postSucursal(nombre, direccion, telefono, descripcion, categoriaId, horaApertura, horaCierre, fotoUrl);
        });
    }
}

async function cargarCategorias() {
    try {
        const response = await fetch("http://localhost:8080/sucursales/categorias", {
            headers: authHeaders()
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const categorias = await response.json();
        const select = document.getElementById("categoria-input");

        categorias.forEach((cat, index) => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });

    } catch (error) {
        alert("Error al cargar categorías: " + error.message);
    }
}

async function postSucursal(nombre, direccion, telefono, descripcion, categoriaId, horaApertura, horaCierre, fotoUrl) {
    const datos = {
        nombre,
        direccion,
        telefono,
        descripcion,
        categoriaId,
        horaApertura,
        horaCierre,
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