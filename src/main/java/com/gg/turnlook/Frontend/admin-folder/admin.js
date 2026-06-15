const usuariosBody = document.getElementById("usuariosBody");
const sucursalesBody = document.getElementById("sucursalesBody");
const serviciosBody = document.getElementById("serviciosBody");

render();

function render() {


    if (!usuariosBody || !sucursalesBody || !serviciosBody) null;

    const usuariosList = buscarUsuarios();
    const sucursalesList = buscarSucursales();
    const serviciosList = buscarServicios();

    usuariosList.forEach(u => {
        usuariosBody.innerHTML = +
            `
            <th>${u.id}</th>
            <th>${u.nombre}</th>
            <th>${u.apellido}</th>
            <th>${u.email}</th>
            <th>${u.rol}</th>
            <th>${u.estado}</th>
            <th>${u.acciones}</th>


    `;
    });


    sucursalesList.forEach(u => {

        sucursalesBody.innerHTML = +
            `
            <th>${u.nombre}</th>
            <th>${u.descripcion}</th>
            <th>${u.duracion}</th>
            <th>${u.precio}</th>
    `;
    }

    );


    serviciosList.forEach(u => {
        serviciosBody.innerHTML = +
            `

            <th>${u.nombre}</th>
            <th>${u.direccion}</th>
            <th>${u.telefono}</th>
            <th>${u.categoria}</th>
            <th>${u.horario}</th>
    `;
    }
    )




}



function buscarUsuarios() {
    try {
        const response = await fetch(`http://localhost:8080/usuarios`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

function buscarSucursales() {
    try {
        const response = await fetch(`http://localhost:8080/sucursales`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

function buscarServicios() {
    try {
        const response = await fetch(`http://localhost:8080/servicios`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }


        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}
