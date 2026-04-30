const gradient = document.querySelector(".gradient");

function onMouseMove(event) {
  gradient.style.backgroundImage = 'radial-gradient(at ' + event.clientX + 'px ' + event.clientY + 'px, rgba(60, 3, 167, 0.9) 0, #905fe9 100%)';
}
document.addEventListener("mousemove", onMouseMove);
