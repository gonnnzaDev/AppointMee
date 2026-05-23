const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regla q todos los email deben cumplir

document.querySelector("form")?.addEventListener("submit", e => e.preventDefault());

getUser(1);

function getUser(id) {
    fetch(`http://localhost:8080/usuarios/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(usuario => {
            renderMyProfile(usuario);
        })
        .catch(error => {
            alert(error);
        });

}

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

const botonLogin = document.getElementById("login-button");

if (botonLogin) {
    /*
        botonLogin.addEventListener("click", function () {
    
    
            const mail = document.getElementById("login-mail-input");
            const pass = document.getElementById("password-mail-input");
    
            if (!emailRegex.test(mail.value)) {
                alert("Mail inválido");
            } else if (pass.value.length < 4) {
                alert("La contraseña debe tener al menos 4 caracteres");
            } else {
    
                userExists(mail, pass)
    
            }
    
    
    
        });
    */


    botonLogin.addEventListener("click", () => {
        window.location.href = "Index.html";

    });

}

const cancelButton = document.getElementById("cancel-button");


if (cancelButton) {

    cancelButton.addEventListener("click", () => {
        window.location.href = "Login.html";
    }

    );
}

const registerButton = document.getElementById("register-button");

if (registerButton) {

    registerButton.addEventListener("click", () => {
        window.location.href = "Register.html";
    });
}


const navbar = document.getElementById("navbar");
//Esto es para modularizar el navbar

if (navbar) {

    navbar.innerHTML = `

<nav class="navbar navbar-expand-sm border-bottom border-body" data-bs-theme="dark">
    <div class="container">
        <a class="navbar-brand" href="#">
        <img src="https://cdn.discordapp.com/attachments/1492334072901533747/1502155047633424504/content.png?ex=69feae68&is=69fd5ce8&hm=373d791a61c3ae304c7d324ffe6da30d02ae77d062898b8284aacd23271ea4fb"></a>
        
        <h2>AppointMee</h2>

        <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll">

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
</svg>

        </button>

        <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Busca tu proximo turno...">

                <button class="btn btn-outline-success" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
                </button>
            </form>

        <div class="collapse navbar-collapse" id="navbarScroll">

            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">

                <li class="nav-item">
                    <a class="nav-link active" href="Index.html">Home</a>
                </li>

                  <li class="nav-item">
                    <a class="nav-link " href="Perfil.html">Perfil</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

            </ul>

            

        </div>
    </div>
</nav>
`;
}

//Esto carga la parte principal O Login de una
renderLogin();

getUser();

//renderiza todo el login 







const botonGoogle = document.getElementById("google-button");

if (botonGoogle) {

    botonGoogle.addEventListener("click", function () {
        signInWithGoogle();
    });

}





//esta funcion la llama el boton de google es el funcionamiento

function signInWithGoogle() {

    if (typeof gapi === "undefined") {
        return;
    }

    const auth2 = gapi.auth2 ? gapi.auth2.getAuthInstance() : null;
    if (!auth2) {
        return;
    }

    auth2.signIn()
        .then(googleUser => {
            const profile = googleUser.getBasicProfile();

            const name = profile.getName();
            const email = profile.getEmail();

            console.log("Name:", name);
            console.log("Email:", email);

            // fetch
        })
        .catch(error => {
            alert("No se pudo iniciar sesión con Google.");
        });
}

window.renderGoogleButton = function () {
    if (typeof gapi === "undefined" || !gapi.load) return;

    gapi.load("auth2", function () {
        gapi.auth2.init({
            client_id: "691542888201-80r4uo4g37mugnbqld9plu2jc9josp39.apps.googleusercontent.com"
        });
    });
};




//este verifica q el usuario exista

function userExists(mail, pass) {

    return alert("Paso!");
}



//render de register para que funcione en la misma pagina q el login
const registerPerson = document.getElementById("register-person");

if (registerPerson) {

    registerPerson.addEventListener("click", function () {

        const name = document.getElementById("register-name-input").value;
        const surname = document.getElementById("register-surname-input").value;
        const mail = document.getElementById("register-mail-input").value;
        const pass1 = document.getElementById("register-password1-input").value;
        const pass2 = document.getElementById("register-password2-input").value;


        if (
            name.trim() === "" ||
            surname.trim() === "" ||
            mail.trim() === "" ||
            pass1.trim() === "" ||
            pass2.trim() === ""
        ) {
            alert("Completá todos los campos");
        }

        else if (!emailRegex.test(mail)) {
            alert("Mail inválido");
        }

        else if (pass1.length < 8) {
            alert("La contraseña debe tener mínimo 8 caracteres");
        }

        else if (pass1 !== pass2) {
            alert("Las contraseñas no coinciden");
        }

        else {

            postUser(name, surname, mail, pass1);

        }



    });

}




//esto hace el post de usuarios desde el login

function postUser(name, surname, mail, pass) {


    // testea 
    fetch("http://localhost:8080/usuarios/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: name,
            apellido: surname,
            password: pass,
            email: mail
        })
    }).then(data => {
        alert("Registrado con exito!");
    })
        .catch(error => {
            alert(error);
        });
}


