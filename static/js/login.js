window.addEventListener('load', () => {
    const buttonSubmit = document.getElementById("login__button-submit");


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


    })
})