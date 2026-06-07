const apiBaseURL = "http://localhost:8080/sucursales";

render();

async function render() {

    const container = document.getElementById("container-info-sucursal");
    if (!container) {
        return;
    }
    //Leo la id de la sucursal en la url
    const sucursalId = getSucursalIdFromUrl();

    if (!sucursalId) {
        container.innerHTML = `<p>No se encontró el ID de la sucursal en la URL.</p>`;
        return;
    }
    //busco los datos
    const sucursal = await fetchSucursal(sucursalId);


    console.log(sucursal);
    if (!sucursal) {
        container.innerHTML = `<p>No se encontró la sucursal con ID ${sucursalId}.</p>`;
        return;
    }

    const imgNoDispo = "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
    
    container.innerHTML =
     `
      <button id="btn-volver">Volver</button>
      <div class="principal-imagen-sucursal">
          <img src="${sucursal.imagen || imgNoDispo}">
      </div>

      <div class="info-sucursal">
          <h3 id="nombre-sucursal">${sucursal.nombre}</h3>
          <p id="categoria-sucursal">Categoria: ${sucursal.categoria}</p>
          <p id="descripcion-sucursal">Descripcion: ${sucursal.descripcion}</p>
          <p id="direccion-sucursal">Direccion: ${sucursal.direccion}</p>
          <p id="horario-sucursal">Horario: ${sucursal.horario}</p>
          <p id="telefono-sucursal">Telefono: ${sucursal.telefono}</p>
          
          <div class="botones-sucursal-container">
          <div class="botones-sucursal">
              <button id="btn-reservar">Reservar Servicio</button>
          </div>
          </div>
      </div>

      <div class="interior-imagenes-sucursal">
          <a href="${sucursal.imagen || imgNoDispo}">
              <img src="${sucursal.imagen || imgNoDispo}" >
              </a>
      </div>

      <div class="acciones-sucursal">
          <button id="btn-contactar">Contactar</button>
          <button id="btn-denunciar">Denunciar</button>
      </div>`;

    const btnVolver = document.getElementById('btn-volver');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => window.history.back());
    }

    const btnReservar = document.getElementById('btn-reservar');
    if (btnReservar) {

    }
}

function getSucursalIdFromUrl() {
    const queryId = new URLSearchParams(window.location.search).get('id');
    if (queryId) {
        return queryId;
    }

    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart && !Number.isNaN(Number(lastPart)) ? lastPart : null;
}

async function fetchSucursal(id) {
    try {
        const response = await fetch(`${apiBaseURL}/${id}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        alert(error);
        return null;
    }
}
