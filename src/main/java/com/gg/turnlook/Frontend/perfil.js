import { sesionActiva } from "./recursos/modulos.js";

// const user = sesionActiva();
//console.log(user);
//renderPerfil(user.id);
renderPerfil(12);


async function renderPerfil(id) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        const usuario = await cargarUsuario(id);

        infoAccountDiv.innerHTML = `    
    <div class="profile-card">
    
    
    <img src="https://i.pinimg.com/236x/63/25/10/632510e53b3ae17f36993d7993c9fe8f.jpg" alt="">
    <h3>Nombre: ${usuario.nombre}</h3>
    <h3>Apellido: ${usuario.apellido}</h3>
    <h3>Email: ${usuario.email}</h3>
    <h3>Fecha De Creacion: ${usuario.fechaCreacion}</h3>
    <button type="button" class="btn btn-danger">Eliminar</button>
    
    </div>
    `;
    }
}

async function cargarUsuario(id) {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/${id}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        alert(error.message);
        return null;
    }
}



