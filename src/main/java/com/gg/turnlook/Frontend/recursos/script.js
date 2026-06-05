const baseApi = "http://localhost:8080/";




function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="am-nav">
      <div class="am-nav__container">

        <a class="am-nav__brand" href="index-folder/Index.html">
          <img
            src="recursos/content.png"
            alt="AppointMee logo"
            class="am-nav__logo"
          />
          <span class="am-nav__title">AppointMee</span>
        </a>

        <div class="am-nav__search">
          <svg class="am-nav__search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6.5" cy="6.5" r="5.5"/>
            <line x1="11.5" y1="11.5" x2="15" y2="15"/>
          </svg>
          <input
            class="am-nav__search-input"
            type="search"
            placeholder="Buscá tu próximo turno..."
            autocomplete="off"
            id="search-input"
          />
        </div>

        <ul class="am-nav__links" id="amNavLinks">
        
          <li><a class="am-nav__link" href="index-folder/Index.html" data-page="home">Home</a></li>
          <li><a class="am-nav__link" href="perfil-folder/Perfil.html" data-page="perfil">Perfil</a></li>
          <li><a class="am-nav__link" href="misturnos-folder/MisTurnos.html" data-page="turnos">Mis Turnos</a></li>
          
        </ul>

        <button class="am-nav__toggle" id="amNavToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="amNavLinks">
          <span class="am-nav__toggle-bar"></span>
          <span class="am-nav__toggle-bar"></span>
          <span class="am-nav__toggle-bar"></span>
        </button>

      </div>
    </nav>
  `;

  _bindToggle();
  _markActiveLink();
}

function _bindToggle() {
  const toggle = document.getElementById("amNavToggle");
  const links = document.getElementById("amNavLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("am-nav__links--open");
    toggle.classList.toggle("am-nav__toggle--open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove("am-nav__links--open");
      toggle.classList.remove("am-nav__toggle--open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function _markActiveLink() {
  const currentPage = window.location.pathname.split("/").pop() || "Index.html";
  const links = document.querySelectorAll(".am-nav__link");
  links.forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === currentPage) {
      link.classList.add("am-nav__link--active");
    }
  });
}

document.addEventListener("DOMContentLoaded", initNavbar);

obtenerSucursalesFiltradas(null, "Test");

async function obtenerSucursalesFiltradas(catId, texto) {

  const parametrosEnviar = new URLSearchParams();

  if (catId) parametrosEnviar.append('catId', catId);
  if (texto) parametrosEnviar.append('nombre', texto);

  const urlFinal = parametrosEnviar
    .toString() ? `http://localhost:8080/listar/filtrar?${parametrosEnviar.toString()}` : urlBase;

  try {
    const respuesta = await fetch(urlFinal, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: ${respuesta.status}`);
    }


    return await respuesta.json();

  } catch (error) {
    alert('Error al realizar la petición:', error);
  }
}



async function usoBuscador(termino) {
  try {
    const response = await fetch(`http://localhost:8080/sucursales/listar/filtrar/${termino}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  }
}


