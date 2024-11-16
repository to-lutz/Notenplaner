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
                        document.querySelector("#subject-item" + subject.id + "-edit").addEventListener("click", () => {
                            document.querySelector("#edit-subject-text").textContent = subject.name;
                            document.querySelector("#edit-subject-text").style.color = "#" + subject.farbe;
                            document.querySelector(".subject-edit-modal-name").value = subject.name;
                            if (subject.isProfilfach) document.querySelector("#isProfilfachSwitch").checked = true;
                            else document.querySelector("#isProfilfachSwitch").checked = false;
                            document.querySelector("#subjectColor").value = "#" + subject.farbe;
                            document.querySelector("#gewichtungSchriftl").value = subject.gewichtungSchrift;
                            document.querySelector("#gewichtungMuendl").value = subject.gewichtungMuendl;
                            if (subject.anforderungsbereich == 0) document.querySelectorAll(".subject-edit-modal-radio").forEach(elem => elem.checked = false);
                            else if (subject.anforderungsbereich == 1) document.querySelector(".subject-edit-modal-afb1").checked = true;
                            else if (subject.anforderungsbereich == 2) document.querySelector(".subject-edit-modal-afb2").checked = true;
                            else if (subject.anforderungsbereich == 3) document.querySelector(".subject-edit-modal-afb3").checked = true;

                            document.querySelector("#save-subject-btn").setAttribute("subjID", subject.id);

                            document.querySelector(".subject-edit-wrapper").style.visibility = "visible";
                        });
                        document.querySelector("#subject-item" + subject.id + "-name").style.color = "#" + subject.farbe;
                        if (subject.isProfilfach) {
                            document.querySelector("#subject-item" + subject.id + "-name").style.textDecoration = "underline";

                            // Abitur Selection set Subject 1
                            document.querySelector("#select-abi1-selected").innerHTML = subject.name + ' <span class="arrow arrow-select-closed" id="arrow-abitur-f1">></span>';
                        } else {
                            // Add to other abitur selections 
                            let abiFach2Wrap = document.querySelector("#abitur-f2-items");
                            let elem2 = document.createElement("div");
                            elem2.id = "subjectID-" + subject.id;
                            elem2.innerHTML = subject.name;
                            abiFach2Wrap.appendChild(elem2);

                            let abiFach3Wrap = document.querySelector("#abitur-f3-items");
                            let elem3 = document.createElement("div");
                            elem3.id = "subjectID-" + subject.id;
                            elem3.innerHTML = subject.name;
                            abiFach3Wrap.appendChild(elem3);

                            let abiFach4Wrap = document.querySelector("#abitur-f4-items");
                            let elem4 = document.createElement("div");
                            elem4.id = "subjectID-" + subject.id;
                            elem4.innerHTML = subject.name;
                            abiFach4Wrap.appendChild(elem4);
                            
                            let abiFach5Wrap = document.querySelector("#abitur-f5-items");
                            let elem5 = document.createElement("div");
                            elem5.id = "subjectID-" + subject.id;
                            elem5.innerHTML = subject.name;
                            abiFach5Wrap.appendChild(elem5);
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
let currentSelectedFocus = "";

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
        currentSelectedFocus = value;
        document.querySelector(".select-focus-selected").innerHTML = fullFocus + ' <span class="arrow arrow-select-closed" id="arrow-focus">></span>';
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
            subjects.push({ name: "Agrarwissenschaft", value: "ag" });
            break;
        case "btg":
            subjects.push({ name: "Biotechnologie", value: "btg" });
            break;
        case "eg":
            subjects.push({ name: "Ernährungswissenschaft", value: "eg" });
            break;
        case "sgg":
            subjects.push({ name: "Sozialwissenschaft", value: "sggs" });
            subjects.push({ name: "Gesundheitswissenschaft", value: "sggg" });
            break;
        case "tg":
            subjects.push({ name: "Mechatronik", value: "tgm" });
            subjects.push({ name: "Informationstechnik", value: "tgi" });
            subjects.push({ name: "Technik und Management", value: "tgtm" });
            subjects.push({ name: "Umwelttechnik", value: "tgu" });
            break;
        case "wg":
            subjects.push({ name: "Wirtschaft", value: "wgw" });
            subjects.push({ name: "Internationale Wirtschaft", value: "wgi" });
            subjects.push({ name: "Finanzmanagement", value: "wgf" });
            break;
    }
    // First subject: innerHTML:
    document.querySelector(".select-focus-selected").innerHTML = subjects[0].name + ' <span class="arrow arrow-select-closed" id="arrow-focus">></span>';

    for (let subject of subjects) {
        let elem = document.createElement("div");
        elem.id = subject.value;
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

    // Abi Fach 2
    if (!event.target.closest('#abi-fach2-select')) {
        abiFach2Focus.style.display = 'none';
    }
    if (abiFach2Focus.style.display === 'block') {
        abiFach2SelectedFocus.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-abitur-f2').innerHTML = "<";
    } else {
        abiFach2SelectedFocus.style.borderColor = "#494949";
        document.querySelector('#arrow-abitur-f2').innerHTML = ">";
    }

    // Abi Fach 3
    if (!event.target.closest('#abi-fach3-select')) {
        abiFach3Focus.style.display = 'none';
    }
    if (abiFach3Focus.style.display === 'block') {
        abiFach3SelectedFocus.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-abitur-f3').innerHTML = "<";
    } else {
        abiFach3SelectedFocus.style.borderColor = "#494949";
        document.querySelector('#arrow-abitur-f3').innerHTML = ">";
    }


    // Abi Fach 4
    if (!event.target.closest('#abi-fach4-select')) {
        abiFach4Focus.style.display = 'none';
    }
    if (abiFach4Focus.style.display === 'block') {
        abiFach4SelectedFocus.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-abitur-f4').innerHTML = "<";
    } else {
        abiFach4SelectedFocus.style.borderColor = "#494949";
        document.querySelector('#arrow-abitur-f4').innerHTML = ">";
    }


    // Abi Fach 5
    if (!event.target.closest('#abi-fach5-select')) {
        abiFach5Focus.style.display = 'none';
    }
    if (abiFach5Focus.style.display === 'block') {
        abiFach5SelectedFocus.style.borderColor = "rgb(46, 113, 182)";
        document.querySelector('#arrow-abitur-f5').innerHTML = "<";
    } else {
        abiFach5SelectedFocus.style.borderColor = "#494949";
        document.querySelector('#arrow-abitur-f5').innerHTML = ">";
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
        currentSelectedFocus = event.target.id;
        itemsFocus.style.display = 'none';
    }
});

