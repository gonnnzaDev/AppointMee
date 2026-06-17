const cancelar = document.getElementById("cancelar");
const enviar = document.getElementById("enviar");


if (!cancelar || !enviar) {
    window.history.back();

};



enviar.addEventListener('click', e => {
alert("hola");
});
cancelar.addEventListener('click', e => {

    window.history.back();

});









