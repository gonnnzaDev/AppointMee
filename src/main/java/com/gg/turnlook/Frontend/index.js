const baseApi = "http://localhost:8080/";


async function traerSucursales() {
    try {
        const res = await fetch(baseApi + 'sucursales/listar');
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return await res.json();
    } catch (error) {
       // window.location.href = `/error.html?msg=${encodeURIComponent(error.message)}`;
        return [];
    }
}

async function mostrarSucursales() {
    const sucursales = await traerSucursales();
    const sucursalesContainer = document.getElementById('turn-container');
    if (sucursalesContainer) {
        sucursalesContainer.innerHTML = sucursales.map(sucursal =>
            renderSucursal(sucursal.nombre, sucursal.descripcion, sucursal.categoria)
        ).join('');
    }
}

function renderSucursal(nombre, descripcion, categoria) {
    return `
        <a href="">
            <article class="turn-article">
                <div class="turn-content">
                    <span class="turn-tag">${categoria}</span>
                    <h2>${nombre}</h2>
                    <p>${descripcion}</p>
                </div>
            </article>
        </a>
    `;
}

function categoriasDisponibles() {
    fetch(baseApi + 'categorias')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(categorias => renderCategoriasParaFiltrar(categorias))
        .catch(error => {
          //  window.location.href = `/error.html?msg=${encodeURIComponent(error.message)}`;
        });
}

function renderCategoriasParaFiltrar(categorias) {
    const containerLeft = document.getElementById("category-container");
    if (containerLeft) {
        containerLeft.innerHTML = categorias.map(c => `
            <div class="categoria-item">
                <p>${c.categoria}</p>
            </div>
        `).join('');
    }
}

categoriasDisponibles();
mostrarSucursales();
