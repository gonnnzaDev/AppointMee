renderRegister();




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


const realizarRegistroBoton = document.getElementById("realizar-registro-button");

if (realizarRegistroBoton) {
    realizarRegistroBoton.addEventListener("click", cargarUsuarios);
}

function cargarUsuarios() {


    const name = document.getElementById("register-name-input").value;
    const surname = document.getElementById("register-surname-input").value;
    const mail = document.getElementById("register-mail-input").value;
    const pass1 = document.getElementById("register-password1-input").value;
    const pass2 = document.getElementById("register-password2-input").value;

    if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden");
        return;
    }
    if (name.trim() === "") {
        alert("El nombre no puede estar vacio");
        return;
    }
    if (surname.trim() === "") {
        alert("El apellido no puede estar vacio");
        return;
    }
    if (mail.trim() === "") {
        alert("El mail no puede estar vacio");
        return;
    }
    if (pass1.trim() === "") {
        alert("La contraseña no puede estar vacia");
        return;
    }

    postUser(name, surname, mail, pass1);

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
                        <input type="text" class="form-control" placeholder="Name" aria-label="Username"
                            aria-describedby="basic-addon1" id="register-name-input"
                            
                            id="register-name-input"
                            >
                    </div>
                    <div class="input-group mb-1">
                        <input type="text" class="form-control" placeholder="Surname" aria-label="Username"
                            aria-describedby="basic-addon1" id="register-surname-input"
                            id="register-surname-input"
                            >
                    </div>
                    <div class="input-group mb-1">
                        <input type="text" class="form-control" placeholder="Mail" aria-label="Username"
                            aria-describedby="basic-addon1" id="register-mail-input"
                            
                            id="register-mail-input">
                    </div>
                    <div class="input-group mb-1">
                        <input type="password" class="form-control" placeholder="Password" aria-label="Password"
                            aria-describedby="basic-addon1" id="register-password1-input"
                            id="register-password1-input">
                    </div>

                    <div class="input-group mb-1">
                        <input type="password" class="form-control" placeholder="Confirm Password" aria-label="Password"
                            aria-describedby="basic-addon1" id="register-password2-input"
                            id="register-password2-input">
                    </div>


                    <div class="vstack gap-1 mb-3">
                        <button type="button" id="register-button">Register</button>
                    </div>
                    <div class="vstack gap-1 mb-3">
                        <button type="button" id="cancel-button">Cancel</button>
                    </div>
                </div>
        `
    }

}