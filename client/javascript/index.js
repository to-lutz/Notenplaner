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
                    fetchGrades();
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
    if (val < 0 || val > 15) {
        let durchschnittKreis = document.querySelector(".np_durchschnitt_kreis");
        durchschnittKreis.value = 0;
        durchschnittKreis.textFormat = function (value, max) {
            return '? NP';
        };
    } else {
        let durchschnittKreis = document.querySelector(".np_durchschnitt_kreis");
        durchschnittKreis.value = val;
        durchschnittKreis.textFormat = function (value, max) {
            return value + ' NP';
        };
    }
}

let fetchDurchschnitt = async () => {
    load_np_average(-1);
    // Get database data
    const url = "/api/noten/durchschnitt";
    let currentSemester = document.querySelector(".select-semester-selected").textContent;
    if (currentSemester.includes("1.1")) {
        currentSemester = 1;
    } else if (currentSemester.includes("1.2")) {
        currentSemester = 2;
    } else if (currentSemester.includes("2.1")) {
        currentSemester = 3;
    } else if (currentSemester.includes("2.2")) {
        currentSemester = 4;
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    semester: currentSemester
                }
            ),
        });
        response.json().then((data) => {
            load_np_average(Math.round(data.average * 100) / 100);
        })
    } catch (error) {
        console.error(error.message);
    }
}

let fetchHighestSubjects = async () => {

    document.querySelectorAll(".top-grades-list-item").forEach((e) => {
        e.classList.remove("top-grades-fade-in");
        e.style.transition = "none";
        e.style.opacity = "0";
    });

    // Get database data
    const url = "/api/noten/topsubjects";
    let currentSemester = document.querySelector(".select-semester-selected").textContent;
    if (currentSemester.includes("1.1")) {
        currentSemester = 1;
    } else if (currentSemester.includes("1.2")) {
        currentSemester = 2;
    } else if (currentSemester.includes("2.1")) {
        currentSemester = 3;
    } else if (currentSemester.includes("2.2")) {
        currentSemester = 4;
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    semester: currentSemester
                }
            ),
        });
        response.json().then(async (data) => {
            if (data.status === "Unknown") {
                let elem1 = document.querySelector("#top-grade-item1");
                elem1.textContent = "Keine Noten verfügbar";
                elem1.classList.add("no-top-subjects");
                elem1.style.opacity = "1";
                document.querySelector(".top-grades-list").style.padding = "0";
                return;
            }
            document.querySelector(".top-grades-list").style.paddingLeft = "40px";
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

                        // Animation
                        elem.style.transition = "opacity 1s ease-in-out";
                        elem.style.opacity = "1";
                        elem.classList.add("top-grades-fade-in");
                        elem.classList.remove("no-top-subjects");
                    }, i * (2000 / 3));
                })
            }
        })
    } catch (error) {
        console.error(error.message);
    }
}

let fetchGrades = async () => {
    // Get database data
    const url = "/api/noten/getnoten";
    let currentSemester = document.querySelector(".select-semester-selected").textContent;
    if (currentSemester.includes("1.1")) {
        currentSemester = 1;
    } else if (currentSemester.includes("1.2")) {
        currentSemester = 2;
    } else if (currentSemester.includes("2.1")) {
        currentSemester = 3;
    } else if (currentSemester.includes("2.2")) {
        currentSemester = 4;
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    semester: currentSemester
                }
            ),
        });

        let list = document.querySelector(".new-grades-list");
        list.innerHTML = "";
        if (response.status == "403") {
            let elem = document.createElement("li");
            elem.classList.add("new-grades-list-item");
            elem.classList.add("no-new-grade");
            elem.id = "new-grade-item1";
            elem.textContent = "Keine neuen Noten";
            list.appendChild(elem);
            return;
        }

        response.json().then(async (data) => {
            let noten = data.noten;
            noten.sort((a, b) => new Date(a.added) - new Date(b.added));
            noten.reverse();

            for (let i = 0; i < Math.min(noten.length, 6); i++) {
                let elem = document.createElement("li");
                elem.classList.add("new-grades-list-item");
                elem.id = "new-grade-item" + (i+1);

                let notenElem = noten[i];
                let date = new Date(notenElem.added);

                let response = await fetch("/api/getfach", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            userid: userID,
                            fachid: noten[i].fach
                        }
                    ),
                });
            
                response.json().then((data) => {
                    elem.textContent = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " | " + data.name + ": " + notenElem.np + " NP";
                    elem.style.color = "#" + data.farbe;
                    list.appendChild(elem);
                });
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
        fetchDurchschnitt();
        fetchHighestSubjects();
        fetchGrades();
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