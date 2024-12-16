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
                    document.querySelectorAll("#account-name").forEach((e) => {
                        e.innerHTML = data.name;
                    })
                    document.querySelector("#title-account-text-time").innerHTML = (new Date().getHours() >= 12) ? ((new Date().getHours() >= 17) ? "Abend" : "Mittag") : "Morgen";
                    userID = data.id;
                    fetchDurchschnitt();
                    fetchHighestSubjects();
                    fetchGrades();
                    fetchSubjects();
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

// Add Note Notenpunkte Verification
document.querySelector("#add_grade_notenpunkte").addEventListener("input", (e) => {
    let np = e.target;

    let notenval = parseInt(np.value) || 0;

    if (notenval > 15) notenval = 15;
    if (notenval < 0) notenval = 0;

    np.value = notenval;
});

// Add Note Fach Selection
// Select Menu Note
const selectedNote = document.querySelector('.select-add-grade-fach-selected');
const itemsNote = document.querySelector('.add-grade-fach-select-items');

selectedNote.addEventListener('click', () => {
    itemsNote.style.display = itemsNote.style.display === 'block' ? 'none' : 'block';
});

itemsNote.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        selectedNote.innerHTML = event.target.textContent + ' <span class="arrow-add-grade arrow-select-closed">></span>';
        selectedNote.setAttribute("fachname", event.target.textContent);
        itemsNote.style.display = 'none';
    }
});

// Select Menu Note End

document.querySelector(".fa-close-grade-add").addEventListener("click", () => {
    document.querySelector(".grades-add-wrapper").style.visibility = "hidden";
});

document.querySelector(".grades-add-grade-btn").addEventListener("click", () => {
    document.querySelector(".grades-add-wrapper").style.visibility = "visible";
});

document.querySelector("#save-add-grade-btn").addEventListener("click", (e) => {
    let fachSelect = selectedNote;
    let description = document.querySelector("#add-grade-description");
    let weight = document.querySelector("#add-grade-gewichtung").value;
    let np = document.querySelector("#add_grade_notenpunkte").value;
    if (fachSelect.getAttribute("fachname").length != 0 && 0<=np<=15) {
        getFachByName(fachSelect.getAttribute("fachname"), async (data) => {
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
            const response = await fetch("/api/noten/addnote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        userid: userID,
                        fachid: data.id,
                        notenpunkte: np,
                        halbjahr: currentSemester,
                        beschreibung: description.value,
                        gewichtung: weight
                    }
                ),
            });
            response.json().then((dataFin) => {
                window.location.href = "/";
            })
        });
    }
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.add-grade-fach-select')) {
        itemsNote.style.display = 'none';
    }
    if (itemsNote.style.display === 'block') {
        selectedNote.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('.arrow-add-grade').innerHTML = "<";
    } else {
        selectedNote.style.borderColor = "#494949";
        document.querySelector('.arrow-add-grade').innerHTML = ">";
    }
});

// Select Menu End

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
                "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
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
                "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    semester: currentSemester
                }
            ),
        });
        const data = await response.json();
        
        if (data.status === "Unknown") {
            let elem1 = document.querySelector("#top-grade-item1");
            elem1.textContent = "Keine Noten verfügbar";
            elem1.classList.add("no-top-subjects");
            elem1.style.opacity = "1";
            document.querySelector(".top-grades-list").style.padding = "0";
            return;
        }
        
        document.querySelector(".top-grades-list").style.paddingLeft = "40px";
        
        let fachRequests = data.noten.slice(0, 3).map((notenItem, i) => {
            return fetch("/api/getfach", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify({
                    userid: userID,
                    fachid: notenItem.fachid
                })
            })
            .then(response => response.json())
            .then(data2 => {
                setTimeout(() => {
                    let elem = document.querySelector("#top-grade-item" + (i + 1));
                    elem.innerHTML = data2.name + ": " + notenItem.np + " NP";
                    elem.style.color = "#" + data2.farbe;

                    // Animation
                    elem.style.transition = "opacity 1s ease-in-out";
                    elem.style.opacity = "1";
                    elem.classList.add("top-grades-fade-in");
                    elem.classList.remove("no-top-subjects");
                }, i * 500);  // Verzögerung von 500ms pro Fach
            })
            .catch(error => {
                console.error(error.message);
            });
        });

        await Promise.all(fachRequests);

    } catch (error) {
        console.error(error.message);
    }
};

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
                "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
            },
            body: JSON.stringify(
                {
                    userid: userID,
                    semester: currentSemester
                }
            ),
        });

        const data = await response.json();
        if (data.status == "403") {
            let elem = document.createElement("li");
            elem.classList.add("new-grades-list-item");
            elem.classList.add("no-new-grade");
            elem.id = "new-grade-item1";
            elem.textContent = "Keine neuen Noten";
            list.appendChild(elem);
            return;
        }

        let list = document.querySelector(".new-grades-list");
        list.innerHTML = "";
        let noten = data.noten;
        noten.sort((a, b) => new Date(a.added) - new Date(b.added));
        noten.reverse();

        let gradeRequests = noten.slice(0, 6).map((notenItem, i) => {
            let date = new Date(notenItem.added);

            return fetch("/api/getfach", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify({
                    userid: userID,
                    fachid: notenItem.fach
                })
            })
            .then(response => response.json())
            .then(data => {
                let elem = document.createElement("li");
                elem.classList.add("new-grades-list-item");
                elem.id = "new-grade-item" + (i + 1);

                elem.textContent = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} | ${data.name}: ${notenItem.np} NP`;
                elem.style.color = "#" + data.farbe;
                list.appendChild(elem);
            })
            .catch(error => {
                console.error(error.message);
            });
        });

        await Promise.all(gradeRequests);

    } catch (error) {
        console.error(error.message);
    }
};

async function fetchSubjects() {
    let apiCall = async () => {
        // Get database data
        const url = "/api/getfaecher";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        userid: userID
                    }
                ),
            });

            response.json().then((data) => {
                if (data.status == "Found") {
                    data.subjects.sort((a, b) => b.isProfilfach - a.isProfilfach);
                    document.querySelector("#add-grade-fach-items").innerHTML = "";
                    for (let subject of data.subjects) {
                            // Add to add grade selection
                            let addgradewrap = document.querySelector("#add-grade-fach-items");
                            let elem = document.createElement("div");
                            elem.id = "subjectID-" + subject.id;
                            elem.innerHTML = subject.name;
                            addgradewrap.appendChild(elem);
                        }
                    }
                });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
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
        fetchSubjects();
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

// Select Menu End

document.querySelector("#settings-page-btn").addEventListener('click', () => {
    window.location.href = "/settings";
});

document.querySelector("#grades-page-btn").addEventListener('click', () => {
    window.location.href = "/grades";
});

// Reponsive Navbar

document.querySelector("#header-open-menu-btn").addEventListener("click", () => {
    let headermenu = document.querySelector(".header-right-side");
    let clickmenu = document.querySelector("#header-open-menu-btn");
    let selectSemester = document.querySelector(".header-select-semester");
    if (clickmenu.classList.contains("fa-bars")) {
        headermenu.style.display = "flex";
        selectSemester.style.display = "block";
        clickmenu.classList.remove("fa-bars");
        clickmenu.classList.add("fa-x");
    } else {
        headermenu.style.display = "none";
        selectSemester.style.display = "none";
        clickmenu.classList.remove("fa-x");
        clickmenu.classList.add("fa-bars");
    }
});