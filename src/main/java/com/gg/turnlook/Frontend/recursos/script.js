const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regla q todos los email deben cumplir

const navbar = document.getElementById("navbar");
//Esto es para modularizar el navbar

if (navbar) {

    navbar.innerHTML = `

<nav class="navbar navbar-expand-sm border-bottom border-body" data-bs-theme="dark">
    <div class="container">
        <a class="navbar-brand" href="#">
        <img src="https://cdn.discordapp.com/attachments/1492334072901533747/1502155047633424504/content.png?ex=69feae68&is=69fd5ce8&hm=373d791a61c3ae304c7d324ffe6da30d02ae77d062898b8284aacd23271ea4fb"></a>
        
        <h2>AppointMee</h2>

        <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll">

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
</svg>

        </button>

        <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Busca tu proximo turno...">

                <button class="btn btn-outline-success" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
                </button>
            </form>

        <div class="collapse navbar-collapse" id="navbarScroll">

            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">

                <li class="nav-item">
                    <a class="nav-link active" href="Index.html">Home</a>
                </li>

                  <li class="nav-item">
                    <a class="nav-link " href="Perfil.html">Perfil</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

            </ul>

            

        </div>
    </div>
</nav>
`;
}





