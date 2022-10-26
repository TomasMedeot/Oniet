window.addEventListener('load', () => {
    
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });
        return response.json();
    }
    /* fetch('http://localhost:5000/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "register",
            name: "Tomiii", 
            email: "tomicaceres70@gmail.com", 
            password: "3425252" 
        })
    }); */

    const buttonSubmit = document.getElementById("register__button-submit");

    buttonSubmit.addEventListener('click', (e) => {
        const name = document.getElementById("register__name-input");
        const email = document.getElementById("register__email-input");
        const pass = document.getElementById("register__pass-input");

        // Example POST method implementation:
        
        postData('http://192.168.2.251/admin', {
            "action": "register",
            "name": name.value, 
            "email": email.value, 
            "password": pass.value 
        })
            .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
            });
        // e.preventDefault();
        // alert("REgistrado pa");
    })
})