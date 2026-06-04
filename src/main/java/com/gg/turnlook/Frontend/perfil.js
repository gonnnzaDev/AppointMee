function renderMyProfile(usuario) {

    const infoAccountDiv = document.getElementById("info-account");

    if (infoAccountDiv) {

        infoAccountDiv.innerHTML = `    
    <div class="profile-card">
    
    
    <img src="https://i.pinimg.com/236x/63/25/10/632510e53b3ae17f36993d7993c9fe8f.jpg" alt="">
    <h3>Nombre: ${usuario.nombre}</h3>
    <h3>Apellido: ${usuario.apellido}</h3>
    <h3>Email: ${usuario.email}</h3>
    <h3>Fecha De Creacion: ${usuario.fechaCreacion}</h3>
    <button type="button" class="btn btn-danger">Eliminar</button>
    
    </div>
    `;
    }
}


function getUser(id) {
    fetch(`http://localhost:8080/usuarios/${id}`)
        .then(async res => {
            if (!res.ok) {
                throw new Error("Error del servidor");
            }
            return res.json();
        })
        .then(usuario => {
            renderMyProfile(usuario);
        })
        .catch(error => {
            alert(error);
        });
}
