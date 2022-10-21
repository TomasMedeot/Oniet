window.addEventListener('load', () => {
    const loginTitle = document.getElementById("login__title");

    const adminHello = document.getElementById("admin__hello");

    const buttonSubmit = document.getElementById("login__button-submit");

    const loginMain = document.getElementById("login__main");
    const adminMain = document.getElementById("admin__main");

    const loginHeader = document.getElementById("login__header");
    const adminHeader = document.getElementById("admin__header");

    const btnAddCatalog = document.getElementById("admin__form-add-button");
    
    
    // STADISTICS


    const btnShowChart = document.getElementById("admin__stats-btn-show-chart");
    let myChart;


    const login = (data) => {
        const {user} = data;

        console.log(user);
        localStorage.setItem('logged', true);
        localStorage.setItem('name', user[1]);

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
        
        console.log(_datos);

        if (email !== '' && pass !== '') {
            doPost('http://localhost:5000/admin', _datos)
            .then((data) => {
                console.log(data);
                console.log(data.user[1]);
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



    // STADISTICS
    let route = '0';
    const inputRoute = document.getElementById("admin__stats-input-route");
    inputRoute.addEventListener('change', (e) => {
        e.preventDefault();
        console.log(inputRoute.value);
        if (inputRoute.value == "host") {
            route = "http://localhost:5000/api/host/estadistics";
        } else if (inputRoute.value == "general") {
            route = "http://localhost:5000/api/general/estadistics";
        } else {
            route = "0";
        }
    });

    let methric = '0';
    const inputMethric = document.getElementById("admin__stats-input-methric");
    inputMethric.addEventListener('change', (e) => {
        e.preventDefault();
        if (inputMethric.value !== "0") {
            methric = inputMethric.value;
            if (methric === "year") {
                document.getElementById("admin__stats-input-year").hidden = false

                document.getElementById("admin__stats-input-month").hidden = true
                document.getElementById("admin__stats-input-day").hidden = true
            } else if (methric === "month") {
                document.getElementById("admin__stats-input-year").hidden = false
                document.getElementById("admin__stats-input-month").hidden = false

                document.getElementById("admin__stats-input-day").hidden = true

            } else if (methric === "day") {
                document.getElementById("admin__stats-input-year").hidden = false
                document.getElementById("admin__stats-input-month").hidden = false
                document.getElementById("admin__stats-input-day").hidden = false
            }

        } else {
            methric = "0";
            document.getElementById("admin__stats-input-year").hidden = true
            document.getElementById("admin__stats-input-month").hidden = true
            document.getElementById("admin__stats-input-day").hidden = true
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

    // Show Chart Button
    btnShowChart.addEventListener('click', (e) => {
        e.preventDefault();

        let _datos = {
            "type": methric,
            "year": year,
            "month": month,
            "day": day
        };

        console.log(route);
        console.log(_datos);
        if (route !== "0") {
            doPost(route, _datos)
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
                if (myChart) {
                    myChart.destroy();
                }
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: months.map((month) => month),
                        datasets: [{
                            label: '# of Votes',
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
        }
    })
})