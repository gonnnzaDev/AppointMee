import { sesionActiva, authHeaders } from "../recursos/modulos.js";


const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

renderPerfil(user.id);

//CAMBIAR EL RENDER DE ABAJO TAMBIEN!!!

async function renderPerfil(id) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        const usuario = await cargarUsuario(id);

        console.log(usuario);

        infoAccountDiv.innerHTML = `
        <div class="profile-card">
    <img src="${usuario.fotoPerfil}" alt="">
    <h3>Nombre: ${usuario.nombre}</h3>
    <h3>Apellido: ${usuario.apellido}</h3>
    <h3>Email: ${usuario.email}</h3>
    <h3>Fecha De Creacion: ${usuario.fechaCreacion}</h3>
    <button type="button" id="btn-opciones-perfil">Opciones</button>
    
    </div>
    `;

        const opciones = document.getElementById("btn-opciones-perfil");

        opciones.addEventListener("click", () => {

            renderOpciones(id);


        });

    }
}

function renderOpciones(id) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        infoAccountDiv.innerHTML = `
    <div class="funcionalidad-perfil-container">
    <div class="funcionalidad-perfil">
    <button id="btn-eliminar-perfil">Eliminar Cuenta</button>
    <button id="btn-editar-perfil">Editar</button>
    <button id="btn-volver-perfil">Volver</button>
            </div>
            </div>
    

    `;

        const eliminar = document.getElementById("btn-eliminar-perfil");
        const editar = document.getElementById("btn-editar-perfil");
        const volver = document.getElementById("btn-volver-perfil");


        volver.addEventListener('click', () => {
            renderPerfil(id);

        });


        editar.addEventListener('click', () => {


        });
        eliminar.addEventListener('click', async () => {


            const rta = await eliminarCuenta(id);


            if (rta) { alert("Eliminacion Realizada con exito") }
            else { alert("No se pudo eliminar") }

        });



    }
}

async function eliminarCuenta(id) {

    try {

        const response = await fetch(`http://localhost:8080/usuarios/borrar-cuenta/${id}`,
            {
                headers: authHeaders(),
                method: "DELETE"
            }
        );

        if (!response.ok) {
            return false;
        }

        return true;

    } catch (error) {
        return false;
    }

}




async function cargarUsuario(id) {
    try {


        const response = await fetch(`http://localhost:8080/usuarios/${id}`,
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
        return null;
    }
}




