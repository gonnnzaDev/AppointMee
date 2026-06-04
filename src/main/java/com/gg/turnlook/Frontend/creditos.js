renderCreditos();

function renderCreditos() {

    const aboutContainer = document.getElementById('about-container');

    if (aboutContainer) {
        aboutContainer.innerHTML = `
          <div class="about-info">

                <h1>Sobre el Proyecto</h1>
                <hr>
                <h2>Informacion</h2>
                <p>
                    <strong>AppointMee</strong> es una red social de turnos, esta plataforma fue diseñada para optimizar
                    la gestión de
                    turnos y mejorar la comunicación
                    entre clientes y establecimientos. El objetivo principal es facilitar la reserva, organización y
                    administración de citas de manera rápida, intuitiva y accesible desde cualquier dispositivo.
                </p>
                <p>

                    La aplicación permite a los usuarios consultar disponibilidad, solicitar turnos y recibir
                    información actualizada sobre sus reservas. Ademas que brinda a los empleados y empleadores
                    herramientas
                    para gestionar agendas, controlar la ocupación de horarios y mantener un registro ordenado de las
                    citas programadas.
                </p>
                <p>

                    Durante el desarrollo del proyecto se priorizaron aspectos como la experiencia de usuario, la
                    accesibilidad, la seguridad de los datos y la escalabilidad del sistema. Para ello, se aplicaron
                    buenas prácticas de desarrollo web y una arquitectura orientada a facilitar el mantenimiento y la
                    incorporación de futuras funcionalidades.
                </p>
                <p>

                    Nuestro equipo en esta oportunidad buscò ofrecer una solución moderna y eficiente para negocios y
                    organizaciones que
                    requieren una gestión organizada de turnos, reduciendo tiempos de espera y mejorando la experiencia
                    tanto de los clientes como del personal administrativo de las organizaciones.
                </p>

                <img src="https://mdp.utn.edu.ar/UTNMDQdata/thumbnail.jpg" alt="">
                <hr>
                <h2>Documentacion</h2>
                <div class="documentacion-links">

            
                </div>
                <div class="documentacion-links-container">
                    <a href="https://github.com/gonnnzaDev/AppointMee" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-github" viewBox="0 0 16 16">
                            <path
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                        </svg>

                    </a>
                </div>

                <hr>

                <h2>About us</h2>
                <h3>Gonzalo Leonel Lopez</h3>
                <p>
                    Hola, soy Gonza un estudiante de 19 años. Actualmente cursando el segundo año de
                    Programación en la Universidad Tecnologica Nacional. En este proyecto soy el desarrollador encargado
                    de realizar el Frontend.
                </p>
                <h3>Giovanni Morro Bai</h3>
                <p>
                    Hola soy Gio tengo 19 años, estoy cursando mi segundo año de programación en la UTN y en este proyecto fui el
                    encargado del Backend. 
                </p>


            </div>

        `;


    }

}
