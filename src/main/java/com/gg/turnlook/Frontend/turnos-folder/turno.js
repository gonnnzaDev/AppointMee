const apiBaseURL = "http://localhost:8080/turnos";
const imagenURLAlternativa = "https://xent ra.glomastore.mx/img/sin_imagen.png";

renderTurnos();
//en empleados container debe ingresar los html de la otra funcion

function renderTurnos() {


    const agendarTurnosContainer = document.getElementById("agendarTurno-container");

    if (agendarTurnosContainer) {


        agendarTurnosContainer.innerHTML = `
          <div class="agendarTurno-info">

 
            <div class="empleados-container">

              
            </div>


            <div class="info-seleccionada" id="info-seleccionada">
              
            </div>

            <button class="btn-proceso" id="btn-siguiente-turno-1">Siguiente</button>


        </div>
        `


        buscarEmpleados();


        const btnSiguiente = document.getElementById("btn-siguiente-turno-1");

        btnSiguiente.addEventListener("click",
            () => {
                  agendarTurnosContainer.innerHTML =
                `

               <div class="agendarTurno-info">
        <div class="turno-container">

            <div class="turno-header">
                <h1>¿Cuándo querés venir?</h1>
            </div>

            <div class="cal-nav">
                <button class="cal-nav-btn" id="btn-prev">&#8249;</button>
                <span class="cal-mes-nombre" id="cal-mes-nombre"></span>
                <button class="cal-nav-btn" id="btn-next">&#8250;</button>
            </div>

            <div class="cal-semana">
                <div class="cal-semana-label">DO</div>
                <div class="cal-semana-label">LU</div>
                <div class="cal-semana-label">MA</div>
                <div class="cal-semana-label">MI</div>
                <div class="cal-semana-label">JU</div>
                <div class="cal-semana-label">VI</div>
                <div class="cal-semana-label">SA</div>
            </div>

            <div class="cal-grid" id="cal-grid"></div>

            <p class="turno-horarios-titulo" id="horarios-titulo">Horarios disponibles</p>
            <div class="turno-horarios-grid" id="horarios-grid">
                <span class="turno-sin-dia">Seleccioná un día para ver los horarios.</span>
            </div>

            <div class="turno-resumen" id="turno-resumen">
                <span class="turno-resumen-texto" id="turno-resumen-texto"></span>
            </div>

            <div class="turno-footer">
                <button class="turno-btn-siguiente" id="btn-siguiente-turno-2" disabled>
                    Confirmar turno <span>→</span>
                </button>
            </div>
        </div>
    </div>


        `

            }
        )
          



    }


}


//Primera Parte de la seccion turno



function buscarEmpleados() {

    fetch('')
        .then(res => res.json())
        .then(empleados => {
            cargarEmpleados(empleados);
        })
        .catch(error => alert(error.message));


}



function visualizarProfesionalSeleccionado(id) {

    const info = document.getElementById("info-seleccionada");

    if(info){
        info.innerHTML = `
                <img src="" alt="${imagenURLAlternativa}">
                <h2>Nombre:</h2>
                <p>Puntuacion:</p>
`;
    }


}


function cargarEmpleados(e) {

    const baseDeLink = "";

    let link = baseDeLink + e.id;
    const empleadosContainer = document.getElementById("empleados-container");
    if (empleadosContainer) {
        empleadosContainer.innerHTML = empleados.map(e => `
            <a href="${link}">
                    <article class="empleado-article">
                        <p>${e.nombre}</p>
                        <p>${e.valoracion}</p>
                        <img src="${e.imagen}"
                            alt="${imagenURLAlternativa}">
                    </article>

                </a>

        `).join('');
    }
}




//Segundo paso render



//Segunda Parte de la seccion turno (segundo paso logica)
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




