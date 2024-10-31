// Logged in Check
let sessionID = getCookie("np_session_id");
if (sessionID != null && sessionID.length != 0) {
    window.location.href = "/";
}

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

document.querySelector(".sign-in-text").addEventListener("click", (e) => {window.location.href = "/login"});

document.querySelector(".form-wrapper").onkeydown = function (evt) {
    if (evt.key == "Enter") {
        evt.preventDefault();
        register();
    }
}

document.querySelector("#register").addEventListener("click", register);

async function register() {
    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let passwordConfirm = document.querySelector("#password-confirm");

    if (name.value.length == 0) {
        name.style.border = "1px solid red";
    } else {
        name.style.border = "none";
    }
    if (email.value.length == 0) {
        email.style.border = "1px solid red";
    } else {
        email.style.border = "none";
    }

    if (password.value.length == 0) {
        password.style.border = "1px solid red";
    } else {
        password.style.border = "none";
    }
    if (passwordConfirm.value.length == 0) {
        passwordConfirm.style.border = "1px solid red";
    } else {
        passwordConfirm.style.border = "none";
    }
    if (password.value.length != 0) {
        if (password.value != passwordConfirm.value) {
            password.style.border = "1px solid red";
            passwordConfirm.style.border = "1px solid red";
        } else {
            password.style.border = "none";
            passwordConfirm.style.border = "none";
        }
    }

    if (name.value.length != 0 && email.value.length != 0 && password.value.length != 0 && passwordConfirm.value.length != 0 && password.value == passwordConfirm.value) {

        const url = "/api/register";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        username: name.value,
                        email: email.value,
                        password: password.value,
                    }
                ),
            }
            );

            response.json().then((data) => {

                if (data.status == "Created") {
                    window.location.href = "/login";
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
}