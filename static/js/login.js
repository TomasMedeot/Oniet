window.addEventListener('load', () => {
    const loginTitle = document.getElementById("login__title");

    const adminHello = document.getElementById("admin__hello");

    const buttonSubmit = document.getElementById("login__button-submit");

    const loginMain = document.getElementById("login__main");
    const adminMain = document.getElementById("admin__main");

    const loginHeader = document.getElementById("login__header");
    const adminHeader = document.getElementById("admin__header");

    const btnAddCatalog = document.getElementById("admin__form-add-button");
    
    const btnShowChart = document.getElementById("admin__stats-btn-show-chart");

    const login = (data) => {
        const {user} = data;

        console.log(user);
        localStorage.setItem('logged', true);
        localStorage.setItem('name', user[0][1]);

        const name = localStorage.getItem('name')

        loginTitle.innerHTML = "Admin"
        adminHello.innerHTML = `Hola, ${name}`

        loginMain.classList.remove('show');
        loginMain.classList.add('hidden');

        adminMain.classList.remove('hidden');
        adminMain.classList.add('show');

        loginHeader.classList.add('hidden');
        adminHeader.classList.add('show');

        
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
        
        console.log(_datos);

        if (email !== '' && pass !== '') {
            doPost('http://localhost:5000/admin', _datos)
            .then((data) => {
                console.log(data);
                console.log(data.user[0][1]);
                if (data.logged) {
                    login(data);

                    // Fill catalog dinamically
                    doGet('http://localhost:5000/api/catalog')
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
                                        ${product.name} ${product.price}
                                    </div>
                                    <div class="col-1">
                                        <button class="btn btn-primary mx-2">Editar</button>
                                    </div>
                                    <div class="col-1">
                                    <button class="btn btn-danger mx-2">Borrar</button>
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

    btnAddCatalog.addEventListener('click', (e) => {
        e.preventDefault();

        const formName = document.getElementById("admin__form-input-name");
        const formDesc = document.getElementById("admin__form-input-desc");
        const formPrice = document.getElementById("admin__form-input-price");

        const name = formName.value;
        const desc = formDesc.value;
        const price = formPrice.value;

        console.log("Click add")

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
        
        console.log(_datos);

        if (name !== '' && desc !== '' && price !== '') {
            doPost('http://localhost:5000/api/catalog', _datos)
            .then((data) => {
                console.log(data);
                // Fill catalog dinamically
                doGet('http://localhost:5000/api/catalog')
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
                                    ${product.name} ${product.price}
                                </div>
                                <div class="col-1">
                                    <button class="btn btn-primary mx-2">Editar</button>
                                </div>
                                <div class="col-1">
                                <button class="btn btn-danger mx-2">Borrar</button>
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
        }
    })

    btnShowChart.addEventListener('click', (e) => {
        e.preventDefault();

        doPost('http://localhost:5000/api/general/estadistics', {
            "type": "year",
            "year": 2020
        })
        .then((data) => {
            console.log(data);
            const escale = data.status[1].escale;
            console.log(escale)
            const months = Object.keys(data.status[0])
            console.log(months)
            let values = Object.values(data.status[0])
            values = [
                ...values,
                escale
            ]

            console.log(values)
            console.log(values.map((value, index) => value))
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months.map((month, index) => month),
                    datasets: [{
                        label: '# of Votes',
                        data: values.map((value, index) => value),
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

    })
})