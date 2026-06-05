const apiBaseURL = "http://localhost:8080/servicios";

const params = new URLSearchParams(window.location.search);
const sucursalId = params.get("sucursalId");

// render();

function render() {

    const container = document.getElementById("formulario-agregarServicio");

    if (container) {

        container.innerHTML = `

   
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





function postSucursal(nombre, descripcion, duracion, precio, sucursalId) {

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