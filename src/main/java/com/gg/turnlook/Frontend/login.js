const baseApi = "http://localhost:8080/";


renderLogin();


function renderLogin() {


    const formContainer = document.getElementById("form-container");

    if (formContainer) {
        formContainer.innerHTML = `
  
       <div class="form" id="info-login">
          <div class="credentials-form">
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
              <button type="button" id="google-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-google" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
                </svg>
              </button>
              <hr>
              <button type="button" id="register-button">Register</button>
            </div>
          </div>
        </div>

        
        `;



    }
}







const botonLogin = document.getElementById("login-button");

if (botonLogin) {
    botonLogin.addEventListener("click", async function () {

        const mail = document.getElementById("login-mail-input");
        const pass = document.getElementById("password-mail-input");

        if (!emailRegex.test(mail.value)) {

            alert("Mail inválido");

        } else if (pass.value.length < 4) {

            alert("La contraseña debe tener al menos 4 caracteres");

        } else {

            const existe = await userExists(mail, pass);

            if (existe) {

                //Post y abro el index
                await fetch("usuario/inicio_sesion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: mail,
                        password: pass
                    })
                });

                window.location.href = "Index.html";

            } else {

                alert("Usuario o contraseña incorrectos");

            }
        }
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


async function userExists(mail, pass) {

    try {

        const response = await fetch(
            baseApi + "usuarios/inicio_sesion",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: mail.value,
                    pass: pass.value
                })
            }
        );

        if (!response.ok) {
            return false;
        }

        return true;

    } catch (error) {
        alert(error.message);
        return false;
    }
}

