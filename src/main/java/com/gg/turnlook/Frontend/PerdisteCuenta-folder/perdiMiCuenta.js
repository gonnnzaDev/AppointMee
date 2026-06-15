const cancelar = document.getElementById("cancelar");
const enviar = document.getElementById("enviar");
const email = document.getElementById("email-denuncia-input").value;
const descripcion = document.getElementById("descripcion-denuncia-input").value;
const pass = document.getElementById("pass-denuncia-input").value;


if (!cancelar || !enviar || !email || !descripcion || !pass) return;

if (email === "") {

    alert("El email es obligatorio");

}
if (descripcion === "") {
    alert("La descripcion es obligatoria");

}

enviar.addEventListener(e => {

    if (email !== "" && descripcion !== "") {
        postFormulario(email, descripcion, pass);
    }

});


function postFormulario(email, descripcion, pass) {


    //poner bien el post
    fetch("http://localhost:8080/usuarios/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: pass,
            descripcion: descripcion,
        })
    }).then(data => {
        alert("Realizado con exito!");

    })
        .catch(error => {
            alert(error);
        });
}







