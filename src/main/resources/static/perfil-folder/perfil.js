import { API_URL, sesionActiva, authHeaders, cerrarSesion, checkRes } from "../recursos/modulos.js";


const user = await sesionActiva();

if (!user) {
    window.location.href = "../login-folder/Login.html";
}

const usuario = await cargarUsuario(user.id);

if (!usuario) {
    window.location.href = "../login-folder/Login.html";
} else {
    const params = new URLSearchParams(window.location.search);
    if (params.has("solicitudes")) {
        if (usuario.roles.includes("ADMINISTRADOR")) {
            renderPerfil(usuario);
        } else {
            renderSolicitudes(usuario);
        }
    } else {
        renderPerfil(usuario);
    }
}

async function renderPerfil(usuario) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        const roles = usuario.roles && usuario.roles.length
            ? usuario.roles.map(r => `<span class="badge badge--blue">${r}</span>`).join(" ")
            : "";

        const fotoHtml = usuario.fotoPerfil
            ? `<img src="${usuario.fotoPerfil}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
            : '';

        const inicialHtml = usuario.fotoPerfil
            ? `<div class="profile-inicial" style="display:none;">${(usuario.nombre || '?')[0].toUpperCase()}</div>`
            : `<div class="profile-inicial">${(usuario.nombre || '?')[0].toUpperCase()}</div>`;

        let accionesHtml = `<button type="button" id="btn-opciones-perfil">Opciones</button>`;
        if (usuario.roles.includes("EMPLEADOR")) {
            accionesHtml += `<button type="button" id="btn-panel-empleador">Panel Empleador</button>`;
        }
        if (usuario.roles.includes("EMPLEADO")) {
            accionesHtml += `<button type="button" id="btn-panel-empleado">Panel Empleado</button>`;
        }

        infoAccountDiv.innerHTML = `
<div class="profile-card">
    ${fotoHtml}${inicialHtml}
    <div class="profile-info">
        <h1 style="font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; letter-spacing: -.03em; color: var(--t); margin-bottom: 4px;">
            ${usuario.nombre} ${usuario.apellido}
        </h1>
        <h3><strong>Email:</strong> ${usuario.email}</h3>
        <h3><strong>Miembro desde:</strong> ${usuario.fechaCreacion}</h3>
        <div class="profile-roles">${roles}</div>
    </div>
    <div class="profile-actions">
        ${accionesHtml}
    </div>
</div>
`;

        const opciones = document.getElementById("btn-opciones-perfil");
        const btnEmpleador = document.getElementById("btn-panel-empleador");
        const btnEmpleado = document.getElementById("btn-panel-empleado");

        opciones.addEventListener("click", async () => {
            await renderOpciones(usuario);
        });

        if (btnEmpleador) {
            btnEmpleador.addEventListener("click", () => {
                window.location.href = "../empleador-folder/empleador.html";
            });
        }

        if (btnEmpleado) {
            btnEmpleado.addEventListener("click", () => {
                window.location.href = "../empleado-folder/empleado.html";
            });
        }

    }
}
async function renderOpciones(usuario) {

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

    if (usuario.roles.includes("CLIENTE") && !usuario.roles.includes("ADMINISTRADOR") && !usuario.roles.includes("EMPLEADOR")) {
        html += `
            <button id="btn-editar-perfil">
                Editar
            </button>
        `;
    }

    let tieneSolicitudesPendientes = false;
    if (!usuario.roles.includes("ADMINISTRADOR")) {
        try {
            const res = await fetch(API_URL + `/solicitudes-empleado/recibidas`, { headers: authHeaders() });
            await checkRes(res);
            const solicitudes = await res.json();
            tieneSolicitudesPendientes = solicitudes.length > 0;
        } catch {}
    }

    if (!usuario.roles.includes("ADMINISTRADOR")) {
        html += `
            <button id="btn-solicitudes-perfil">
                Solicitudes
            </button>
        `;
    }

    containerrol.innerHTML = html;

    const volver = document.getElementById("btn-volver-perfil");
    const editar = document.getElementById("btn-editar-perfil");
    const modoAdmin = document.getElementById("btn-modo-admin");
    const btnSolicitudes = document.getElementById("btn-solicitudes-perfil");

    volver.addEventListener("click", () => {
        renderPerfil(usuario);
    });

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

    if (btnSolicitudes) {
        btnSolicitudes.addEventListener("click", () => {
            renderSolicitudes(usuario);
        });
    }
}

function renderModificar(usuario) {
    const infoAccountDiv = document.getElementById("funcionalidadPerfil");

    infoAccountDiv.innerHTML = `
            <div class="input-group">
    <input type="text"
           class="form-control"
           placeholder="Nombre"
           id="nombre-input"
           minlength="3"
           maxlength="60">
