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
                    ${product.name} $${product.price}
                </div>
                <div class="col-2">
                    <button type="button" onclick="viewDetailProduct(${product.id})" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#formModalDetail${product.id}">Ver detalle</button>
                    <!-- Update Form -->
                    <div class="modal fade" id="formModalDetail${product.id}" tabindex="-1" aria-labelledby="formModalLabelDetail" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5" id="formModalLabelDetail">Detalle del Producto</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h5>Nombre</h5>
                                <p>${product.name}</p>
                                <h5>Descripción</h5>
                                <p>${product.description}</p>
                                <h5>Precio</h5>
                                <p>$${product.price}</p>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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