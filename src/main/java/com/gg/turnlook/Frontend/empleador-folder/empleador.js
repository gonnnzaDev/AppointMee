const API = "http://localhost:8080";
const token = () => localStorage.getItem("token");
const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token()
});

let miId = null;
let misSucursales = [];


document.addEventListener("DOMContentLoaded", async () => {
    await cargarMe();
    await cargarSucursales();
    bindEventos();
});



async function cargarMe() {
    try {
        const res = await fetch(API + "/usuarios/me", { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        miId = data.id;
    } catch (e) {
        alert("No se pudo obtener tu sesión: " + e.message);
    }
}



async function cargarSucursales() {
    try {
        const res = await fetch(API + "/sucursales/listar", { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const todas = await res.json();

        misSucursales = todas;

        renderSucursales(misSucursales);
        poblarSelectsSucursal(misSucursales);

    } catch (e) {
        alert("Error al cargar sucursales: " + e.message);
    }
}

function renderSucursales(sucursales) {
    const body = document.getElementById("sucursalesBody");
    body.innerHTML = "";

    if (!sucursales.length) {
        body.innerHTML = `<tr><td colspan="6" style="color:var(--dk-text-3);font-family:var(--font-mono);font-size:12px;">Sin sucursales</td></tr>`;
        return;
    }

    sucursales.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.nombre}</td>
            <td>${s.direccion}</td>
            <td>${s.telefono ?? "-"}</td>
            <td>${s.categoria}</td>
            <td>${s.horaApertura} – ${s.horaCierre}</td>
            <td>
                <div class="table-actions">
                    <button onclick="abrirModalModificarSucursal(${s.id})">Editar</button>
                    <button onclick="eliminarSucursal(${s.id})" style="color:var(--dk-red);">Borrar</button>
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

function poblarSelectsSucursal(sucursales) {
    const ids = ["filtro-sucursal-servicios", "filtro-sucursal-turnos", "filtro-sucursal-empleados"];
    ids.forEach(id => {
        const sel = document.getElementById(id);
        sel.innerHTML = `<option value="">Seleccioná una sucursal</option>`;
        sucursales.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.nombre;
            sel.appendChild(opt);
        });
    });
}

async function eliminarSucursal(sucursalId) {
    if (!confirm("¿Borrar esta sucursal?")) return;
    try {
        const res = await fetch(`${API}/sucursales/borrar-sucursal-propia/${sucursalId}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) await cargarSucursales();
    } catch (e) {
        alert("Error: " + e.message);
    }
}



async function cargarServicios(sucursalId) {
    const body = document.getElementById("serviciosBody");
    body.innerHTML = "";
    if (!sucursalId) return;

    try {
        const res = await fetch(`${API}/servicios/listar/sucursal/${sucursalId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const servicios = await res.json();

        if (!servicios.length) {
            body.innerHTML = `<tr><td colspan="5" style="color:var(--dk-text-3);font-family:var(--font-mono);font-size:12px;">Sin servicios</td></tr>`;
            return;
        }

        servicios.forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${s.nombre}</td>
                <td>${s.descripcion}</td>
                <td>${s.duracion} min</td>
                <td>$${s.precio}</td>
                <td>
                    <div class="table-actions">
                        <button onclick="abrirModalModificarServicio(${s.id})">Editar</button>
                        <button onclick="eliminarServicio(${s.id}, ${sucursalId})" style="color:var(--dk-red);">Borrar</button>
                    </div>
                </td>
            `;
            body.appendChild(tr);
        });

    } catch (e) {
        alert("Error al cargar servicios: " + e.message);
    }
}

async function eliminarServicio(servicioId, sucursalId) {
    if (!confirm("¿Borrar este servicio?")) return;
    try {
        const res = await fetch(`${API}/servicios/eliminar/${servicioId}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) await cargarServicios(sucursalId);
    } catch (e) {
        alert("Error: " + e.message);
    }
}



async function cargarTurnos(sucursalId) {
    const body = document.getElementById("turnosBody");
    body.innerHTML = "";
    if (!sucursalId) return;

    try {
        const res = await fetch(`${API}/turnos/de-sucursal/${sucursalId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const turnos = await res.json();

        if (!turnos.length) {
            body.innerHTML = `<tr><td colspan="6" style="color:var(--dk-text-3);font-family:var(--font-mono);font-size:12px;">Sin turnos</td></tr>`;
            return;
        }

        turnos.forEach(t => {
            const fecha = new Date(t.fechaTurno).toLocaleString("es-AR");
            const cliente = t.cliente ? `${t.cliente.nombre} ${t.cliente.apellido}` : "-";
            const empleado = t.empleado ? `${t.empleado.nombre} ${t.empleado.apellido}` : "-";
            const estado = t.estadoTurno ?? "-";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${t.nombreServicio ?? "-"}</td>
                <td>${cliente}</td>
                <td>${empleado}</td>
                <td>${fecha}</td>
                <td><span class="badge badge--blue">${estado}</span></td>
                <td>
                    <div class="table-actions">
                        <button onclick="finalizarTurno(${t.id}, ${sucursalId})">Finalizar</button>
                        <button onclick="cancelarTurno(${t.id}, ${sucursalId})" style="color:var(--dk-red);">Cancelar</button>
                    </div>
                </td>
            `;
            body.appendChild(tr);
        });

    } catch (e) {
        alert("Error al cargar turnos: " + e.message);
    }
}

async function finalizarTurno(turnoId, sucursalId) {
    if (!confirm("¿Finalizar este turno?")) return;
    try {
        const res = await fetch(`${API}/turnos/finalizar/${turnoId}`, {
            method: "PATCH",
            headers: authHeaders()
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) await cargarTurnos(sucursalId);
    } catch (e) {
        alert("Error: " + e.message);
    }
}

async function cancelarTurno(turnoId, sucursalId) {
    if (!confirm("¿Cancelar este turno?")) return;
    try {
        const res = await fetch(`${API}/turnos/cancelar/${turnoId}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) await cargarTurnos(sucursalId);
    } catch (e) {
        alert("Error: " + e.message);
    }
}



async function cargarEmpleados(sucursalId) {
    const body = document.getElementById("empleadosBody");
    body.innerHTML = "";
    if (!sucursalId) return;

    try {
        const res = await fetch(`${API}/sucursales/${sucursalId}/empleados`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const empleados = await res.json();

        if (!empleados.length) {
            body.innerHTML = `<tr><td colspan="3" style="color:var(--dk-text-3);font-family:var(--font-mono);font-size:12px;">Sin empleados</td></tr>`;
            return;
        }

        empleados.forEach(e => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${e.nombre}</td>
                <td>${e.apellido}</td>
                <td>
                    <div class="table-actions">
                        <button onclick="eliminarEmpleado(${sucursalId}, ${e.id})" style="color:var(--dk-red);">Quitar</button>
                    </div>
                </td>
            `;
            body.appendChild(tr);
        });

    } catch (e) {
        alert("Error al cargar empleados: " + e.message);
    }
}

async function agregarEmpleado(sucursalId) {
    const email = document.getElementById("input-email-empleado").value.trim();
    if (!email) { alert("Ingresá el email del empleado"); return; }

    try {
        const res = await fetch(`${API}/sucursales/${sucursalId}/empleados/agregar`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ email })
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) {
            document.getElementById("input-email-empleado").value = "";
            await cargarEmpleados(sucursalId);
        }
    } catch (e) {
        alert("Error: " + e.message);
    }
}

