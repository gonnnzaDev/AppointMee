import { authHeaders, sesionActiva } from "../recursos/modulos.js";

const usuariosBody = document.getElementById("usuariosBody");
const sucursalesBody = document.getElementById("sucursalesBody");

const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

await render();

async function render() {

    const [usuarios, sucursales] = await Promise.all([
        buscarUsuarios(),
        buscarSucursales()
    ]);

    renderUsuarios(usuarios);
    renderSucursales(sucursales);

}

function renderUsuarios(lista) {

    usuariosBody.innerHTML = "";

    lista.forEach(u => {

        usuariosBody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td>${u.estado}</td>
                <td>
                    <button
                        class="btn btn-danger eliminar-usuario"
                        data-id="${u.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

}

function renderSucursales(lista) {

    sucursalesBody.innerHTML = "";

    lista.forEach(s => {

        sucursalesBody.innerHTML += `
            <tr>
                <td>${s.nombre}</td>
                <td>${s.categoria}</td>
                <td>${s.puntuacion}</td>
                <td>${s.cantidadPuntuaciones}</td>
                <td>
                    <button
                        class="btn btn-danger eliminar-sucursal"
                        data-id="${s.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

}

async function buscarUsuarios() {

    try {

        const response = await fetch(
            "/usuarios/listar",
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) return [];

        return await response.json();

    } catch {

        return [];

    }

}

async function buscarSucursales() {

    try {

        const response = await fetch(
            "/sucursales/listar",
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) return [];

        return await response.json();

    } catch {

        return [];

    }

}

document.addEventListener("click", async e => {

    const id = e.target.dataset.id;

    if (!id) return;

    if (e.target.classList.contains("eliminar-usuario")) {

        if (!confirm("¿Eliminar usuario?")) return;

        await fetch(`/usuarios/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        });

        await render();
    }

    if (e.target.classList.contains("eliminar-sucursal")) {

        if (!confirm("¿Eliminar sucursal?")) return;

        await fetch(`/sucursales/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        });

        await render();
    }

});

function activarBuscador(inputId, tbodyId) {

    const input = document.getElementById(inputId);

    input.addEventListener("input", () => {

        const texto = input.value.toLowerCase();

        document
            .querySelectorAll(`#${tbodyId} tr`)
            .forEach(tr => {

                tr.style.display =
                    tr.textContent.toLowerCase().includes(texto)
                        ? ""
                        : "none";
            });

    });

}

activarBuscador("buscarUsuario", "usuariosBody");
activarBuscador("buscarSucursal", "sucursalesBody");