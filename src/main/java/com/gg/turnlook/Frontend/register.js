renderRegister();

// Event listener para el botón de registrarse
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

// Event listener para el botón de cancelar
const cancelButton = document.getElementById("cancel-button");

if (cancelButton) {
    cancelButton.addEventListener("click", () => {
        window.location.href = "Login.html";
    });
}
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


function renderRegister(){

    const container = document.getElementById("register-form")

    if(container){

        container.innerHTML =`
        
        <div class="form" id="info-register">
            <div class="credentials-form" id="realizar-registro-button">
                <div class="input-group mb-1">
                    <input type="text" class="form-control" placeholder="Nombre" aria-label="Name"
                        aria-describedby="basic-addon1" id="register-name-input">
                </div>
                <div class="input-group mb-1">
                    <input type="text" class="form-control" placeholder="Apellido" aria-label="Surname"
                        aria-describedby="basic-addon1" id="register-surname-input">
                </div>
                <div class="input-group mb-1">
                    <input type="text" class="form-control" placeholder="Email" aria-label="Email"
                        aria-describedby="basic-addon1" id="register-mail-input">
                </div>
                <div class="input-group mb-1">
                    <input type="password" class="form-control" placeholder="Contraseña" aria-label="Password"
                        aria-describedby="basic-addon1" id="register-password1-input">
                </div>
                <div class="input-group mb-1">
                    <input type="password" class="form-control" placeholder="Confirmar Contraseña" aria-label="Confirm Password"
                        aria-describedby="basic-addon1" id="register-password2-input">
                </div>
                <div class="vstack gap-1 mb-3">
                    <button type="button" id="register-person">Crear Cuenta</button>
                    <button type="button" id="cancel-button">Volver a Login</button>
                </div>
            </div>
        </div>
        
        `
    }

}