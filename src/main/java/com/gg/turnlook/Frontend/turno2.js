const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const TURNOS_BASE = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const hoy = new Date();
let vistaYear = hoy.getFullYear();
let vistaMes = hoy.getMonth();
let diaSeleccionado = null;
let turnoSeleccionado = null;

function turnosDelDia(y, m, d) {
    const seed = y * 10000 + m * 100 + d;
    return TURNOS_BASE.filter((_, i) => ((seed + i * 7) % 3) !== 0);
}

function renderCalendario() {
    const grid = document.getElementById('cal-grid');
    document.getElementById('cal-mes-nombre').textContent = MESES[vistaMes] + ' ' + vistaYear;
    grid.innerHTML = '';

    const primerDia = new Date(vistaYear, vistaMes, 1).getDay();
    const totalDias = new Date(vistaYear, vistaMes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        const v = document.createElement('div');
        v.className = 'cal-dia cal-dia--vacio';
        grid.appendChild(v);
    }

    for (let d = 1; d <= totalDias; d++) {
        const btn = document.createElement('button');
        btn.className = 'cal-dia';
        btn.textContent = d;

        const fecha = new Date(vistaYear, vistaMes, d);
        const esPasado = fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const esHoy = d === hoy.getDate() && vistaMes === hoy.getMonth() && vistaYear === hoy.getFullYear();
        const esSel = diaSeleccionado?.d === d && diaSeleccionado?.m === vistaMes && diaSeleccionado?.y === vistaYear;

        if (esPasado) { btn.classList.add('cal-dia--pasado'); btn.disabled = true; }
        if (esHoy) btn.classList.add('cal-dia--hoy');
        if (esSel) btn.classList.add('cal-dia--seleccionado');
        if (!esPasado) btn.addEventListener('click', () => seleccionarDia(d, vistaMes, vistaYear));
        grid.appendChild(btn);
    }
}

function seleccionarDia(d, m, y) {
    diaSeleccionado = { d, m, y };
    turnoSeleccionado = null;
    document.getElementById('turno-resumen').style.display = 'none';
    document.getElementById('btn-siguiente-turno-1').disabled = true;
    renderCalendario();
    renderHorarios();
}

function renderHorarios() {
    const grid = document.getElementById('horarios-grid');
    const titulo = document.getElementById('horarios-titulo');
    grid.innerHTML = '';

    if (!diaSeleccionado) {
        grid.innerHTML = '<span class="turno-sin-dia">Seleccioná un día para ver los horarios.</span>';
        titulo.innerHTML = 'Horarios disponibles';
        return;
    }

    const { d, m, y } = diaSeleccionado;
    const turnos = turnosDelDia(y, m, d);
    titulo.innerHTML = `Horarios disponibles <span>— ${d} de ${MESES[m]}</span>`;

    if (!turnos.length) {
        grid.innerHTML = '<span class="turno-sin-dia">Sin turnos disponibles para este día.</span>';
        return;
    }

    turnos.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'turno-hora-btn' + (turnoSeleccionado === t ? ' turno-hora-btn--seleccionado' : '');
        btn.textContent = t;
        btn.addEventListener('click', () => {
            turnoSeleccionado = t;
            const { d, m, y } = diaSeleccionado;
            document.getElementById('turno-resumen-texto').innerHTML =
                `Turno: <strong>${d} de ${MESES[m]} de ${y}</strong> a las <strong>${t} hs</strong>`;
            document.getElementById('turno-resumen').style.display = 'flex';
            document.getElementById('btn-siguiente-turno-1').disabled = false;
            renderHorarios();
        });
        grid.appendChild(btn);
    });
}

document.getElementById('btn-prev').addEventListener('click', () => {
    if (--vistaMes < 0) { vistaMes = 11; vistaYear--; }
    renderCalendario();
});
document.getElementById('btn-next').addEventListener('click', () => {
    if (++vistaMes > 11) { vistaMes = 0; vistaYear++; }
    renderCalendario();
});

renderCalendario();