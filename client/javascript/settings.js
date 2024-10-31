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
                    "Content-Type": "application/json"
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
                        elem.innerHTML = '<span class="subject-item-name" id="subject-item' + subject.id + '-name">' + subject.name + '</span><div class="subject-item-management"><i class="fa-solid fa-pen" id="subject-item' + subject.id +'-edit"></i><i class="fa-solid fa-trash-can" id="subject-item' + subject.id +'-delete"></i></div>';
                        document.querySelector(".subjects-wrap").appendChild(elem);
                        document.querySelector("#subject-item" + subject.id + "-name").style.color = "#" + subject.farbe;
                    } 
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    apiCall();
}

function fetchSettings() {
    fetchSubjects();
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

document.querySelector("#headericon").addEventListener('click', () => {
    window.location.href = "/";
});