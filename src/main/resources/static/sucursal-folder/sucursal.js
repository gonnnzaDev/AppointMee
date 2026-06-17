import { authHeaders } from "../recursos/modulos.js";



render();

async function render() {
    const container = document.getElementById("container-info-sucursal");
    if (!container) return;

    const sucursalId = getSucursalIdFromUrl();
    if (!sucursalId) return;
    console.log(sucursalId);

    const sucursal = await fetchSucursal(sucursalId);
    if (!sucursal) return;

    container.innerHTML += `
        <article class="turn-article">
            <img src="${sucursal.fotoPerfil || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPQenKJTzexez3E1uN7qtSwZ8tgPQsVJ9DQ&s'}">
            <div class="turn-content">
                <h2>${sucursal.nombre}</h2>
                <p>${sucursal.descripcion}</p>
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
        const response = await fetch(`/sucursales/${id}`, {
            headers: authHeaders()
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        alert(error);
        return null;
    }
}


async function fetchValoracionXSucursal(id) {
    try {
        const response = await fetch(`/sucursales/${id}`, {
            headers: authHeaders()
        });3
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        alert(error);
        return null;
    }
}