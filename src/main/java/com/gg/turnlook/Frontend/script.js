const gradient = document.querySelector(".gradient");

function onMouseMove(event) {
  gradient.style.backgroundImage = 'radial-gradient(at ' + event.clientX + 'px ' + event.clientY + 'px, rgba(60, 3, 167, 0.9) 0, #905fe9 100%)';
}
document.addEventListener("mousemove", onMouseMove);

document.getElementById("Navbar").innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar scroll</a>

        <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll">

            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarScroll">

            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">

                <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

            </ul>

            <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search">

                <button class="btn btn-outline-success" type="submit">
                    Search
                </button>
            </form>

        </div>
    </div>
</nav>
`;