// Select Focus End

// Abi Select START

// Abi Fach 2
const abiFach2SelectedFocus = document.querySelector("#select-abi2-selected");
const abiFach2Focus = document.querySelector("#abitur-f2-items");

abiFach2SelectedFocus.addEventListener('click', () => {
    abiFach2Focus.style.display = abiFach2Focus.style.display === 'block' ? 'none' : 'block';
});

abiFach2Focus.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        abiFach2SelectedFocus.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-abitur-f2">></span>';
        abiFach2Focus.style.display = 'none';
    }
});

// Abi Fach 3
const abiFach3SelectedFocus = document.querySelector("#select-abi3-selected");
const abiFach3Focus = document.querySelector("#abitur-f3-items");

abiFach3SelectedFocus.addEventListener('click', () => {
    abiFach3Focus.style.display = abiFach3Focus.style.display === 'block' ? 'none' : 'block';
});

abiFach3Focus.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        abiFach3SelectedFocus.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-abitur-f3">></span>';
        abiFach3Focus.style.display = 'none';
    }
});

// Abi Fach 4
const abiFach4SelectedFocus = document.querySelector("#select-abi4-selected");
const abiFach4Focus = document.querySelector("#abitur-f4-items");

abiFach4SelectedFocus.addEventListener('click', () => {
    abiFach4Focus.style.display = abiFach4Focus.style.display === 'block' ? 'none' : 'block';
});

abiFach4Focus.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        abiFach4SelectedFocus.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-abitur-f4">></span>';
        abiFach4Focus.style.display = 'none';
    }
});

// Abi Fach 5
const abiFach5SelectedFocus = document.querySelector("#select-abi5-selected");
const abiFach5Focus = document.querySelector("#abitur-f5-items");

abiFach5SelectedFocus.addEventListener('click', () => {
    abiFach5Focus.style.display = abiFach5Focus.style.display === 'block' ? 'none' : 'block';
});

abiFach5Focus.addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        abiFach5SelectedFocus.innerHTML = event.target.textContent + ' <span class="arrow arrow-select-closed" id="arrow-abitur-f5">></span>';
        abiFach5Focus.style.display = 'none';
    }
});

