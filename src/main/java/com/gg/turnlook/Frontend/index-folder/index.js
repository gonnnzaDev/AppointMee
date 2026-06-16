import { authHeaders, sesionActiva } from "../recursos/modulos.js";

const u = await sesionActiva();

categoriasDisponibles();
renderSucursales();



async function renderSucursales() {
    const sucursales = await buscarSucursales();
    renderListaSucursales(sucursales);
}

function renderListaSucursales(sucursales) {
    const container = document.getElementById("turn-container");
    if (!container) return;

    container.innerHTML = "";

    sucursales.forEach(sucursal => {
        container.innerHTML += `
            <a href="${window.location.origin}/src/main/java/com/gg/turnlook/Frontend/sucursal-folder/Sucursal.html?id=${sucursal.id}">
                <article class="turn-article">
                    <img src="${sucursal.fotoPerfil || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQPQenKJTzexez3E1uN7qtSwZ8tgPQsVJ9DQ&s'}">
                    <div class="turn-content">
                        <h2>${sucursal.nombre}</h2>
                        <p>${sucursal.descripcion}</p>
                    </div>
                </article>
            </a>
        `;
    });
}

async function buscarSucursales() {
    try {
        const response = await fetch(`http://localhost:8080/sucursales/listar`, {
            headers: authHeaders()
        });
        console.log(authHeaders());
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

async function filtrarPorCategoria(categoria) {
    try {
        const response = await fetch(
            `http://localhost:8080/sucursales/listar/filtrar?categoria=${categoria}`,
            { headers: authHeaders() }
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const sucursales = await response.json();
        renderListaSucursales(sucursales);
    } catch (error) {
        alert(error.message);
    }
}


async function buscarCategorias() {
    try {
        const response = await fetch(`http://localhost:8080/sucursales/categorias`, {
            headers: authHeaders()
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

function renderCategoriasParaFiltrar(categorias) {
    const containerLeft = document.getElementById("category-container"); 
    if (!containerLeft) return;

    containerLeft.innerHTML = `
        <a href="#" class="categoria-filtro" data-categoria="">Todas</a>
        ${categorias.map(c => `
            <a href="#" class="categoria-filtro" data-categoria="${c}">${c}</a>
        `).join('')}
    `;

    containerLeft.querySelectorAll(".categoria-filtro").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            containerLeft.querySelectorAll(".categoria-filtro")
                .forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");

            const cat = e.target.dataset.categoria;
            if (cat === "") {
                renderSucursales();
            } else {
                filtrarPorCategoria(cat);
            }
        });
    });
}

async function categoriasDisponibles() {
    const categorias = await buscarCategorias();
    renderCategoriasParaFiltrar(categorias);
}