import { sesionActiva, authHeaders, cerrarSesion } from "../recursos/modulos.js";


const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

const usuario = await cargarUsuario(user.id);

renderPerfil(usuario);

async function renderPerfil(usuario) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {



        infoAccountDiv.innerHTML = `
        <div class="profile-card">
    <img src="${usuario.fotoPerfil}" alt="">
    <h3>Nombre: ${usuario.nombre}</h3>
    <h3>Apellido: ${usuario.apellido}</h3>
    <h3>Email: ${usuario.email}</h3>
    <h3>Email: ${usuario.id}</h3>
    <h3>Fecha De Creacion: ${usuario.fechaCreacion}</h3>
    <button type="button" id="btn-opciones-perfil">Opciones</button>
    
    </div>
    `;

        const opciones = document.getElementById("btn-opciones-perfil");

        opciones.addEventListener("click", () => {

            renderOpciones(usuario);


        });

    }
}

function renderOpciones(usuario) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        infoAccountDiv.innerHTML = `
    <div class="funcionalidad-perfil-container">
    <div class="funcionalidad-perfil">
    <button id="btn-eliminar-perfil">Eliminar Cuenta</button>
    <button id="btn-editar-perfil">Editar</button>
    <button id="btn-volver-perfil">Volver</button>
    <div id="dependiendo-rol">
    </div>
            </div>
            </div>
    

    `;

        const eliminar = document.getElementById("btn-eliminar-perfil");
        const editar = document.getElementById("btn-editar-perfil");
        const volver = document.getElementById("btn-volver-perfil");
        const containerrol = document.getElementById("dependiendo-rol");

        if (!containerrol) return;
/*
        if(usuario.roles =="xd")
        containerrol.innerHTML = `
        <button id="btn-ejemplo-perfil">Ejemplo</button>
         `;
*/

        volver.addEventListener('click', () => {
            renderPerfil(usuario);

        });


        editar.addEventListener('click', () => {


        });
        eliminar.addEventListener('click', async () => {


            const rta = await eliminarCuenta();


            if (rta) { alert("Eliminacion Realizada con exito") }
            else { alert("No se pudo eliminar") }

        });



    }
}

async function eliminarCuenta() {

    try {

        const response = await fetch(`http://localhost:8080/usuarios/borrar-cuenta`, {
            headers: authHeaders(),
            method: "DELETE"
        });

        if (!response.ok) {
            return false;
        }

        cerrarSesion();
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




