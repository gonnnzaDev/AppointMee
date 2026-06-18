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
    const sucursal = await fetchSucursal(sucursalId);
    if (!sucursal) return;

    const empleadosHtml = sucursal.empleados && sucursal.empleados.length
        ? `<ul class="empleados-lista">${sucursal.empleados.map(e => `<li>${e.nombre}</li>`).join("")}</ul>`
        : "<p class='sin-datos'>Sin empleados registrados</p>";

    container.innerHTML = `
        <div class="principal-imagen-sucursal">
            <img src="${sucursal.fotoPerfil || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPQenKJTzexez3E1uN7qtSwZ8tgPQsVJ9DQ&s'}" alt="${sucursal.nombre}">
        </div>

        <div class="info-sucursal">
            <h3>${sucursal.nombre}</h3>

            <p class="descripcion-sucursal">${sucursal.descripcion}</p>

            <div class="detalle-grid">
                <div class="detalle-item">
                    <span class="detalle-label">Dirección</span>
                    <span class="detalle-value">${sucursal.direccion}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Teléfono</span>
                    <span class="detalle-value">${sucursal.telefono}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Categoría</span>
                    <span class="detalle-value">${sucursal.categoria}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Horario</span>
                    <span class="detalle-value">${sucursal.horaApertura} — ${sucursal.horaCierre}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Puntuación</span>
                    <span class="detalle-value">${sucursal.puntuacion ?? "—"} (${sucursal.cantidadPuntuaciones ?? 0})</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Empleador</span>
                    <span class="detalle-value">${sucursal.empleador?.nombre ?? "No asignado"}</span>
                </div>
                <div class="detalle-item">
                    <span class="detalle-label">Creación</span>
                    <span class="detalle-value">${sucursal.fechaCreacion}</span>
                </div>
                <div class="detalle-item detalle-item--full">
                    <span class="detalle-label">Empleados</span>
                    ${empleadosHtml}
                </div>
            </div>
        </div>

        <div class="botones-sucursal">
            <button class="btn-secondary" id="btn-volver">Volver</button>
            <button class="btn-primary" id="btn-reservar">Reservar turno</button>
        </div>
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


