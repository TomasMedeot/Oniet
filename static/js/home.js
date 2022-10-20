window.addEventListener('load', () => {


    const doGet = async(url = '') => {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-type": "application/json; charset=UTF-8"},
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    doGet('http://localhost:5000/api/catalog')
        .then((data) => {
            const catalog_list = document.getElementById("home__catalog-list");
            catalog_list.innerHTML = "";

            const catalog = data.catalog
            catalog.forEach(product => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="row">
                        <div class="col-10">
                            // TODO: Fix This
                            <button type="button" data-bs-toggle="modal" data-bs-target="${product.name}">${product.name} ${product.price}</button>
                            <!-- Form -->
                            <div class="modal fade" id="${product.name}" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="formModalLabel">Agregar Producto</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div>${product.name}</div>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" class="btn btn-primary" id="admin__form-add-button">Agregar</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                catalog_list.appendChild(li);
            })
        });
    
});