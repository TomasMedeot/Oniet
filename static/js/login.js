window.addEventListener('load', () => {
    const loginTitle = document.getElementById("login__title");

    const adminHello = document.getElementById("admin__hello");

    const buttonSubmit = document.getElementById("login__button-submit");

    const loginMain = document.getElementById("login__main");
    const adminMain = document.getElementById("admin__main");

    const loginHeader = document.getElementById("login__header");
    const adminHeader = document.getElementById("admin__header");

    const btnAddCatalog = document.getElementById("admin__form-add-button");
    const btnUpdateCatalog = document.getElementById("admin__form-update-button");
    
    
    // STADISTICS
    const btnShowChart = document.getElementById("admin__stats-btn-show-chart");
    let myChart;

    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [{
                label: `Example`,
                data: [],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    const login = (data) => {
        const {user} = data;

        localStorage.setItem('logged', true);
        localStorage.setItem('name', user[1]);
        localStorage.setItem('path', 'admin');

        const name = localStorage.getItem('name')

        loginTitle.innerHTML = "Admin"
        adminHello.innerHTML = `Hola, ${name}`

        loginMain.classList.remove('show');
        loginMain.classList.add('hidden');

        adminMain.classList.remove('hidden');
        adminMain.classList.add('show');

        loginHeader.classList.add('hidden');
        loginHeader.classList.remove('show');

        adminHeader.classList.add('show');
        adminHeader.classList.remove('hidden');
    }

    const doGet = async(url = '') => {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-type": "application/json; charset=UTF-8"},
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const doPost = async(url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // LOGIN ADMIN

    // Login Button
    buttonSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById("login__email-input").value
        const pass = document.getElementById("login__pass-input").value
        
        if (email !== '') {
            document.getElementById("email-required").classList.remove("show")
        } else {
            document.getElementById("email-required").classList.add("show")
        }

        if (pass !== '') {
            document.getElementById("pass-required").classList.remove("show")
        } else {
            document.getElementById("pass-required").classList.add("show")
        }

        let _datos = {
            email: email,
            password: pass,
            action: "login"
        }
        

        if (email !== '' && pass !== '') {
            doPost('http://192.168.2.251/admin', _datos)
            .then((data) => {
                if (data.logged) {
                    login(data);

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
                }
            });
            
        }
    })

    // ADMIN CATALOG

    // Add Product Button
    btnAddCatalog.addEventListener('click', (e) => {
        e.preventDefault();

        const formName = document.getElementById("admin__form-input-name");
        const formDesc = document.getElementById("admin__form-input-desc");
        const formPrice = document.getElementById("admin__form-input-price");

        const name = formName.value;
        const desc = formDesc.value;
        const price = formPrice.value;


        if (name !== '') {
            document.getElementById("admin__form-name-required").hidden = true
        } else {
            document.getElementById("admin__form-name-required").hidden = false
        }
        if (desc !== '') {
            document.getElementById("admin__form-desc-required").hidden = true
        } else {
            document.getElementById("admin__form-desc-required").hidden = false
        }
        if (price !== '') {
            document.getElementById("admin__form-price-required").hidden = true
        } else {
            document.getElementById("admin__form-price-required").hidden = false
        }

        let _datos = {
            name: name,
            description: desc,
            price: price,
            action: "add"
        }
        

        if (name !== '' && desc !== '' && price !== '') {
            doPost('http://192.168.2.251/api/catalog', _datos)
            .then((data) => {
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
                                <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#formModalUpdate" onclick="updateProduct(${product.id})">Editar</button>
                            </div>
                            <div class="col-1">
                            <button class="btn btn-danger mx-2" onclick="deleteProduct(${product.id})">Borrar</button>
                            </div>
                        </div>
                        `
                        catalog_list.appendChild(li);
                    })
                });
            });

            formName.value = "";
            formDesc.value = "";
            formPrice.value = "";

            window.location.reload();
        }
    })


    // STADISTICS
    let route = '0';
    const inputRoute = document.getElementById("admin__stats-input-route");
    inputRoute.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputRoute.value == "host") {
            route = "http://192.168.2.251/api/host/estadistics";

            if (comparation === "no") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = true
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
    
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                }
            } else if (comparation === "yes") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    document.getElementById("admin__stats-input-day-two").hidden = false
                }
            }

            document.getElementById("admin__stats-input-methric").hidden = false
            document.getElementById("admin__stats-input-comparation").hidden = false
        } else if (inputRoute.value == "general") {
            route = "http://192.168.2.251/api/general/estadistics";

            if (comparation === "no") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year-two").hidden = true
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = true
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
    
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false

                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                }
            } else if (comparation === "yes") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    document.getElementById("admin__stats-input-day-two").hidden = false
                }
            }

            document.getElementById("admin__stats-input-methric").hidden = false
            document.getElementById("admin__stats-input-comparation").hidden = false
        } else if (inputRoute.value == "product") {
            route = "http://192.168.2.251/api/product/estadistics";

            document.getElementById("admin__stats-input-methric").hidden = true
            document.getElementById("admin__stats-input-comparation").hidden = true

            document.getElementById("admin__stats-row-title").hidden = true
            document.getElementById("admin__stats-input-year").hidden = true
            document.getElementById("admin__stats-input-month").hidden = true
            document.getElementById("admin__stats-input-day").hidden = true
            
            document.getElementById("admin__stats-row-title-two").hidden = true
            document.getElementById("admin__stats-input-year-two").hidden = true
            document.getElementById("admin__stats-input-month-two").hidden = true
            document.getElementById("admin__stats-input-day-two").hidden = true
        }else {
            route = "0";

            document.getElementById("admin__stats-input-methric").hidden = true
            document.getElementById("admin__stats-input-comparation").hidden = true
            
            document.getElementById("admin__stats-row-title").hidden = true
            document.getElementById("admin__stats-input-year").hidden = true
            document.getElementById("admin__stats-input-month").hidden = true
            document.getElementById("admin__stats-input-day").hidden = true
            
            document.getElementById("admin__stats-row-title-two").hidden = true
            document.getElementById("admin__stats-input-year-two").hidden = true
            document.getElementById("admin__stats-input-month-two").hidden = true
            document.getElementById("admin__stats-input-day-two").hidden = true
        }
    });

    let methric = '0';
    const inputMethric = document.getElementById("admin__stats-input-methric");
    inputMethric.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputMethric.value !== "0") {
            methric = inputMethric.value;
            if (comparation === "no") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = true
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
    
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                }
            } else if (comparation === "yes") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    document.getElementById("admin__stats-input-day-two").hidden = false
                }
            }

        } else {
            methric = "0";
            document.getElementById("admin__stats-row-title").hidden = true
            document.getElementById("admin__stats-input-year").hidden = true
            document.getElementById("admin__stats-input-month").hidden = true
            document.getElementById("admin__stats-input-day").hidden = true
            
            document.getElementById("admin__stats-row-title-two").hidden = true
            document.getElementById("admin__stats-input-year-two").hidden = true
            document.getElementById("admin__stats-input-month-two").hidden = true
            document.getElementById("admin__stats-input-day-two").hidden = true
        }
    });

    let comparation = '0';
    const inputComparation = document.getElementById("admin__stats-input-comparation");
    inputComparation.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputComparation.value !== "0") {
            comparation = inputComparation.value;
            if (comparation === "no") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = true
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
    
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = true
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = true
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = false
                    document.getElementById("admin__stats-input-day-two").hidden = true
                }
            } else if (comparation === "yes") {
                if (methric === "year") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
    
                    document.getElementById("admin__stats-input-month").hidden = true
                    document.getElementById("admin__stats-input-month-two").hidden = true
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
                } else if (methric === "month") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
    
                    document.getElementById("admin__stats-input-day").hidden = true
                    document.getElementById("admin__stats-input-day-two").hidden = true
    
                } else if (methric === "day") {
                    document.getElementById("admin__stats-row-title").hidden = false
                    document.getElementById("admin__stats-row-title-two").hidden = false
                    document.getElementById("admin__stats-input-year").hidden = false
                    document.getElementById("admin__stats-input-year-two").hidden = false
                    document.getElementById("admin__stats-input-month").hidden = false
                    document.getElementById("admin__stats-input-month-two").hidden = false
                    document.getElementById("admin__stats-input-day").hidden = false
                    document.getElementById("admin__stats-input-day-two").hidden = false
                }
            }
        } else {
            comparation = "0";
            document.getElementById("admin__stats-row-title").hidden = true
            document.getElementById("admin__stats-row-title-two").hidden = true
            document.getElementById("admin__stats-input-year").hidden = true
            document.getElementById("admin__stats-input-year-two").hidden = true
            document.getElementById("admin__stats-input-month").hidden = true
            document.getElementById("admin__stats-input-month-two").hidden = true
            document.getElementById("admin__stats-input-day").hidden = true
            document.getElementById("admin__stats-input-day-two").hidden = true
        }
    });

    let year = '0';
    const inputYear = document.getElementById("admin__stats-input-year");
    inputYear.addEventListener('change', (e) => {
        e.preventDefault();
        if (Math.sign(inputYear.value) === 1) {
            year = parseInt(inputYear.value);
        } else {
            year = "0";
        }
    });

    let month = '0';
    const inputMonth = document.getElementById("admin__stats-input-month");
    inputMonth.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputMonth.value !== "0") {
            month = parseInt(inputMonth.value);
        } else {
            month = "0";
        }
    });

    let day = '0';
    const inputDay = document.getElementById("admin__stats-input-day");
    inputDay.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputDay.value !== "0") {
            day = parseInt(inputDay.value);
        } else {
            day = "0";
        }
    });

    let yearTwo = '0';
    const inputYearTwo = document.getElementById("admin__stats-input-year-two");
    inputYearTwo.addEventListener('change', (e) => {
        e.preventDefault();
        if (Math.sign(inputYearTwo.value) === 1) {
            yearTwo = parseInt(inputYearTwo.value);
        } else {
            yearTwo = "0";
        }
    });

    let monthTwo = '0';
    const inputMonthTwo = document.getElementById("admin__stats-input-month-two");
    inputMonthTwo.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputMonthTwo.value !== "0") {
            monthTwo = parseInt(inputMonthTwo.value);
        } else {
            monthTwo = "0";
        }
    });

    let dayTwo = '0';
    const inputDayTwo = document.getElementById("admin__stats-input-day-two");
    inputDayTwo.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputDayTwo.value !== "0") {
            dayTwo = parseInt(inputDayTwo.value);
        } else {
            dayTwo = "0";
        }
    });

    // Show Chart Button
    btnShowChart.addEventListener('click', (e) => {
        e.preventDefault();

        let _datos = {
            "type": methric,
            "year": year,
            "month": month,
            "day": day
        };
    
        let _datosTwo = {
            "type": methric,
            "year": yearTwo,
            "month": monthTwo,
            "day": dayTwo
        };

        if (route !== "0" && inputRoute.value !== "product") {
            if (comparation === "no") {
                doPost(route, _datos)
                .then((data) => {
                    const escale = data.status[1].escale;
                    const months = Object.keys(data.status[0])
                    let values = Object.values(data.status[0])
                    values = [
                        ...values,
                        escale
                    ]
        
                    const ctx = document.getElementById('myChart').getContext('2d');
                    if (myChart) {
                        myChart.destroy();
                    }
                    myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: months.map((month) => month),
                            datasets: [{
                                label: `${year}/${month}/${day}`,
                                data: values.map((value) => value),
                                backgroundColor: [
                                    'rgba(153, 102, 255, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(153, 102, 255, 1)',
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
            } else if (comparation === "yes") {
                let escale;
                let months;
                let values;
                let escaleTwo;
                let monthsTwo;
                let valuesTwo;

                doPost(route, _datos)
                .then((data) => {
                    escale = data.status[1].escale;
                    months = Object.keys(data.status[0])
                    values = Object.values(data.status[0])
                    values = [
                        ...values,
                        escale
                    ]

                    doPost(route, _datosTwo)
                    .then((data) => {
                        escaleTwo = data.status[1].escale;
                        monthsTwo = Object.keys(data.status[0])
                        valuesTwo = Object.values(data.status[0])
                        valuesTwo = [
                            ...valuesTwo,
                            escaleTwo
                        ]
            
                        const ctx = document.getElementById('myChart').getContext('2d');
                        if (myChart) {
                            myChart.destroy();
                        }
                        myChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: months.map((month) => month),
                                datasets: [
                                    {
                                        label: `${year}/${month}/${day}`,
                                        data: values.map((value) => value),
                                        backgroundColor: [
                                            'rgba(153, 102, 255, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgba(153, 102, 255, 1)',
                                        ],
                                        borderWidth: 1
                                    },
                                    {
                                        label: `${yearTwo}/${monthTwo}/${dayTwo}`,
                                        data: valuesTwo.map((valueTwo) => valueTwo),
                                        backgroundColor: [
                                            'rgba(255, 205, 86, 0.2)',
                                        ],
                                        borderColor: [
                                            'rgb(255, 205, 86)',
                                        ],
                                        borderWidth: 1
                                    }
                                ]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    });
                });
            }
        } else if (inputRoute.value === "product") {
            doGet(route)
            .then((data) => {

                const ctx = document.getElementById('myChart').getContext('2d');
                if (myChart) {
                    myChart.destroy();
                }
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.status.map((product) => product.name),
                        // labels: months.map((month) => month),
                        datasets: [{
                            label: 'Clicks por producto',
                            // label: `${year}/${month}/${day}`,
                            data: data.status.map((product) => product.visualitions),
                            // data: values.map((value) => value),
                            backgroundColor: [
                                'rgba(153, 102, 255, 0.2)',
                            ],
                            borderColor: [
                                'rgba(153, 102, 255, 1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            });
        }
    })
})