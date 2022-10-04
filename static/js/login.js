window.addEventListener('load', () => {
    const loginTitle = document.getElementById("login__title");

    const buttonSubmit = document.getElementById("login__button-submit");
    const buttonRegister = document.getElementById("login__button-register");
    const buttonLogin = document.getElementById("register__button-login");

    const registerMain = document.getElementById("register__main");
    const loginMain = document.getElementById("login__main");
    const adminMain = document.getElementById("admin__main");
    
    const loginHeader = document.getElementById("login__header");
    const adminHeader = document.getElementById("admin__header");


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
            doPost('http://192.168.60.12:5000/admin', _datos)
            .then((data) => {
                if (true) {
                    console.log("logged")
                    loginTitle.innerHTML = "Admin"

                    loginMain.classList.remove('show');
                    loginMain.classList.add('hidden');

                    adminMain.classList.remove('hidden');
                    adminMain.classList.add('show');

                    loginHeader.classList.add('hidden');
                    adminHeader.classList.add('show');
                    // window.location.assign('http://192.168.60.16:5000/home');
                }
                console.log(data);
            });
            
        }
    })

    buttonRegister.addEventListener('click', (e) => {
        e.preventDefault();
        
        loginTitle.innerHTML = "Registro";

        registerMain.classList.add('show');
        registerMain.classList.remove('hidden');

        loginMain.classList.add('hidden');
        loginMain.classList.remove('show');

        adminMain.classList.add('hidden');
        adminMain.classList.remove('show');

    })

    buttonLogin.addEventListener('click', (e) => {
        e.preventDefault();
        
        loginTitle.innerHTML = "Login";

        registerMain.classList.add('hidden');
        registerMain.classList.remove('show');
        
        loginMain.classList.add('show');
        loginMain.classList.remove('hidden');

        adminMain.classList.add('hidden');
        adminMain.classList.remove('show');
    })
})