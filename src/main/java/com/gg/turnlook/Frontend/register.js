
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