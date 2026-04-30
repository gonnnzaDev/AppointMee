const gradient = document.querySelector(".gradient");

function onMouseMove(event) {
  gradient.style.backgroundImage = 'radial-gradient(at ' + event.clientX + 'px ' + event.clientY + 'px, rgba(153, 153, 153, 0.9) 0, #585858 100%)';
}
document.addEventListener("mousemove", onMouseMove);
