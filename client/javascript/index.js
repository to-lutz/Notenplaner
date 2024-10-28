import CircleProgress from './circle_progress.js';

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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        sessionid: sessionID
                    }
                ),
            });

            response.json().then((data) => {
                if (data.status == "Known") {
                    document.querySelectorAll("#account-name").forEach((e) => {
                        e.innerHTML = data.name;
                    })
                    userID = data.id;
                    fetchDurchschnitt();
                    fetchHighestSubjects();
                } else {
                    document.cookie = 'np_session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    window.location.href = "/login";
                }
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
                    "Content-Type": "application/json"
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

// Notenpunkte Durchschnittskreis
async function load_np_average(val) {
    let durchschnittKreis = document.querySelector(".np_durchschnitt_kreis");
    durchschnittKreis.value = val;
    durchschnittKreis.textFormat = function (value, max) {
        return value + ' NP';
    };
}

let fetchDurchschnitt = async () => {
    // Get database data
    const url = "/api/noten/durchschnitt";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userid: userID
                }
            ),
        });
        response.json().then((data) => {
            load_np_average(Math.round(data.average * 10) / 10);
        })
    } catch (error) {
        console.error(error.message);
    }
}

let fetchHighestSubjects = async () => {
    // Get database data
    const url = "/api/noten/topsubjects";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userid: userID
                }
            ),
        });
        response.json().then(async (data) => {
            for (let i = 0; i < Math.min(data.noten.length, 3); i++) {

                let response = await fetch("/api/getfach", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            userid: userID,
                            fachid: data.noten[i].fachid
                        }
                    ),
                });

                response.json().then((data2) => {
                    setTimeout(() => {
                        let elem = document.querySelector("#top-grade-item" + (i + 1));
                        elem.innerHTML = data2.name + ": " + data.noten[i].np + " NP";
                        elem.style.color = "#" + data2.farbe;
                        elem.classList.add("top-grades-fade-in");
                    }, i * (2000 / 3));
                })
            }
        })
    } catch (error) {
        console.error(error.message);
    }
}

// Select Menu
const selected = document.querySelector('.select-semester-selected');
const items = document.querySelector('.semester-select-items');

selected.addEventListener('click', () => {
    items.style.display = items.style.display === 'block' ? 'none' : 'block';
});

items.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        selected.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed">></span>';
        items.style.display = 'none';
    }
});


document.addEventListener('click', (event) => {
    if (!event.target.closest('.header-select-semester')) {
        items.style.display = 'none';
    }
    if (items.style.display === 'block') {
        selected.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('.arrow').innerHTML = "<";
    } else {
        selected.style.borderColor = "#494949";
        document.querySelector('.arrow').innerHTML = ">";
    }
});