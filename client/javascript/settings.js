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
                    userID = data.id;
                    fetchSettings();
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

async function fetchSubjects() {
    /*
                            <div class="subject-item-wrap">
                            <span class="subject-item-name" id="subject-item1-name">?</span>
                            <div class="subject-item-management">
                                <i class="fa-solid fa-pen"></i>
                                <i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
    
    */
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
                    for (let subject of data.subjects) {
                        let elem = document.createElement("div");
                        elem.classList.add("subject-item-wrap");
                        elem.id = "subject-item" + subject.id + "-wrap";
                        elem.innerHTML = '<span class="subject-item-name" id="subject-item' + subject.id + '-name">' + subject.name + '</span><div class="subject-item-management"><i class="fa-solid fa-pen" id="subject-item' + subject.id + '-edit"></i><i class="fa-solid fa-trash-can" id="subject-item' + subject.id + '-delete"></i></div>';
                        document.querySelector(".subjects-wrap").appendChild(elem);
                        document.querySelector("#subject-item" + subject.id + "-name").style.color = "#" + subject.farbe;
                        if (subject.isProfilfach) {
                            document.querySelector("#subject-item" + subject.id + "-name").style.textDecoration = "underline";
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
}

let currentSelectedProfile = "";

async function fetchGeneral() {
    await getSetting("profilrichtung", (value) => {
        let fullProfile = "";
        switch (value) {
            case "ag":
                fullProfile = "Agrarwissenschaftliche Richtung (AG)";
                break;
            case "btg":
                fullProfile = "Biotechnologische Richtung (BTG)";
                break;
            case "eg":
                fullProfile = "Ernährungswissenschaftliche Richtung (EG)";
                break;
            case "sgg":
                fullProfile = "Sozial- und Gesellschaftwissenschaftliche Richtung (SGG)";
                break;
            case "tg":
                fullProfile = "Technische Richtung (TG)";
                break;
            case "wg":
                fullProfile = "Wirtschaftswissenschaftliche Richtung (WG)";
                break;
        }
        currentSelectedProfile = value;
        document.querySelector(".select-profile-selected").innerHTML = fullProfile + ' <span class="arrow arrow-select-closed" id="arrow-profile">></span>';
        // Add to focus subject selection for correct profile:
        reloadFocusSubjects();
    });
    await getSetting("schwerpunkt", (value) => {
        let fullFocus = "";
        switch (value) {
            case "ag":
                fullFocus = "Agrarwissenschaft";
                break;
            case "bt":
                fullFocus = "Biotechnologie";
                break;
            case "ew":
                fullFocus = "Ernährungswissenschaft";
                break;
            // SG
            case "sggs":
                fullFocus = "Sozialwissenschaft";
                break;
            case "sggg":
                fullFocus = "Gesundheitswissenschaft";
                break;
            // TG
            case "tgm":
                fullFocus = "Mechatronik";
                break;
            case "tgg":
                fullFocus = "Gestaltungs- und Medientechnik";
                break;
            case "tgi":
                fullFocus = "Informationstechnik";
                break;
            case "tgtm":
                fullFocus = "Technik und Management";
                break;
            case "tgu":
                fullFocus = "Umwelttechnik";
                break;
            // WG
            case "wgw":
                fullFocus = "Wirtschaft";
                break;
            case "wgi":
                fullFocus = "Internationale Wirtschaft";
                break;
            case "wgf":
                fullFocus = "Finanzmanagement";
                break;
        }
        document.querySelector(".select-focus-selected").innerHTML = fullFocus + ' <span class="arrow arrow-select-closed" id="arrow-profile">></span>';
    })
}

function fetchSettings() {
    fetchSubjects();
    fetchGeneral();
}

function reloadFocusSubjects() {
    let listWrap = document.querySelector(".focus-select-items");
    listWrap.innerHTML = "";
    let subjects = [];
    switch (currentSelectedProfile) {
        case "ag":
            subjects.push({name: "Agrarwissenschaft", value: "ag"});
            break;
        case "btg":
            subjects.push({name: "Biotechnologie", value: "btg"});
            break;
        case "eg":
            subjects.push({name: "Ernährungswissenschaft", value: "eg"});
            break;
        case "sgg":
            subjects.push({name: "Sozialwissenschaft", value: "sggs"});
            subjects.push({name: "Gesundheitswissenschaft", value: "sggg"});
            break;
        case "tg":
            subjects.push({name: "Mechatronik", value: "tgm"});
            subjects.push({name: "Informationstechnik", value: "tgi"});
            subjects.push({name: "Technik und Management", value: "tgtm"});
            subjects.push({name: "Umwelttechnik", value: "tgu"});
            break;
        case "wg":
            subjects.push({name: "Wirtschaft", value: "wgw"});
            subjects.push({name: "Internationale Wirtschaft", value: "wgi"});
            subjects.push({name: "Finanzmanagement", value: "wgf"});
            break;
    }
    // First subject: innerHTML:
    document.querySelector(".select-focus-selected").innerHTML = subjects[0].name + ' <span class="arrow arrow-select-closed" id="arrow-focus">></span>';

    for (let subject of subjects) {
        let elem = document.createElement("div");
        elem.value = subject.id;
        elem.innerHTML = subject.name;
        listWrap.appendChild(elem);
    }
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

document.querySelector("#headericon").addEventListener('click', () => {
    window.location.href = "/";
});

// Select Profile
const selected = document.querySelector('.select-profile-selected');
const items = document.querySelector('.profile-select-items');

selected.addEventListener('click', () => {
    items.style.display = items.style.display === 'block' ? 'none' : 'block';
});

items.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        selected.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-profile">></span>';
        items.style.display = 'none';
        currentSelectedProfile = event.target.id;
        reloadFocusSubjects();
    }
});


document.addEventListener('click', (event) => {
    if (!event.target.closest('.general-select-profile')) {
        items.style.display = 'none';
    }
    if (items.style.display === 'block') {
        selected.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-profile').innerHTML = "<";
    } else {
        selected.style.borderColor = "#494949";
        document.querySelector('#arrow-profile').innerHTML = ">";
    }

    // Focus
    if (!event.target.closest('.general-select-focus')) {
        itemsFocus.style.display = 'none';
    }
    if (itemsFocus.style.display === 'block') {
        selectedFocus.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-focus').innerHTML = "<";
    } else {
        selectedFocus.style.borderColor = "#494949";
        document.querySelector('#arrow-focus').innerHTML = ">";
    }

});


// Select Profile End

// Select Focus
const selectedFocus = document.querySelector('.select-focus-selected');
const itemsFocus = document.querySelector('.focus-select-items');

selectedFocus.addEventListener('click', () => {
    itemsFocus.style.display = itemsFocus.style.display === 'block' ? 'none' : 'block';
});

itemsFocus.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        selectedFocus.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-focus">></span>';
        itemsFocus.style.display = 'none';
    }
});

// Select Focus End

document.querySelector("#save-settings-btn").addEventListener("click", () => {
    // Save Settings
    setSetting("profilrichtung", currentSelectedProfile);
});

async function getSetting(name, callback) {
    let apiCall = async () => {
        // Get database data
        const url = "/api/getsetting";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        userid: userID,
                        name: name,
                    }
                ),
            });

            response.json().then((data) => {
                if (data.status == "Found") {
                    callback(data.value);
                } else {
                    return null;
                }
            })
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
}

async function setSetting(name, value) {
    let apiCall = async () => {
        // Get database data
        const url = "/api/setsetting";
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        userid: userID,
                        name: name,
                        value: value
                    }
                ),
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
}