async function eliminarEmpleado(sucursalId, empleadoId) {
    if (!confirm("¿Quitar este empleado?")) return;
    try {
        const res = await fetch(`${API}/sucursales/${sucursalId}/empleados/eliminar/${empleadoId}`, {
            method: "DELETE",
            headers: authHeaders()
        });
        const msg = await res.text();
        alert(msg);
        if (res.ok) await cargarEmpleados(sucursalId);
    } catch (e) {
        alert("Error: " + e.message);
    }
}



async function abrirModalModificarSucursal(sucursalId) {
    const suc = misSucursales.find(s => s.id === sucursalId);
    if (!suc) return;

    const input = (id, val) => `
        <p>${id}</p>
        <div class="input-group mb-1">
            <input type="text" class="form-control" id="mod-suc-${id}" value="${val ?? ""}">
        </div>`;

    const div = document.createElement("div");
    div.id = "modal-suc";
    div.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;";
    div.innerHTML = `
        <div class="form-simple" style="max-width:480px;width:90%;max-height:85vh;overflow-y:auto;">
            <h1>Editar Sucursal</h1>
            ${input("nombre", suc.nombre)}
            ${input("direccion", suc.direccion)}
            ${input("telefono", suc.telefono)}
            ${input("descripcion", suc.descripcion)}
            <p>Hora apertura</p>
            <div class="input-group mb-1">
                <input type="time" class="form-control" id="mod-suc-horaApertura" value="${suc.horaApertura}">
            </div>
            <p>Hora cierre</p>
            <div class="input-group mb-1">
                <input type="time" class="form-control" id="mod-suc-horaCierre" value="${suc.horaCierre}">
            </div>
            <p>URL foto</p>
            <div class="input-group mb-1">
                <input type="url" class="form-control" id="mod-suc-fotoUrl" value="${suc.fotoPerfil ?? ""}">
            </div>
            <div class="form-actions">
                <button class="btn-submit" id="btn-guardar-suc">Guardar</button>
                <button class="btn-cancel" onclick="document.getElementById('modal-suc').remove()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    document.getElementById("btn-guardar-suc").addEventListener("click", async () => {
        const body = {
            nombre:       document.getElementById("mod-suc-nombre").value || undefined,
            direccion:    document.getElementById("mod-suc-direccion").value || undefined,
            telefono:     document.getElementById("mod-suc-telefono").value || undefined,
            descripcion:  document.getElementById("mod-suc-descripcion").value || undefined,
            horaApertura: document.getElementById("mod-suc-horaApertura").value || undefined,
            horaCierre:   document.getElementById("mod-suc-horaCierre").value || undefined,
            fotoUrl:      document.getElementById("mod-suc-fotoUrl").value || undefined,
        };
        try {
            const res = await fetch(`${API}/sucursales/modificar/${sucursalId}`, {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify(body)
            });
            const msg = await res.text();
            alert(msg);
            if (res.ok) { div.remove(); await cargarSucursales(); }
        } catch (e) {
            alert("Error: " + e.message);
        }
    });
}

async function abrirModalModificarServicio(servicioId) {
    try {
        const res = await fetch(`${API}/servicios/${servicioId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const s = await res.json();

        const div = document.createElement("div");
        div.id = "modal-serv";
        div.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;";
        div.innerHTML = `
            <div class="form-simple" style="max-width:440px;width:90%;max-height:85vh;overflow-y:auto;">
                <h1>Editar Servicio</h1>
                <p>Nombre</p>
                <div class="input-group mb-1">
                    <input type="text" class="form-control" id="mod-serv-nombre" value="${s.nombre}">
                </div>
                <p>Descripción</p>
                <div class="input-group mb-1">
                    <textarea class="form-control" id="mod-serv-descripcion" rows="3">${s.descripcion}</textarea>
                </div>
                <p>Duración (min)</p>
                <div class="input-group mb-1">
                    <input type="number" class="form-control" id="mod-serv-duracion" value="${s.duracion}" min="30" max="360">
                </div>
                <p>Precio</p>
                <div class="input-group mb-1">
                    <input type="number" class="form-control" id="mod-serv-precio" value="${s.precio}" min="0.01" step="0.01">
                </div>
                <p>URL foto</p>
                <div class="input-group mb-1">
                    <input type="url" class="form-control" id="mod-serv-fotoUrl" value="${s.fotoPerfil ?? ""}">
                </div>
                <div class="form-actions">
                    <button class="btn-submit" id="btn-guardar-serv">Guardar</button>
                    <button class="btn-cancel" onclick="document.getElementById('modal-serv').remove()">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        document.getElementById("btn-guardar-serv").addEventListener("click", async () => {
            const body = {
                nombre:      document.getElementById("mod-serv-nombre").value || undefined,
                descripcion: document.getElementById("mod-serv-descripcion").value || undefined,
                duracion:    parseInt(document.getElementById("mod-serv-duracion").value) || undefined,
                precio:      parseFloat(document.getElementById("mod-serv-precio").value) || undefined,
                fotoUrl:     document.getElementById("mod-serv-fotoUrl").value || undefined,
            };
            try {
                const res = await fetch(`${API}/servicios/modificar/${servicioId}`, {
                    method: "PATCH",
                    headers: authHeaders(),
                    body: JSON.stringify(body)
                });
                const msg = await res.text();
                alert(msg);
                if (res.ok) {
                    div.remove();
                    const sucursalId = document.getElementById("filtro-sucursal-servicios").value;
                    if (sucursalId) await cargarServicios(sucursalId);
                }
            } catch (e) {
                alert("Error: " + e.message);
            }
        });

    } catch (e) {
        alert("Error al cargar servicio: " + e.message);
    }
}



function bindEventos() {

    document.getElementById("btn-agregar-sucursal").addEventListener("click", () => {
        window.location.href = "../formagregarsucursal-folder/FormAgregarSucursal.html";
    });

    document.getElementById("btn-agregar-servicio").addEventListener("click", () => {
        const sucursalId = document.getElementById("filtro-sucursal-servicios").value;
        if (!sucursalId) { alert("Seleccioná una sucursal primero"); return; }
        window.location.href = `../formagregarservicio-folder/FormAgregarServicio.html?sucursalId=${sucursalId}`;
    });

    document.getElementById("filtro-sucursal-servicios").addEventListener("change", (e) => {
        cargarServicios(e.target.value);
    });

    document.getElementById("filtro-sucursal-turnos").addEventListener("change", (e) => {
        cargarTurnos(e.target.value);
    });

    document.getElementById("filtro-sucursal-empleados").addEventListener("change", (e) => {
        cargarEmpleados(e.target.value);
    });

    document.getElementById("btn-agregar-empleado").addEventListener("click", () => {
        const sucursalId = document.getElementById("filtro-sucursal-empleados").value;
        if (!sucursalId) { alert("Seleccioná una sucursal primero"); return; }
        agregarEmpleado(sucursalId);
    });
}