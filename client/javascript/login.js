document.querySelector("#togglePassword").addEventListener("click", (e) => {
    let input = document.querySelector("#password");
    if (input.type == "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
});

document.querySelector("#sign-in").addEventListener("click", (e) => {
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
        if (loginRequest()) {

        } else {
            
        }
    }
});

async function loginRequest(userName, password) {
    const url = "/api/login";
    try {
        const response = await fetch(url, {method: "POST"});

        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }
}