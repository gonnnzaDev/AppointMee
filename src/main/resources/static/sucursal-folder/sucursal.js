import { API_URL, authHeaders, sesionActiva, checkRes } from "../recursos/modulos.js";
const user = await sesionActiva();
if (!user) {
    window.location.href = "../login-folder/Login.html";
}
render();

async function render() {
    const container = document.getElementById("container-info-sucursal");
    if (!container) return;
    const sucursalId = getSucursalIdFromUrl();
    if (!sucursalId) return;
    console.log(sucursalId);
    const sucursal = await fetchSucursal(sucursalId);
    if (!sucursal) return;

    const empleadosHtml = sucursal.empleados && sucursal.empleados.length
        ? sucursal.empleados.map(e => `<li>${e.nombre}</li>`).join("")
        : "<li>Sin empleados registrados</li>";

    container.innerHTML += `
        <article class="turn-article">
            <img src="${sucursal.fotoPerfil || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPQenKJTzexez3E1uN7qtSwZ8tgPQsVJ9DQ&s'}">
            <div class="turn-content">
                <h2>${sucursal.nombre}</h2>
                <p>${sucursal.descripcion}</p>
                <p><strong>Dirección:</strong> ${sucursal.direccion}</p>
                <p><strong>Teléfono:</strong> ${sucursal.telefono}</p>
                <p><strong>Categoría:</strong> ${sucursal.categoria}</p>
                <p><strong>Fecha de creación:</strong> ${sucursal.fechaCreacion}</p>
                <p><strong>Horario:</strong> ${sucursal.horaApertura} a ${sucursal.horaCierre}</p>
                <p><strong>Puntuación:</strong> ${sucursal.puntuacion ?? "Sin puntuación"} (${sucursal.cantidadPuntuaciones ?? 0} valoraciones)</p>
                <p><strong>Empleador:</strong> ${sucursal.empleador?.nombre ?? "No asignado"}</p>
                <div>
                    <strong>Empleados:</strong>
                    <ul>${empleadosHtml}</ul>
                </div>
            </div>
        </article>
        <button id="btn-volver">Volver</button>
        <button id="btn-reservar">Reservar turno</button>
    `;
    document.getElementById("btn-volver")
        .addEventListener("click", () => window.history.back());
    document.getElementById("btn-reservar")
        .addEventListener("click", () => {
            window.location.href = `../turnos-folder/Turnos.html?sucursalId=${sucursalId}`;
        });
}
function getSucursalIdFromUrl() {
    const queryId = new URLSearchParams(window.location.search).get('id');
    if (queryId) {
        return queryId;
    }

    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart && !Number.isNaN(Number(lastPart)) ? lastPart : null;
}

async function fetchSucursal(id) {
    try {
        const response = await fetch(API_URL + `/sucursales/${id}`, {
            headers: authHeaders()
        });
        await checkRes(response);
        return await response.json();
    } catch (error) {
        alert(error);
        return null;
    }
}


