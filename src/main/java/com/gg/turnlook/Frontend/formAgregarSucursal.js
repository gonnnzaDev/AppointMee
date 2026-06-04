render();

function render(){

    const container = document.getElementById("formulario-agregarSucursal");
    
    if(container){
        
        container.innerHTML = `
        
        <div class="form-simple">
        <h1>Agregar Nueva Sucursal</h1>
        <form id="formAgregarSucursal">
        <div class="form-group">
        <label for="nombre">Nombre de Sucursal</label>
        <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
        <label for="direccion">Dirección</label>
        <input type="text" id="direccion" name="direccion" required>
        </div>
        <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono" required>
        </div>
        <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion"></textarea>
        </div>
        <div class="form-group">
        <label for="cvu">CVU</label>
        <input type="text" id="cvu" name="cvu" required>
        <div class="form-group">
        <label for="categoria">Categoría</label>
        <select id="categoria" name="categoria" required>
        <option value="">Seleccione una categoría</option>
        </select>
        </div>
        <div class="form-group">
        <label for="horaApertura">Hora de apertura</label>
        <input type="time" id="horaApertura" name="horaApertura" required>
        </div>
        
        <div class="form-group">
        <label for="horaCierre">Hora de Cierre</label>
        <input type="time" id="horaCierre" name="horaCierre" required>
        </div>
        
        <div class="form-actions">
        <button type="submit" class="btn-submit">Guardar Sucursal</button>
        <button type="button" class="btn-cancel" onclick="window.history.back()">Cancelar</button>
        </div>
        </form>
        </div>
        `;
        
        
    }
}