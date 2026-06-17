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

    if (!infoAccountDiv) return;

    infoAccountDiv.innerHTML = `
        <div class="funcionalidad-perfil-container">
            <div class="funcionalidad-perfil" id="funcionalidadPerfil">
                <button id="btn-volver-perfil">Volver</button>
                <div id="dependiendo-rol"></div>
            </div>
        </div>
    `;

console.log(usuario);

    const containerrol = document.getElementById("dependiendo-rol");

    let html = "";

    if (usuario.roles.includes("ADMINISTRADOR")) {
        html += `
            <button id="btn-modo-admin">
                Panel Administrador
            </button>
        `;
    }

    if (usuario.roles.includes("CLIENTE") && !usuario.roles.includes("ADMINISTRADOR") && !usuario.roles.includes("EMPLEADOR") ) {
        html += `
            <button id="btn-eliminar-perfil">
                Eliminar Cuenta
            </button>

            <button id="btn-editar-perfil">
                Editar
            </button>
        `;
    }

    if (usuario.roles.includes("EMPLEADOR")) {
        html += `
            <button id="btn-modo-empleador">
                Panel Empleador
            </button>
        `;
    }

    containerrol.innerHTML = html;

    const volver = document.getElementById("btn-volver-perfil");
    const eliminar = document.getElementById("btn-eliminar-perfil");
    const editar = document.getElementById("btn-editar-perfil");
    const modoEmpleador = document.getElementById("btn-modo-empleador");
    const modoAdmin = document.getElementById("btn-modo-admin");

    volver.addEventListener("click", () => {
        renderPerfil(usuario);
    });

    if (modoEmpleador) {
        modoEmpleador.addEventListener("click", () => {
            window.location.href = "../empleador-folder/empleador.html";
        });
    }

    if (modoAdmin) {
        modoAdmin.addEventListener("click", () => {
            window.location.href = "../admin-folder/admin.html";
        });
    }

    if (editar) {
        editar.addEventListener("click", () => {
            renderModificar(usuario);
        });
    }

    if (eliminar) {
        eliminar.addEventListener("click", async () => {

            const confirmar = confirm(
                "¿Estás seguro de que querés eliminar tu cuenta?"
            );

            if (!confirmar) return;

            const rta = await eliminarCuenta();

            if (rta) {
                alert("Eliminación realizada con éxito");
            } else {
                alert("No se pudo eliminar la cuenta");
            }
        });
    }
}

function renderModificar(usuario) {
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
    <input type="password"
           class="form-control"
           placeholder="Repetir Contraseña "
           id="password-confirm-input"
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
<button id="cancelar">Volver</button>
<button id="modificar">Modificar</button>
            `;


    const cancelar = document.getElementById("cancelar");
    const modificar = document.getElementById("modificar");


    cancelar.addEventListener('click', () => {

        renderOpciones(usuario);

    });


    modificar.addEventListener('click', () => {

        console.log();

        modificarUsuario(usuario.id);

    });


}


async function modificarUsuario(id) {
    try {

        const nombre = document.getElementById("nombre-input").value.trim();
        const apellido = document.getElementById("apellido-input").value.trim();
        const password = document.getElementById("password-input").value.trim();
        const email = document.getElementById("email-input").value.trim();
        const fotoUrl = document.getElementById("foto-url-input").value.trim();
        const password2 = document.getElementById("password-confirm-input").value.trim();

        const body = {};

        if (
            nombre === "" &&
            apellido === "" &&
            email === "" &&
            fotoUrl === "" &&
            password2 === "" &&
            password === ""
        ) {
            alert("Tenes que poner algo en los campos");
            return;
        }

        if (nombre) body.nombre = nombre;
        if (apellido) body.apellido = apellido;
        if (password !== password2) {

            alert("Las contraseñas no son iguales");
            return;
        }
        if (password) body.password = password;
        if (email) body.email = email;
        if (fotoUrl) body.fotoUrl = fotoUrl;

        const response = await fetch(
            `/usuarios/modificar/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
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

        const response = await fetch(`/usuarios/borrar-cuenta`, {
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


        const response = await fetch(`/usuarios/${id}`,
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




