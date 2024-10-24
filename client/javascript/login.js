document.querySelector("#togglePassword").addEventListener("click", (e) => {
    let input = document.querySelector("#password");
    if (input.type == "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
});

let lastJsonData = undefined;

document.querySelector("#sign-in").addEventListener("click", async (e) => {
    let name = document.querySelector("#name");
    let password = document.querySelector("#password");

    if (name.value.length == 0) {
        name.style.border = "1px solid red";
    } else {
        name.style.border = "none";
    }
    if (password.value.length == 0) {
        password.style.border = "1px solid red";
    } else {
        password.style.border = "none";
    }

    if (name.value.length != 0 && password.value.length != 0) {

        const url = "/api/login";
        try {
            const response = await fetch(url, {method: "POST"});
    
            response.json().then((data) => {
                
                if (data.status == "Authorized") {
                    // Session ID lokal speichern, ...
                } else {
                    document.querySelector(".form-error").innerHTML = data.message;
                }
            })
        } catch (error) {
            console.error(error.message);
            return {
                status: "Error",
                message: "Ein Fehler ist aufgetreten!"
            };
        }
    }
});