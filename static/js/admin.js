window.addEventListener('load', () => {
    const loginTitle = document.getElementById("login__title");

    const adminHello = document.getElementById("admin__hello");
    const adminStatsHello = document.getElementById("admin__stats-hello");
    
    const buttonCatalogo = document.getElementById("admin__button-catalogo");
    const buttonEstadisticas = document.getElementById("admin__button-estadisticas");
    const buttonLogout = document.getElementById("admin__button-logout");

    const loginHeader = document.getElementById("login__header");
    const adminHeader = document.getElementById("admin__header");
    
    const loginMain = document.getElementById("login__main");
    const adminMain = document.getElementById("admin__main");
    const adminStats = document.getElementById("admin__stats");

    const name = localStorage.getItem('name')
    const logged = localStorage.getItem('logged')
    const path = localStorage.getItem('path')

    const doGet = async(url = '') => {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-type": "application/json; charset=UTF-8"},
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        if (logged === "true") {
            if (path === 'admin') {
                loginTitle.innerHTML = "Admin"
                adminHello.innerHTML = `Hola, ${name}`
    
                loginMain.classList.remove('show');
                loginMain.classList.add('hidden');
    
                adminMain.classList.remove('hidden');
                adminMain.classList.add('show');
    
                adminStats.classList.add('hidden');
                adminStats.classList.remove('show');
    
                loginHeader.classList.add('hidden');
                adminHeader.classList.add('show');
    
                // Fill catalog dinamically
                doGet('http://192.168.2.251/api/catalog')
                .then((data) => {
                    const catalog_list = document.getElementById("admin__catalog-list");
                    catalog_list.innerHTML = "";
    
                    const catalog = data.catalog
                    catalog.forEach(product => {
                        const li = document.createElement("li");
                        li.className = "list-group-item";
                        li.innerHTML = `
                            <div class="row">
                                <div class="col-10">
                                    ${product.name} $${product.price}
                                </div>
                                <div class="col-1">
                                    <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#formModalUpdate${product.id}">Editar</button>
                                    <!-- Update Form -->
                                    <div class="modal fade" id="formModalUpdate${product.id}" tabindex="-1" aria-labelledby="formModalLabelUpdate" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="formModalLabelUpdate">Editar Producto</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form>
                                                    <div class="mb-3">
                                                        <label for="admin__form-update-input-name${product.id}" class="form-label">Nombre</label>
                                                        <input type="text" class="form-control" id="admin__form-update-input-name${product.id}" aria-describedby="emailHelp" value="${product.name}" required>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="admin__form-update-input-desc${product.id}" class="form-label">Descripción</label>
                                                        <input type="text" class="form-control" id="admin__form-update-input-desc${product.id}" value="${product.description}" required>
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="admin__form-update-input-price${product.id}" class="form-label">Precio</label>
                                                        <input type="number" class="form-control" id="admin__form-update-input-price${product.id}" value="${product.price}" required>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="button" class="btn btn-primary" id="admin__form-update-button${product.id}" onclick="updateProduct(${product.id})">Guardar</button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1">
                                <button class="btn btn-danger mx-2" onclick="deleteProduct(${product.id})">Borrar</button>
                                </div>
                            </div>
                        `
                        catalog_list.appendChild(li);
                    })
                });
            } else if (path === 'stats') {
                adminMain.classList.remove('show');
                adminMain.classList.add('hidden');
    
                loginMain.classList.remove('show');
                loginMain.classList.add('hidden');
    
                adminStats.classList.add('show');
                adminStats.classList.remove('hidden');
    
                loginHeader.classList.add('hidden');
                adminHeader.classList.add('show');

                loginTitle.innerHTML = "Estadisticas"
            }
        } else if (logged === "false") {
            adminMain.classList.remove('show');
            adminMain.classList.add('hidden');
    
            loginMain.classList.add('show');
            loginMain.classList.remove('hidden');
    
            adminStats.classList.add('hidden');
            adminStats.classList.remove('show');
    
            loginHeader.classList.add('show');
            adminHeader.classList.add('hidden');
            
        }
    } else {
        console.info( "This page is not reloaded");
    }
    
    

    buttonCatalogo.addEventListener('click', (e) => {
        e.preventDefault();
        adminMain.classList.remove('hidden');
        adminMain.classList.add('show');

        adminStats.classList.add('hidden');
        adminStats.classList.remove('show');

        localStorage.setItem('path', 'admin');

        const name = localStorage.getItem('name');
        loginTitle.innerHTML = "Admin";
        adminHello.innerHTML = `Hola, ${name}`;

        // Fill catalog dinamically
        doGet('http://192.168.2.251/api/catalog')
        .then((data) => {
            const catalog_list = document.getElementById("admin__catalog-list");
            catalog_list.innerHTML = "";

            const catalog = data.catalog
            catalog.forEach(product => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="row">
                        <div class="col-10">
                            ${product.name} $${product.price}
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#formModalUpdate${product.id}">Editar</button>
                            <!-- Update Form -->
                            <div class="modal fade" id="formModalUpdate${product.id}" tabindex="-1" aria-labelledby="formModalLabelUpdate" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="formModalLabelUpdate">Editar Producto</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-name${product.id}" class="form-label">Nombre</label>
                                                <input type="text" class="form-control" id="admin__form-update-input-name${product.id}" aria-describedby="emailHelp" value="${product.name}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-desc${product.id}" class="form-label">Descripción</label>
                                                <input type="text" class="form-control" id="admin__form-update-input-desc${product.id}" value="${product.description}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-price${product.id}" class="form-label">Precio</label>
                                                <input type="number" class="form-control" id="admin__form-update-input-price${product.id}" value="${product.price}" required>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" class="btn btn-primary" id="admin__form-update-button${product.id}" onclick="updateProduct(${product.id})">Guardar</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-1">
                        <button class="btn btn-danger mx-2" onclick="deleteProduct(${product.id})">Borrar</button>
                        </div>
                    </div>
                `
                catalog_list.appendChild(li);
            })
        });
    })

    buttonEstadisticas.addEventListener('click', (e) => {
        e.preventDefault();
        adminMain.classList.remove('show');
        adminMain.classList.add('hidden');

        adminStats.classList.add('show');
        adminStats.classList.remove('hidden');

        localStorage.setItem('path', 'stats');

        const name = localStorage.getItem('name')
        loginTitle.innerHTML = "Estadisticas"
        adminStatsHello.innerHTML = `Hola, ${name}`

        // Fill catalog dinamically
        doGet('http://192.168.2.251/api/catalog')
        .then((data) => {
            const catalog_list = document.getElementById("admin__catalog-list");
            catalog_list.innerHTML = "";

            const catalog = data.catalog
            catalog.forEach(product => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="row">
                        <div class="col-10">
                            ${product.name} $${product.price}
                        </div>
                        <div class="col-1">
                            <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#formModalUpdate${product.id}">Editar</button>
                            <!-- Update Form -->
                            <div class="modal fade" id="formModalUpdate${product.id}" tabindex="-1" aria-labelledby="formModalLabelUpdate" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="formModalLabelUpdate">Editar Producto</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-name${product.id}" class="form-label">Nombre</label>
                                                <input type="text" class="form-control" id="admin__form-update-input-name${product.id}" aria-describedby="emailHelp" value="${product.name}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-desc${product.id}" class="form-label">Descripción</label>
                                                <input type="text" class="form-control" id="admin__form-update-input-desc${product.id}" value="${product.description}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="admin__form-update-input-price${product.id}" class="form-label">Precio</label>
                                                <input type="number" class="form-control" id="admin__form-update-input-price${product.id}" value="${product.price}" required>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" class="btn btn-primary" id="admin__form-update-button${product.id}" onclick="updateProduct(${product.id})">Guardar</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-1">
                        <button class="btn btn-danger mx-2" onclick="deleteProduct(${product.id})">Borrar</button>
                        </div>
                    </div>
                `
                catalog_list.appendChild(li);
            })
        });
    })

    buttonLogout.addEventListener('click',  (e) => {
        e.preventDefault();

        localStorage.setItem('logged', 'false');
        localStorage.setItem('name', '');
        localStorage.setItem('path', '');

        window.location.reload();            
    });
})