</div>

<div class="input-group">
    <input type="text"
           class="form-control"
           placeholder="Apellido"
           id="apellido-input"
           minlength="3"
           maxlength="60">
</div>

<div class="input-group">
    <input type="password"
           class="form-control"
           placeholder="Contraseña"
           id="password-input"
           minlength="8"
           maxlength="67">
</div>
<div class="input-group">
    <input type="password"
           class="form-control"
           placeholder="Repetir Contraseña "
           id="password-confirm-input"
           minlength="8"
           maxlength="67">
</div>
<div class="input-group">
    <input type="email"
           class="form-control"
           placeholder="Email"
           id="email-input"
           minlength="8"
           maxlength="150">
</div>

<div class="input-group">
    <input type="url"
           class="form-control"
           placeholder="URL de foto de perfil"
           id="foto-url-input">
</div>
<div class="form-actions">
    <button class="btn-cancel" id="cancelar">Volver</button>
    <button class="btn-submit" id="modificar">Modificar</button>
</div>
<button id="btn-eliminar-perfil" style="margin-top:16px;width:100%;padding:10px;border-radius:var(--r-sm);border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.08);color:var(--red);font-size:13px;font-weight:500;cursor:pointer;">Eliminar Cuenta</button>
            `;


    const cancelar = document.getElementById("cancelar");
    const modificar = document.getElementById("modificar");
    const eliminar = document.getElementById("btn-eliminar-perfil");


    cancelar.addEventListener('click', async () => {

        await renderOpciones(usuario);

    });


    modificar.addEventListener('click', () => {

        modificarUsuario(usuario.id);

    });

    if (eliminar) {
        eliminar.addEventListener("click", async () => {
            if (!confirm("¿Estás seguro de que querés eliminar tu cuenta?")) return;
            const rta = await eliminarCuenta();
            if (rta) {
                alert("Eliminación realizada con éxito");
            } else {
                alert("No se pudo eliminar la cuenta");
            }
        });
    }


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
            API_URL + `/usuarios/modificar/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: authHeaders(),
            }
        );
        await checkRes(response);

        alert("Usuario modificado con éxito");

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

async function eliminarCuenta() {

    try {

        const response = await fetch(API_URL + `/usuarios/borrar-cuenta`, {
            headers: authHeaders(),
            method: "DELETE"
        });
        await checkRes(response);

        cerrarSesion();
        return true;

    } catch (error) {
        return false;
    }

}