// ABI SELECT END

document.querySelector("#save-settings-btn").addEventListener("click", () => {
    // Save Settings
    setSetting("profilrichtung", currentSelectedProfile);
    setSetting("schwerpunkt", currentSelectedFocus);
});

document.querySelector("#save-subject-btn").addEventListener("click", () => {
    let name = document.querySelector("#fachname").value;
    let color = document.querySelector("#subjectColor").value.replace("#", "");
    let profilfach = document.querySelector("#isProfilfachSwitch").checked ? 1 : 0;
    let gewichtS = document.querySelector("#gewichtungSchriftl").value;
    let gewichtM = document.querySelector("#gewichtungMuendl").value;
    let fachid = document.querySelector("#save-subject-btn").getAttribute("subjID");
    let afb = 0;
    if (document.querySelector(".subject-edit-modal-afb1").checked) afb = 1;
    else if (document.querySelector(".subject-edit-modal-afb2").checked) afb = 2;
    else if (document.querySelector(".subject-edit-modal-afb3").checked) afb = 3;
    else afb = -1;
    setSubjectSetting("fachname", name, fachid);
    setSubjectSetting("farbe", color, fachid);
    setSubjectSetting("isProfilfach", profilfach, fachid);
    setSubjectSetting("gewichtungSchriftlich", gewichtS, fachid);
    setSubjectSetting("gewichtungMuendlich", gewichtM, fachid);
    setSubjectSetting("anforderungsbereich", afb, fachid);
    location.href = "/settings";
});

document.querySelector(".fa-close-subj-edit").addEventListener("click", () => {
    document.querySelector("#edit-subject-text").textContent = "?";
    document.querySelector(".subject-edit-wrapper").style.visibility = "hidden";
});

// document.querySelector("#gewichtungSchriftl").addEventListener("change", (e) => {
//     let gewichtSchriftl = document.querySelector("#gewichtungSchriftl");
//     let gewichtMuendl = document.querySelector("#gewichtungMuendl");

//     let schrift = gewichtSchriftl.value;

//     if (schrift.value > 100) gewichtSchriftl.value = 100;
//     if (schrift.value < 0) gewichtSchriftl.value = 0;

//     gewichtMuendl.value = 100-schrift;
// });

// document.querySelector("#gewichtungMuendl").addEventListener("change", (e) => {
//     let gewichtSchriftl = document.querySelector("#gewichtungSchriftl");
//     let gewichtMuendl = document.querySelector("#gewichtungMuendl");

//     let muendl = gewichtMuendl.value;

//     if (muendl.value > 100) gewichtMuendl.value = 100;
//     if (muendl.value < 0) gewichtMuendl.value = 0;

//     gewichtSchriftl.value = 100-muendl;
// }); 

document.querySelector("#gewichtungSchriftl").addEventListener("input", (e) => {
    let gewichtSchriftl = document.querySelector("#gewichtungSchriftl");
    let gewichtMuendl = document.querySelector("#gewichtungMuendl");

    let schrift = parseInt(gewichtSchriftl.value) || 0;

    if (schrift > 100) schrift = 100;
    if (schrift < 0) schrift = 0;

    gewichtSchriftl.value = schrift;
    gewichtMuendl.value = 100 - schrift;
});

document.querySelector("#gewichtungMuendl").addEventListener("input", (e) => {
    let gewichtSchriftl = document.querySelector("#gewichtungSchriftl");
    let gewichtMuendl = document.querySelector("#gewichtungMuendl");

    let muendl = parseInt(gewichtMuendl.value) || 0;

    if (muendl > 100) muendl = 100;
    if (muendl < 0) muendl = 0;

    gewichtMuendl.value = muendl;
    gewichtSchriftl.value = 100 - muendl;
});

document.querySelectorAll(".subject-edit-modal-radio").forEach(elem => elem.addEventListener("click", (e) => {
    let list = document.querySelectorAll(".subject-edit-modal-radio");
    for (let item of list) {
        if (item.id != e.target.id) {
            item.checked = false;
        }
    }
}));

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

async function setSubjectSetting(name, value, fachid) {
    let apiCall = async () => {
        // Get database data
        const url = "/api/updatefach";
        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", "x-api-key": "f3EY1v55LdyINsVMijm626bDRhAW"
                },
                body: JSON.stringify(
                    {
                        userid: userID,
                        fachid: fachid,
                        setting: name,
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