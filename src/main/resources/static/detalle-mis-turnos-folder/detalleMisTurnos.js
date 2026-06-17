import { authHeaders, sesionActiva } from "../../recursos/modulos.js";

const user = await sesionActiva();

const urlParams = new URLSearchParams(window.location.search);
const turnoId = urlParams.get('id');

if (!turnoId) {
    alert("No se especificó un ID de turno válido.");
    window.location.href = "../misturnos-folder/misTurnos.html";
}

obtenerDetalleTurno();

async function obtenerDetalleTurno() {
    try {
        const response = await fetch(`/turnos/propios/detalles/${turnoId}`, {
            headers: authHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error al recuperar detalles: ${response.status}`);
        }

        const turnoData = await response.json(); 
        renderDetalle(turnoData);

    } catch (error) {
        document.getElementById("detalle-turno-info").innerHTML = `
            <p style="color: var(--red); font-family: var(--mono);">No se pudieron cargar los detalles del turno.</p>
        `;
        alert(error.message);
    }
}

function renderDetalle(turno) {
    const infoContainer = document.getElementById("detalle-turno-info");
    
    const fechaHora = new Date(turno.fechaHora).toLocaleString();
    const fechaReserva = new Date(turno.fechaReserva).toLocaleDateString();

    infoContainer.innerHTML = `
        <div class="form-group">
            <label>Servicio</label>
            <p style="font-size: 16px; font-weight: 600; color: var(--blue);">${turno.servicio?.nombre || 'N/A'}</p>
        </div>
        <div class="form-group">
            <label>Fecha y Hora del Turno</label>
            <p style="font-family: var(--mono);">${fechaHora}</p>
        </div>
        <div class="form-group">
            <label>Profesional / Empleado</label>
            <p>${turno.empleado?.nombre || 'No asignado'}</p>
        </div>
        <div class="form-group">
            <label>Cliente</label>
            <p>${turno.cliente?.nombre || 'N/A'}</p>
        </div>
        <div class="form-group">
            <label>Fecha en que se solicitó la Reserva</label>
            <p style="font-family: var(--mono); color: var(--t3);">${fechaReserva}</p>
        </div>
    `;

    if (turno.resenia) {
        document.getElementById("puntuacion").value = turno.resenia.puntuacion;
        document.getElementById("mensaje").value = turno.resenia.mensaje || '';
        
        document.getElementById("puntuacion").disabled = true;
        document.getElementById("mensaje").disabled = true;
        
        const btnGuardar = document.getElementById("btn-guardar-resenia");
        btnGuardar.textContent = "Turno ya Calificado";
        btnGuardar.disabled = true;
        btnGuardar.style.opacity = "0.5";
    }
}

document.getElementById("resenia-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const puntuacionVal = document.getElementById("puntuacion").value;
    const mensajeVal = document.getElementById("mensaje").value;

    const reseniaPayload = {
        puntuacion: parseInt(puntuacionVal),
        mensaje: mensajeVal
    };

    try {
        const response = await fetch(`/turnos/detalles/${turnoId}/resenia`, {
            method: 'POST',
            headers: {
                ...authHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reseniaPayload)
        });

        if (!response.ok) {
            throw new Error(`No se pudo guardar la calificación. Código: ${response.status}`);
        }

        alert("¡Muchas gracias! Tu calificación se guardó correctamente.");
        window.location.reload(); 

    } catch (error) {
        alert(error.message);
    }
});

function volver(){
    window.location.href = "../misturnos-folder/Misturnos.html";
}




document.getElementById("btn-volver")
.addEventListener('click', volver);