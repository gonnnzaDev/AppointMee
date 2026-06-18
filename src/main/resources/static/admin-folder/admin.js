import { authHeaders, sesionActiva } from "../recursos/modulos.js";

const usuariosBody = document.getElementById("usuariosBody");
const sucursalesBody = document.getElementById("sucursalesBody");
const serviciosBody = document.getElementById("serviciosBody");

const user = await sesionActiva();

if (!user) {
    window.location.href = "../login.html";
}

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
                <td>
                    <button class="btn btn-sm btn-info btn-detalle-usuario" data-id="${u.id}">
                        Detalle
                    </button>
                </td>
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
                <td>
                    <button class="btn btn-sm btn-primary btn-detalle-sucursal" data-id="${s.id}">
                        Detalle
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar-sucursal ms-1" data-id="${s.id}">
                        Eliminar
                    </button>
                </td>
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

    registrarEventos();
}


function registrarEventos() {
    usuariosBody.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-detalle-usuario");
        if (!btn) return;
        const userId = btn.dataset.id;
        await abrirModalUsuario(userId);
    });

    sucursalesBody.addEventListener("click", (e) => {
        const btnDetalle = e.target.closest(".btn-detalle-sucursal");
        if (btnDetalle) {
            const sucursalId = btnDetalle.dataset.id;
            window.open(
                `https://appointmee-vcs2.onrender.com/sucursal-folder/Sucursal.html?id=${sucursalId}`,
                "_blank"
            );
            return;
        }

        const btnEliminar = e.target.closest(".btn-eliminar-sucursal");
        if (btnEliminar) {
            const sucursalId = btnEliminar.dataset.id;
            eliminarSucursal(sucursalId);
        }
    });
}


async function abrirModalUsuario(userId) {
    const modalEl = document.getElementById("modalDetalleUsuario");
    const modalBody = document.getElementById("modalDetalleUsuarioBody");
    const modal = new bootstrap.Modal(modalEl);

    modalBody.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>`;
    modal.show();

    const perfil = await buscarPerfilUsuario(userId);
    if (!perfil) {
        modalBody.innerHTML = `<div class="alert alert-danger">No se pudo cargar la información del usuario.</div>`;
        return;
    }

    const roles = perfil.roles ? [...perfil.roles] : [];
    const esEmpleador = roles.includes("EMPLEADOR");
    const esCliente = roles.includes("CLIENTE");
    const esEmpleado = roles.includes("EMPLEADO");
    const esAdministrador = roles.includes("ADMINISTRADOR");

    const fotoPerfil = perfil.fotoPerfil
        ? `<img src="${perfil.fotoPerfil}" alt="Foto de perfil" class="rounded-circle mb-3" style="width:90px;height:90px;object-fit:cover;">`
        : `<div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mb-3 mx-auto" style="width:90px;height:90px;font-size:2rem;">
               ${(perfil.nombre || "?")[0].toUpperCase()}
           </div>`;

    const coloresRol = {
        ADMINISTRADOR: "danger",
        EMPLEADOR: "primary",
        EMPLEADO: "success",
        CLIENTE: "warning"
    };
    const rolesHTML = roles.map(r =>
        `<span class="badge bg-${coloresRol[r] || "secondary"} me-1">${r}</span>`
    ).join("");

    let sucursalesSection = "";
    if (perfil.sucursalesEmpleado && perfil.sucursalesEmpleado.length > 0) {
        const sucursalesItems = perfil.sucursalesEmpleado.map(s => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${s.nombre}</strong>
                    <span class="text-muted ms-2">${s.categoria || ""}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-warning text-dark">⭐ ${s.puntuacion ?? "-"} (${s.cantidadPuntuaciones ?? 0})</span>
                    <a href="https://appointmee-vcs2.onrender.com/sucursal-folder/Sucursal.html?id=${s.id}"
                       target="_blank" class="btn btn-sm btn-outline-primary">Ver</a>
                </div>
            </li>`).join("");
        sucursalesSection = `
            <hr>
            <h6 class="fw-bold">Sucursales asociadas</h6>
            <ul class="list-group list-group-flush">${sucursalesItems}</ul>`;
    }

    let seccionExtra = "";
    if (esEmpleador) {
        seccionExtra = `
            <div class="alert alert-primary mt-3 mb-0">
                <strong>Empleador:</strong> Este usuario es dueño/gestor de sucursales.
                Puede crear sucursales, administrar empleados y gestionar turnos.
            </div>`;
    }
    if (esCliente) {
        seccionExtra += `
            <div class="alert alert-warning mt-3 mb-0">
                <strong>Cliente:</strong> Este usuario puede reservar turnos en cualquier sucursal.
            </div>`;
    }
    if (esEmpleado) {
        seccionExtra += `
            <div class="alert alert-success mt-3 mb-0">
                <strong>Empleado:</strong> Este usuario trabaja en una o más sucursales.
            </div>`;
    }
    if (esAdministrador) {
        seccionExtra += `
            <div class="alert alert-danger mt-3 mb-0">
                <strong>Administrador:</strong> Tiene acceso completo al panel de administración.
            </div>`;
    }

    modalBody.innerHTML = `
        <div class="text-center">${fotoPerfil}</div>
        <div class="row g-3">
            <div class="col-12 text-center">${rolesHTML}</div>

            <div class="col-md-6">
                <label class="form-label text-muted small mb-0">ID</label>
                <div class="fw-semibold">${perfil.id}</div>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Fecha de creación</label>
                <div class="fw-semibold">${perfil.fechaCreacion ?? "-"}</div>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Nombre</label>
                <div class="fw-semibold">${perfil.nombre ?? "-"}</div>
            </div>
            <div class="col-md-6">
                <label class="form-label text-muted small mb-0">Apellido</label>
                <div class="fw-semibold">${perfil.apellido ?? "-"}</div>
            </div>
            <div class="col-12">
                <label class="form-label text-muted small mb-0">Email</label>
                <div class="fw-semibold">${perfil.email ?? "-"}</div>
            </div>
        </div>

        ${seccionExtra}
        ${sucursalesSection}
    `;
}


async function buscarPerfilUsuario(userId) {
    try {
        const response = await fetch(`/usuarios/${userId}`, { headers: authHeaders() });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al cargar perfil de usuario:", error);
        return null;
    }
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

async function eliminarSucursal(sucursalId) {
    if (!confirm(`¿Seguro que querés eliminar la sucursal #${sucursalId}?`)) return;
    try {
        const response = await fetch(`/sucursales/eliminar/${sucursalId}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        alert("Sucursal eliminada correctamente.");
        render();
    } catch (error) {
        alert("Error al eliminar la sucursal: " + error.message);
    }
}