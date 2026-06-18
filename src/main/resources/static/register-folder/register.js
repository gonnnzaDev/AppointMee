import { API_URL, checkRes } from "../recursos/modulos.js";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


renderRegister();

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
        } else if (!emailRegex.test(mail)) {
            alert("Mail inválido");
        } else if (pass1.length < 8) {
            alert("La contraseña debe tener mínimo 8 caracteres");
        } else if (pass1 !== pass2) {
            alert("Las contraseñas no coinciden");
        } else {
            postUser(name, surname, mail, pass1);
        }
    });
}

const cancelButton = document.getElementById("cancel-button");

if (cancelButton) {
    cancelButton.addEventListener("click", () => {
        window.location.href = "../login-folder/Login.html";
    });
}
function postUser(name, surname, mail, pass) {


    fetch(API_URL + "/usuarios/crear", {
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
    }).then(async response => { await checkRes(response); return response; })
        .then(data => {
            alert("Registrado con exito!");
            window.location.href = "../login-folder/Login.html";

        })
        .catch(error => {
            alert(error);
        });
}


function renderRegister() {

    const container = document.getElementById("register-form")

    if (container) {

        container.innerHTML = `
        <div class="form" id="info-register">
            <div class="credentials-form" id="realizar-registro-button">
                <h2 class="login-title">Crear cuenta</h2>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Nombre" id="register-name-input">
                </div>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Apellido" id="register-surname-input">
                </div>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Email" id="register-mail-input">
                </div>
                <div class="input-group">
                    <input type="password" class="form-control" placeholder="Contraseña" id="register-password1-input">
                </div>
                <div class="input-group">
                    <input type="password" class="form-control" placeholder="Confirmar Contraseña" id="register-password2-input">
                </div>
                <div class="login-actions">
                    <button type="button" id="register-person">Crear Cuenta</button>
                    <button type="button" id="cancel-button">Volver a Login</button>
                </div>
            </div>
        </div>
        `
    }

}