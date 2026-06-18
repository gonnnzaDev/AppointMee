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
                <td>${u.email ?? "-"}</td>
                <td>${u.roles}</td>
                <td>${u.estado ?? "-"}</td>

                <td>

                    <button
                        class="btn btn-primary detalle-usuario"
                        data-id="${u.id}">
                        Detalle
                    </button>

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
                        class="btn btn-info detalle-sucursal"
                        data-id="${s.id}">
                        Detalle
                    </button>

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

async function mostrarDetalleUsuario(id) {

    try {

        const response = await fetch(
            `/usuarios/${id}`,
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo cargar el usuario");
        }

        const usuario = await response.json();

        document.getElementById("usuarioModalBody").innerHTML = `
            <div class="text-center">

                ${usuario.fotoPerfil
                ? `
                            <img
                                src="${usuario.fotoPerfil}"
                                class="img-thumbnail mb-3"
                                style="max-width:200px;">
                        `
                : ""
            }

                <h3>
                    ${usuario.nombre}
                    ${usuario.apellido}
                </h3>

            </div>

            <hr>

            <p><strong>ID:</strong> ${usuario.id}</p>

            <p>
                <strong>Email:</strong>
                ${usuario.email}
            </p>

            <p>
                <strong>Fecha Creación:</strong>
                ${usuario.fechaCreacion}
            </p>

            <p>
                <strong>Roles:</strong>
                ${usuario.roles?.join(", ")
            ?? "Sin roles"
            }
            </p>

            <hr>

            <h5>Sucursales</h5>

            ${usuario.sucursalesEmpleado?.length
                ? `
                        <ul>
                            ${usuario.sucursalesEmpleado.map(s => `
                                <li>
                                    ${s.nombre}
                                </li>
                            `).join("")}
                        </ul>
                    `
                : "<p>No posee sucursales asociadas.</p>"
            }
        `;

        const modal = new bootstrap.Modal(
            document.getElementById("usuarioModal")
        );

        modal.show();

    } catch (error) {

        alert(error.message);
    }
}

document.addEventListener("click", async e => {

    const id = e.target.dataset.id;

    if (!id) return;

    if (e.target.classList.contains("detalle-usuario")) {

        await mostrarDetalleUsuario(id);
        return;
    }

    if (e.target.classList.contains("detalle-sucursal")) {

        window.open(
            `https://appointmee-vcs2.onrender.com/sucursal-folder/Sucursal.html?id=${id}`,
            "_blank"
        );

        return;
    }

    if (e.target.classList.contains("eliminar-usuario")) {

        if (!confirm("¿Eliminar usuario?")) return;

        await fetch(
            `/usuarios/eliminar/${id}`,
            {
                method: "DELETE",
                headers: authHeaders()
            }
        );

        await render();

        return;
    }

    if (e.target.classList.contains("eliminar-sucursal")) {

        if (!confirm("¿Eliminar sucursal?")) return;

        await fetch(
            `/sucursales/eliminar/${id}`,
            {
                method: "DELETE",
                headers: authHeaders()
            }
        );

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
                    tr.textContent
                        .toLowerCase()
                        .includes(texto)
                        ? ""
                        : "none";
            });
    });
}

activarBuscador(
    "buscarUsuario",
    "usuariosBody"
);

activarBuscador(
    "buscarSucursal",
    "sucursalesBody"
);