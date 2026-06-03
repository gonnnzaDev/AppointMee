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



async function userExists(mail, pass) {

    try {

        const response = await fetch(
            "http://localhost:8080/usuarios/inicio_sesion",
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