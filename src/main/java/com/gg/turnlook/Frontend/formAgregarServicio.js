render();

function render() {

    const container = document.getElementById("formulario-agregarServicio");

    if (container) {

        container.innerHTML = `

    <div class="form-simple">
        <h1>Agregar Nuevo Servicio</h1>
        <form id="formAgregarServicio">
            <div class="form-group">
                <label for="nombre">Nombre del Servicio</label>
                <input type="text" id="nombre" name="nombre" required>
            </div>
            <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" required></textarea>
            </div>
            <div class="form-group">
                <label for="precio">Precio</label>
                <input type="number" id="precio" name="precio" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="duracion">Duración</label>
                <input type="number" id="duracion" name="duracion" required>
            </div>
           
            <div class="form-actions">
                <button type="submit" class="btn-submit">Guardar Servicio</button>
                <button type="button" class="btn-cancel" onclick="window.history.back()">Cancelar</button>
            </div>
        </form>
    </div>
`



    }
}