



function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="am-nav">
      <div class="am-nav__container">

        <a class="am-nav__brand" href="../index-folder/Index.html">
          <img
            src="../recursos/content.png"
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
        
          <li><a class="am-nav__link" href="../index-folder/Index.html" data-page="home">Home</a></li>
          <li><a class="am-nav__link" href="../perfil-folder/Perfil.html" data-page="perfil">Perfil</a></li>
          <li><a class="am-nav__link" href="../misturnos-folder/MisTurnos.html" data-page="turnos">Mis Turnos</a></li>
          <li id="nav-mis-sucursales" style="display:none;"><a class="am-nav__link" href="../mis-sucursales-folder/MisSucursales.html" data-page="sucursales">Mis Sucursales</a></li>
          <li><a class="am-nav__link" href="../configuracion-folder/configuracion.html" data-page="turnos"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
</svg></a></li>
          
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
  _bindSearch();
}

function _bindSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  document.dispatchEvent(new CustomEvent("navbar:ready", { detail: { input } }));

  const enIndex = window.location.pathname
    .toLowerCase()
    .includes("/index-folder/index.html");

  if (enIndex) return;

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const termino = input.value.trim();
    const url = new URL("../index-folder/Index.html", window.location.href);
    if (termino) {
      url.searchParams.set("busqueda", termino);
    }
    window.location.href = url.toString();
  });
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

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  mostrarLinkSucursales();
});

async function mostrarLinkSucursales() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return;

    const user = await res.json();
    const roles = user.roles || [];
    const tiene = roles.includes("EMPLEADOR") || roles.includes("EMPLEADO");

    const link = document.getElementById("nav-mis-sucursales");
    if (link) link.style.display = tiene ? "" : "none";
  } catch {
  }
}