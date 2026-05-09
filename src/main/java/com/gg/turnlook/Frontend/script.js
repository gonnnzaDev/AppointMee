const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regla q todos los email deben cumplir

document.querySelector("form")?.addEventListener("submit", e => e.preventDefault());
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
                <input class="form-control me-2" type="search" placeholder="Search">

                <button class="btn btn-outline-success" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
                </button>
            </form>

        <div class="collapse navbar-collapse" id="navbarScroll">

            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">

                <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                </li>

                  <li class="nav-item">
                    <a class="nav-link " href="#">Profile</a>
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


//renderiza todo el login 
function renderLogin() {

    const container = document.getElementById("form-login");

    container.innerHTML = `
      

 <div class="login" id="info-login">
                    <img src="https://cdn.discordapp.com/attachments/1492334072901533747/1502155047633424504/content.png?ex=69feae68&is=69fd5ce8&hm=373d791a61c3ae304c7d324ffe6da30d02ae77d062898b8284aacd23271ea4fb"
                        alt="Login">

                    <h1>AppointMee</h1>
                    <div class="login-form">
                        <div class="input-group mb-1">
                            <input type="text" class="form-control" placeholder="Mail" aria-label="Username"
                                aria-describedby="basic-addon1" id="login-mail-input">
                        </div>
                        <div class="input-group mb-1">
                            <input type="password" class="form-control" placeholder="Password" aria-label="Password"
                                aria-describedby="basic-addon1" id="password-mail-input">
                        </div>


                        <div class="vstack gap-1 mb-3">
                            <button type="button" id="login-button">Login</button>
                            
                            <button type="button" id="google-button"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                                    height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
                                    <path
                                        d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                                </svg>
                            </button>
                            <hr>
                            <button type="button" id="register-button">Register</button>

                        </div>
                    </div>
                </div>
    `;



    const botonLogin = document.getElementById("login-button");

    if (botonLogin) {

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

    }
    const registerButton = document.getElementById("register-button");

    const botonGoogle = document.getElementById("google-button");

    if (botonGoogle) {

        botonGoogle.addEventListener("click", function () {
            signInWithGoogle();
        });

    }

    //Esto cambia la info del div y pone la info del register
    registerButton.addEventListener("click", renderRegister);
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
function renderRegister() {

    const container = document.getElementById("form-login");

    container.innerHTML = `
        <div class="form-register">

                            <div class="input-group mb-1">
                                <input type="text" class="form-control" placeholder="Name" aria-label="Username"
                                    aria-describedby="basic-addon1" id="register-name-input">
                            </div>
                            <div class="input-group mb-1">
                                <input type="text" class="form-control" placeholder="Surname" aria-label="Username"
                                    aria-describedby="basic-addon1" id="register-surname-input">
                            </div>
                            <div class="input-group mb-1">
                                <input type="text" class="form-control" placeholder="Mail" aria-label="Username"
                                    aria-describedby="basic-addon1" id="register-mail-input">
                            </div>
                            <div class="input-group mb-1">
                                <input type="password" class="form-control" placeholder="Password" aria-label="Password"
                                    aria-describedby="basic-addon1" id="register-password1-input">
                            </div>

                            <div class="input-group mb-1">
                                <input type="password" class="form-control" placeholder="Confirm Password"
                                    aria-label="Password" aria-describedby="basic-addon1" id="register-password2-input">
                            </div>


                            <div class="vstack gap-1 mb-3">
                                <button type="button" id="register-person">  > </button>

                            </div>
                               <div class="vstack gap-1 mb-3">
                                <button type="button" id="cancel-button">Cancel</button>

                            </div>
                        </div>
    `;


    //Aca esta la autenticacion previa a registrar una persona

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

                postUser(name, surname, mail, pass1)

            }



        });

    }
    const cancelButton = document.getElementById("cancel-button");


    if (cancelButton) {

        cancelButton.addEventListener("click", renderLogin);

    }





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
            alert("Error en registro");
            alert(error)
        });
}




//Perfil de usuario

/*
const infoAccountDiv = document.getElementById("info-account");

infoAccountDiv.innerHTML = `    
  <h1>My Account</h1>

            <h3>Nombre: </h3>
            <h3>Apellido: </h3>
            <h3>Email: </h3>
            <h3>Fecha De Creacion: </h3>

            <img src="https://i.pinimg.com/236x/63/25/10/632510e53b3ae17f36993d7993c9fe8f.jpg" alt="">
      `;

 */





function renderMyProfile() {



}
