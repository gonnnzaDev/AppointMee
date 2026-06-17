import { authHeaders } from "../recursos/modulos.js";

const usuariosBody = document.getElementById("usuariosBody");
const sucursalesBody = document.getElementById("sucursalesBody");
const serviciosBody = document.getElementById("serviciosBody");

render();

async function render() {
    if (!usuariosBody || !sucursalesBody || !serviciosBody) return;

    const [usuariosList, sucursalesList, serviciosList] = await Promise.all([
        buscarUsuarios(),
        buscarSucursales(),
        buscarServicios()
    ]);

    let usuariosHTML = "";
    usuariosList.forEach(u => {
        usuariosHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>${u.acciones || ''}</td>
            </tr>`;
    });
    usuariosBody.innerHTML = usuariosHTML;

    let sucursalesHTML = "";
    sucursalesList.forEach(s => {
        sucursalesHTML += `
            <tr>
                <td>${s.nombre}</td>
                <td>${s.categoria}</td>
                <td>${s.puntuacion}</td>
                <td>${s.cantidadPuntuaciones}</td>
                <td><button id="eliminar" data-id="${s.id}">Eliminar</button>  </td>
            </tr>`;
    });
    sucursalesBody.innerHTML = sucursalesHTML;

    let serviciosHTML = "";
    serviciosList.forEach(ser => {
        serviciosHTML += `
            <tr>
                <td>${ser.nombre}</td>
                <td>${ser.descripcion}</td>
                <td>${ser.duracion}</td>
                <td>${ser.precio}</td>
            </tr>`;
    });
    serviciosBody.innerHTML = serviciosHTML;
}

async function buscarUsuarios() {
    try {
        const response = await fetch("/usuarios/listar", { headers: authHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

async function buscarSucursales() {
    try {
        const response = await fetch("/sucursales/listar", { headers: authHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

async function buscarServicios() {
    try {
        const response = await fetch("/servicios/listar", { headers: authHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}
