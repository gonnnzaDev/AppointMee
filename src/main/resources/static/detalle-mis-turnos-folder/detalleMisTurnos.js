import { API_URL, authHeaders, sesionActiva } from "../recursos/modulos.js";

const user = await sesionActiva();

if (!user) {
    window.location.href = "../login-folder/Login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const turnoId = urlParams.get("id");

if (!turnoId) {
    alert("No se especificó un ID de turno válido.");
    window.location.href = "../misturnos-folder/MisTurnos.html";
}

obtenerDetalleTurno();

async function obtenerDetalleTurno() {
    try {
        const response = await fetch(API_URL + `/turnos/propios/detalles/${turnoId}`, {
            headers: authHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error al recuperar detalles: ${response.status}`);
        }

        const turno = await response.json();

        renderComentarios(turno);
        renderDetalle(turno);

    } catch (error) {
        document.getElementById("detalle-turno-info").innerHTML = `
            <p style="color: var(--red); font-family: var(--mono);">
                No se pudieron cargar los detalles del turno.
            </p>
        `;

        alert(error.message);
    }
}

function renderComentarios(turno) {

    const container = document.getElementById("comentarios");
    const btnGuardar = document.getElementById("guardar");

    if (
        turno.estadoTurno === "REALIZADO" ||
        turno.estadoTurno === "CANCELADO"
    ) {

        container.innerHTML = `
            <div class="form-group">
                <label for="mensaje">
                    Tu Mensaje / Comentario (Opcional):
                </label>

                <textarea
                    id="mensaje"
                    placeholder="Contanos qué te pareció el servicio..."
                ></textarea>
            </div>
        `;

        btnGuardar.style.display = "block";

    } else {

        container.innerHTML = `
            <p style="font-family: var(--mono); color: var(--t3);">
                Este turno todavía no puede calificarse.
            </p>
        `;

        btnGuardar.style.display = "none";
    }
}

function renderDetalle(turno) {

    const infoContainer = document.getElementById("detalle-turno-info");

    const fechaHora = new Date(turno.fechaTurno).toLocaleString();
    const fechaReserva = new Date(turno.fechaReserva).toLocaleDateString();

    const nombreEmpleado = turno.empleado
        ? `${turno.empleado.nombre} ${turno.empleado.apellido}`
        : "No asignado";

    const nombreCliente = turno.cliente
        ? `${turno.cliente.nombre} ${turno.cliente.apellido}`
        : "N/A";

    const precioServicio = turno.servicio?.precio != null
        ? `$${turno.servicio.precio}`
        : "N/A";

    const duracionServicio = turno.servicio?.duracion != null
        ? `${turno.servicio.duracion} min`
        : "N/A";

    infoContainer.innerHTML = `
        <div class="form-group">
            <label>Servicio</label>
            <p style="font-size:16px;font-weight:600;color:var(--blue);">
                ${turno.servicio?.nombre || "N/A"}
            </p>
        </div>

        <div class="form-group">
            <label>Precio del Servicio</label>
            <p style="font-family:var(--mono);">${precioServicio}</p>
        </div>

        <div class="form-group">
            <label>Duración</label>
            <p style="font-family:var(--mono);">${duracionServicio}</p>
        </div>

        <div class="form-group">
            <label>Fecha y Hora del Turno</label>
            <p style="font-family:var(--mono);">${fechaHora}</p>
        </div>

        <div class="form-group">
            <label>Profesional / Empleado</label>
            <p>${nombreEmpleado}</p>
        </div>

        <div class="form-group">
            <label>Cliente</label>
            <p>${nombreCliente}</p>
        </div>

        <div class="form-group">
            <label>Fecha en que se solicitó la Reserva</label>
            <p style="font-family:var(--mono);color:var(--t3);">
                ${fechaReserva}
            </p>
        </div>
    `;

    if (turno.resenia) {

        document.getElementById("puntuacion").value =
            turno.resenia.puntuacion;

        const mensaje = document.getElementById("mensaje");

        if (mensaje) {
            mensaje.value = turno.resenia.comentario || "";
            mensaje.disabled = true;
        }

        document.getElementById("puntuacion").disabled = true;

        const btnGuardar = document.getElementById("guardar");

        btnGuardar.textContent = "Turno ya Calificado";
        btnGuardar.disabled = true;
        btnGuardar.style.opacity = "0.5";

        if (turno.resenia.fechaResenia) {

            const fechaResenia =
                new Date(turno.resenia.fechaResenia)
                    .toLocaleDateString();

            const reseniaInfo = document.createElement("p");

            reseniaInfo.style.fontFamily = "var(--mono)";
            reseniaInfo.style.color = "var(--t3)";
            reseniaInfo.textContent =
                `Reseñado el ${fechaResenia}`;

            document
                .getElementById("resenia-form")
                .prepend(reseniaInfo);
        }
    }
}

document
    .getElementById("resenia-form")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const puntuacionVal =
            document.getElementById("puntuacion").value;

        const mensaje =
            document.getElementById("mensaje");

        const comentarioVal =
            mensaje ? mensaje.value.trim() : "";

        if (!puntuacionVal) {
            alert("Seleccioná una puntuación.");
            return;
        }

        if (
            comentarioVal.length > 0 &&
            comentarioVal.length < 8
        ) {
            alert(
                "El comentario debe tener al menos 8 caracteres o dejarse vacío."
            );
            return;
        }

        try {

            const response = await fetch(
                API_URL + `/turnos/${turnoId}/resenia`,
                {
                    method: "POST",
                    headers: {
                        ...authHeaders(),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        puntuacion: parseInt(puntuacionVal),
                        comentario:
                            comentarioVal.length > 0
                                ? comentarioVal
                                : null
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `No se pudo guardar la calificación. Código: ${response.status}`
                );
            }

            alert(
                "¡Muchas gracias! Tu calificación se guardó correctamente."
            );

            window.location.reload();

        } catch (error) {
            alert(error.message);
        }
    });

function volver() {
    window.location.href =
        "../misturnos-folder/MisTurnos.html";
}

document
    .getElementById("btn-volver")
    .addEventListener("click", volver);