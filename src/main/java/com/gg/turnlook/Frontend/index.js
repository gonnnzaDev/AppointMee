

renderSucursales();

async function renderSucursales() {
    const container = document.getElementById("turn-container");

    if (container) {

        const sucursales = await buscarSucursales();

        sucursales.forEach(sucursal => {

            container.innerHTML +=
                //<img src=""> poner dsp
                `
            <a href="${baseApi}/sucursal/${sucursal.id}">
            <article class="turn-article">
            <div class="turn-content">
            <span class="turn-tag">${sucursal.categoria}</span>
            <h2>${sucursal.nombre}</h2>
            <p>${sucursal.descripcion}</p>
            </div>
            </article>
            </a>
            `;
        });
    }
}

async function buscarSucursales() {
    try {
        const response = await fetch(`http://localhost:8080/sucursales/listar`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

async function renderCategorias() {
    const container = document.getElementById("category-container");

    if (container) {

        const categoiras = await buscarCategorias();

        categorias.forEach(c => {

            container.innerHTML +=
                `
            <div class="categoria-item">
                <button class="btn-categoria-item" id="${c.id}">${c.categoria}</button>
            </div>
            `;
        });


    }

}

async function buscarCategorias(){
    try {
        const response = await fetch(`http://localhost:8080/categorias`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }

}


/*
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
    if (containerLeft) {
        containerLeft.innerHTML = categorias.map(c => `
          
        `).join('');
    }
}
categoriasDisponibles();
*/

