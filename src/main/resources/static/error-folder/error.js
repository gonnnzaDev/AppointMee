
renderError();

function renderError(){

    
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    document.getElementById("error-msg").textContent = msg || "Ocurrió un error desconocido";
    
    const container = document.getElementById("msg-error");
    
    if(container){
        
        container.innerHTML = 
        `
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
                <button type="submit" class="btn-submit" id="btn-guardar-servicio">Guardar Servicio</button>
                <button type="button" class="btn-cancel" onclick="window.history.back()">Cancelar</button>
            </div>
        </form>
    </div>
        `
        
        
    }
}


/* Por ejemplo para ponerlo

function buscarEmpleados() {
    fetch('/api/empleados')
        .then(res => {
            if (res.status === 403) {
                window.location.href = `/error.html?msg=No tenés permisos para ver los empleados`;
            } else if (res.status === 404) {
                window.location.href = `/error.html?msg=No se encontraron empleados`;
            } else if (!res.ok) {
                window.location.href = `/error.html?msg=Error inesperado (código ${res.status})`;
            }
            return res.json();
        })
        .then(empleados => {
            cargarEmpleados(empleados);
        })
        .catch(error => {
            window.location.href = `../error.html?msg=${encodeURIComponent(error.message)}`;
        });
}

*/



