// Logged in Check
let sessionID = getCookie("np_session_id");
if (sessionID == null || sessionID.length == 0) {
    window.location.href = "/login";
} else {
    let apiCall = async () => {
        // Get database data
        const url = "/api/sessionid";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        sessionid: sessionID
                    }
                ),
            });

            response.json().then((data) => {
                if (data.status == "Known") {
                    userID = data.id;
                } else {
                    document.cookie = 'np_session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    window.location.href = "/login";
                }

                // Fetch API Calls
                fetchBlock1();
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
}

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

let userID = undefined;

document.querySelector("#sign-out").addEventListener("click", (e) => {
    document.cookie = 'np_session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "/login";

    let apiCall = async () => {
        // Get database data
        const url = "/api/sessionidremove";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        sessionid: sessionID
                    }
                ),
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
});

let block1Value = 0;

async function getFachByName(fachname, callback) {
    let apiCall = async () => {
        // Get database data
        let response = await fetch("/api/getfachbyname", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    fachname: fachname
                }
            ),
        });

        response.json().then((data) => callback(data));
    }

    apiCall();
}

async function fetchBlock1() {
    let apiCall = async () => {
        // Get database data
        let response = await fetch("/api/getfaecher", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                }
            ),
        });

        response.json().then(async (data) => {
            let subjects = data.subjects;
            let curSemester = 1;

            const fetchPromises = subjects.map(subject => {
                return fetch("/api/noten/abitur/getkursnote", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                    },
                    body: JSON.stringify(
                        {
                            userid: userID,
                            fachid: subject.id,
                            semester: curSemester,
                        }
                    ),
                }).then(response => response.json());
            });

            const results = await Promise.all(fetchPromises);

            let block1Value = 0;
            results.forEach(data => {
                if (data.status == "Found") {
                    block1Value += data.note;
                }
            });

            document.querySelector("#abitur-b1-points").innerHTML = block1Value.toFixed(0);
        });
    };

    apiCall();
}

// Reponsive Navbar

document.querySelector("#header-open-menu-btn").addEventListener("click", () => {
    let headermenu = document.querySelector(".header-right-side");
    let clickmenu = document.querySelector("#header-open-menu-btn");
    if (clickmenu.classList.contains("fa-bars")) {
        headermenu.style.display = "flex";
        clickmenu.classList.remove("fa-bars");
        clickmenu.classList.add("fa-x");
    } else {
        headermenu.style.display = "none";
        clickmenu.classList.remove("fa-x");
        clickmenu.classList.add("fa-bars");
    }
});

// Navbar Buttons

document.querySelector("#headericon").addEventListener('click', () => {
    window.location.href = "/";
});

document.querySelector("#settings-page-btn").addEventListener('click', () => {
    window.location.href = "/settings";
});
