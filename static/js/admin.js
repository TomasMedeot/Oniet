window.addEventListener('load', () => {
    const buttonCatalogo = document.getElementById("admin__button-catalogo");
    const buttonEstadisticas = document.getElementById("admin__button-estadisticas");

    const adminMain = document.getElementById("admin__main");
    const adminStats = document.getElementById("admin__stats");

    buttonCatalogo.addEventListener('click', (e) => {
        e.preventDefault();
        adminMain.classList.remove('hidden');
        adminMain.classList.add('show');

        adminStats.classList.add('hidden');
        adminStats.classList.remove('show');
    })

    buttonEstadisticas.addEventListener('click', (e) => {
        e.preventDefault();
        adminMain.classList.remove('show');
        adminMain.classList.add('hidden');

        adminStats.classList.add('show');
        adminStats.classList.remove('hidden');
    })
})