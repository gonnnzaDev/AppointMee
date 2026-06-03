

traerSucursales();

async function traerSucursales() {
    try {
        const res = await fetch('http://localhost:8080/sucursales/listar');

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        alert('Ocurrio un error! :', error);
        return [];
    }
}


async function mostrarSucursales() {

    const sucursales = await traerSucursales();

    let sucursalesHTML = '';

    sucursales.forEach((sucursal) => {

        sucursalesHTML += renderSucursal(
            // sucursal.link,
            // sucursal.img,
            // sucursal.imgPredefinida,
            sucursal.nombre,
            sucursal.descripcion,
            sucursal.categoria
        );



    });


    const sucursalesContainer = document.getElementById('turn-container');

    if (sucursalesContainer) {

        sucursalesContainer.innerHTML = sucursalesHTML;

    }

}

// function renderSucursal(link, img, imgPredefinida, nombre, descripcion, categoria) {
function renderSucursal(nombre, descripcion, categoria) {


    /*   <a href="${link}">
                    <article class="turn-article">
                        <img src="${img}" alt="${imgPredefinida}">
                        <div class="turn-content">
                            <span class="turn-tag">${categoria}</span>
                            <h2>${nombre}</h2>
                            <p>${descripcion}</p>
                        </div>
                    </article>
                </a> */

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