async function renderSolicitudes(usuario) {
    const infoAccountDiv = document.getElementById("info-account");

    let solicitudesCache = [];

    infoAccountDiv.innerHTML = `
        <div class="funcionalidad-perfil-container">
            <div class="funcionalidad-perfil">
                <h2 style="font-size:1rem;font-weight:600;color:var(--t);margin-bottom:16px;">Invitaciones a Sucursales</h2>
                <input type="text" id="buscar-solicitud" placeholder="Buscar sucursal..."
                    style="width:100%;padding:8px 12px;border:1px solid var(--b);border-radius:var(--r-sm);background:var(--s1);color:var(--t);font-size:12px;margin-bottom:12px;box-sizing:border-box;">
                <div id="solicitudes-lista" style="color:var(--t3);font-size:13px;">Cargando...</div>
                <div style="margin-top:16px;">
                    <button class="btn-cancel" id="volver-solicitudes">Volver</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("volver-solicitudes").addEventListener("click", () => {
        renderPerfil(usuario);
    });

    try {
        const res = await fetch(API_URL + `/solicitudes-empleado/recibidas`, { headers: authHeaders() });
        await checkRes(res);
        solicitudesCache = await res.json();
        renderLista(solicitudesCache);
    } catch (e) {
        const container = document.getElementById("solicitudes-lista");
        if (container) container.innerHTML = '<div style="color:var(--red);font-size:12px;">Error al cargar invitaciones</div>';
    }

    document.getElementById("buscar-solicitud").addEventListener("input", () => {
        renderLista(solicitudesCache);
    });

    function renderLista(solicitudes) {
        const container = document.getElementById("solicitudes-lista");
        const texto = document.getElementById("buscar-solicitud").value.toLowerCase();

        if (!solicitudes || !solicitudes.length) {
            container.innerHTML = '<div style="color:var(--t3);font-family:var(--mono);font-size:12px;">No tenés invitaciones pendientes</div>';
            return;
        }

        const filtradas = solicitudes.filter(s =>
            (s.sucursal.nombre || "").toLowerCase().includes(texto)
        );

        if (filtradas.length === 0) {
            container.innerHTML = '<div style="color:var(--t3);font-family:var(--mono);font-size:12px;">No hay coincidencias</div>';
            return;
        }

        const estadoBadge = {
            PENDIENTE: 'badge--amber',
            APROBADA: 'badge--green',
            RECHAZADA: 'badge--red'
        };

        container.innerHTML = filtradas.map(s => {
            const fecha = new Date(s.fechaSolicitud).toLocaleDateString("es-AR");
            const esPendiente = s.estadoSolicitud === 'PENDIENTE';
            return `
                <div class="card solicitud-card" data-id="${s.id}">
                    <h3>${s.sucursal.nombre}</h3>
                    <p>${fecha} — Te invitaron a trabajar en esta sucursal</p>
                    ${esPendiente ? `
                        <div style="display:flex;gap:8px;">
                            <button class="aceptar-btn" data-id="${s.id}">Aceptar</button>
                            <button class="rechazar-btn" data-id="${s.id}">Rechazar</button>
                        </div>
                    ` : `<span class="badge ${estadoBadge[s.estadoSolicitud] || 'badge--blue'}">${s.estadoSolicitud}</span>`}
                </div>`;
        }).join("");

        container.querySelectorAll(".aceptar-btn").forEach(btn => {
            btn.addEventListener("click", () => aprobarSolicitud(parseInt(btn.dataset.id)));
        });
        container.querySelectorAll(".rechazar-btn").forEach(btn => {
            btn.addEventListener("click", () => rechazarSolicitud(parseInt(btn.dataset.id)));
        });
    }

    async function aprobarSolicitud(id) {
        try {
            const res = await fetch(API_URL + `/solicitudes-empleado/${id}/aprobar`, {
                method: "PATCH",
                headers: authHeaders()
            });
            await checkRes(res);
            alert("Solicitud aceptada");
            const res2 = await fetch(API_URL + `/solicitudes-empleado/recibidas`, { headers: authHeaders() });
            await checkRes(res2);
            solicitudesCache = await res2.json();
            renderLista(solicitudesCache);
        } catch {
            alert("No se pudo aceptar la solicitud");
        }
    }

    async function rechazarSolicitud(id) {
        try {
            const res = await fetch(API_URL + `/solicitudes-empleado/${id}/rechazar`, {
                method: "PATCH",
                headers: authHeaders()
            });
            await checkRes(res);
            alert("Solicitud rechazada");
            const res2 = await fetch(API_URL + `/solicitudes-empleado/recibidas`, { headers: authHeaders() });
            await checkRes(res2);
            solicitudesCache = await res2.json();
            renderLista(solicitudesCache);
        } catch {
            alert("No se pudo rechazar la solicitud");
        }
    }
}


async function cargarUsuario(id) {
    try {


        const response = await fetch(API_URL + `/usuarios/${id}`,
            {
                headers: authHeaders()
            }
        );
        await checkRes(response);

        return await response.json();
    } catch (error) {
        alert(error.message);
        return null;
    }
}