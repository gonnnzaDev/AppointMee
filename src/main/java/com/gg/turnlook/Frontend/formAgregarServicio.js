const apiBaseURL = "http://localhost:8080/servicios";

const params = new URLSearchParams(window.location.search);
const sucursalId = params.get("sucursalId");

console.log(sucursalId);
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
                <button type="submit" class="btn-submit" id="btn-guardar-servicio">Guardar Servicio</button>
                <button type="button" class="btn-cancel" onclick="window.history.back()">Cancelar</button>
            </div>
        </form>
    </div>
`

        const btn = document.getElementById("btn-guardar-servicio");

        btn.addEventListener("click", (e) => {
            e.preventDefault();



            let nombre = document.getElementById("nombre").value;
            let descripcion = document.getElementById("descripcion").value;
            let duracion = document.getElementById("duracion").value;
            let precio = document.getElementById("precio").value;


            postServicio(nombre, descripcion, duracion, precio, sucursalId);
        }

        )

    }
}





function postServicio(nombre, descripcion, duracion, precio, sucursalId) {

    const datos = {
        nombre: nombre,
        descripcion: descripcion,
        duracion: duracion,
        precio: precio,
        sucursalId: sucursalId
    };

    fetch(apiBaseURL + '/crear',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => alert(`Error al guardar: ${error.message}`));




}

/*    @PostMapping("/crear")
    public ResponseEntity<?> crearServicio(@Valid @RequestBody ServicioCrearDTO servicio,
                                           HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        if (!sucursalService.enSucursal(sesionService.getUsuarioId(sesion), servicio.getSucursalId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        servicioService.crearServicio(servicio);
        return ResponseEntity.ok().body("Se creo el servicio");
    }
 */