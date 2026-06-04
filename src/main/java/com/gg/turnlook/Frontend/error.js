
renderError();

function renderError(){

    
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    document.getElementById("error-msg").textContent = msg || "Ocurrió un error desconocido";
    
    const container = document.getElementById("msg-error");
    
    if(container){
        
        container.innerHTML = 
        `
        
        
        `
        
        
    }
}


/* Por ejemplo para ponerlo

function buscarEmpleados() {
    fetch('/api/empleados')
        .then(res => {
            if (res.status === 403) {
                window.location.href = `/error.html?msg=No tenés permisos para ver los empleados`;
            } else if (res.status === 404) {
                window.location.href = `/error.html?msg=No se encontraron empleados`;
            } else if (!res.ok) {
                window.location.href = `/error.html?msg=Error inesperado (código ${res.status})`;
            }
            return res.json();
        })
        .then(empleados => {
            cargarEmpleados(empleados);
        })
        .catch(error => {
            window.location.href = `/error.html?msg=${encodeURIComponent(error.message)}`;
        });
}

*/



