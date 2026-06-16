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
    <div class="funcionalidad-perfil" id="funcionalidadPerfil">
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
            rendferModificar();


        });
        eliminar.addEventListener('click', async () => {


            const rta = await eliminarCuenta();


            if (rta) { alert("Eliminacion Realizada con exito") }
            else { alert("No se pudo eliminar") }

        });



    }
}

function rendferModificar() {
    const infoAccountDiv = document.getElementById("funcionalidadPerfil");

    infoAccountDiv.innerHTML = `
            <div class="input-group mb-1">
    <input type="text"
           class="form-control"
           placeholder="Nombre"
           id="nombre-input"
           minlength="3"
           maxlength="60">
</div>

<div class="input-group mb-1">
    <input type="text"
           class="form-control"
           placeholder="Apellido"
           id="apellido-input"
           minlength="3"
           maxlength="60">
</div>

<div class="input-group mb-1">
    <input type="password"
           class="form-control"
           placeholder="Contraseña"
           id="password-input"
           minlength="8"
           maxlength="67">
</div>

<div class="input-group mb-1">
    <input type="email"
           class="form-control"
           placeholder="Email"
           id="email-input"
           minlength="8"
           maxlength="150">
</div>

<div class="input-group mb-1">
    <input type="url"
           class="form-control"
           placeholder="URL de foto de perfil"
           id="foto-url-input">
</div>
<button id="cancelar">Cancelar</button>
<button id="modificar">Modificar</button>
            `;
}

const cancelar = document.getElementById("cancelar");
const modificar = document.getElementById("modificar");

cancelar.addEventListener('click', () => {

    window.location.href = "../login-folder/Login.html";



});


modificar.addEventListener('click', () => {

    console.log();

    modificarUsuario(usuario.id);

});



async function modificarUsuario(id) {
    try {

        const nombre = document.getElementById("nombre-input").value.trim();
        const apellido = document.getElementById("apellido-input").value.trim();
        const password = document.getElementById("password-input").value.trim();
        const email = document.getElementById("email-input").value.trim();
        const fotoUrl = document.getElementById("foto-url-input").value.trim();

        const body = {};

        if (nombre) body.nombre = nombre;
        if (apellido) body.apellido = apellido;
        if (password) body.password = password;
        if (email) body.email = email;
        if (fotoUrl) body.fotoUrl = fotoUrl;

        const response = await fetch(
            `http://localhost:8080/usuarios/modificar/${id}`,
            {
                headers: authHeaders(),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `Error ${response.status}`);
        }

        alert("Usuario modificado con éxito");

    } catch (error) {
        alert(error.message);
        console.error(error);
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




