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

document.querySelector(".register-text").addEventListener("click", (e) => {window.location.href = "/register"});

document.querySelector(".form-wrapper").onkeydown = function (evt) {
    if (evt.key == "Enter") {
        evt.preventDefault();
        signIn();
    }
}

document.querySelector("#togglePassword").addEventListener("click", (e) => {
    let input = document.querySelector("#password");
    if (input.type == "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
});

document.querySelector("#sign-in").addEventListener("click", signIn);

async function signIn() {
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
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        username: name.value,
                        password: password.value
                    }
                ),
            }
            );

            response.json().then((data) => {

                if (data.status == "Authorized") {
                    let now = new Date();
                    now.setTime(now.getTime() + (365 * 86400 * 1000)); // 365 days * 86400 seconds * 1000 milliseconds
                    document.cookie = "np_session_id=" + data.sessionID + ";expires=" + now.toUTCString();
                    window.location.href = "../";
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