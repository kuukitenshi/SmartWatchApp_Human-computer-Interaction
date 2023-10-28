const cancelButton = document.getElementById("cancel-button");
const nextButton = document.getElementById("next-button");
const addPeopleButton = document.getElementById("icon-add-participant");
const editPeopleButton = document.getElementById("icon-edit-participant");
const overlayContainer = document.querySelector(".overlay-background");
const listPeople = document.querySelector(".people-list");
const photosContainer = document.querySelector(".profile-participants");
const peopleContainer = document.querySelector(".participants-container");
const arrow = document.querySelector(".overlay-down-arrow");
const appUser = User.loadFromWebStorage();
const backArrow = document.querySelector(".title-header").children[0];

let creating_event = getStorage();
const eventPreviousPeople = creating_event.people !== undefined ? JSON.parse(JSON.stringify(creating_event.people)) : [];

let saveSelectedIcons = [];
let isEditButton = false;

//---------------------------------------
cancelButton.addEventListener("click", () => {
    if (isEditingEvent())
        document.location.href = "view-event.html";
    else
        document.location.href = "event.html";
});

nextButton.addEventListener("click", () => {
    if(isValidButton()){
        setStorage();
        document.location.href ="event-date.html";
    }
});

addPeopleButton.addEventListener("click", () => {
    showOverlay(overlayContainer);
    setInnerOverlay();
});

editPeopleButton.addEventListener("click", () => {
    showOverlay(overlayContainer);
    setInnerOverlay();
});

photosContainer.addEventListener("click", () => {
    showOverlay(overlayContainer);
    setInnerOverlay();
});

// arrow.addEventListener("click", () => showPicturesSelected());

backArrow.addEventListener("click", () => {
    setStorage();
});

//---------------------------
function getStorage() {
    let obj = sessionStorage.getItem("creating_event");
    if (obj !== null)
        return JSON.parse(obj);
    return {};
}

function setStorage(){
    if (typeof Storage !== "undefined") {
        sessionStorage.setItem("creating_event", JSON.stringify(creating_event));
    }
}

//------------------------------
function isValidButton() {
    if(creating_event.people.length !== 0){
        nextButton.classList.add("valid-next-button");
        nextButton.style.cursor = "pointer";
        return true;
    }else {
        if(nextButton.classList.contains("valid-next-button")){
            nextButton.classList.remove("valid-next-button");
            nextButton.style.cursor = "auto";
            return false;
        }
    }
}

function setInnerOverlay() {

    const lis = document.querySelectorAll(".people-out-div");
    let len = lis.length;
    for (let i = 0; i < len; i++) {
        lis[i].remove();
    }

    let frindsArr = appUser.friends;
    for (let i = 0; i < frindsArr.length; i++) {
        if(creating_event.people !== undefined) {
            if(creating_event.people.includes(frindsArr[i].id)) {
                createListFriends(frindsArr[i], true);
                continue;
            }
        }
        createListFriends(frindsArr[i], false);
    }

    // Adicionar amigos que tenham sido removidos q estavam no evento a ser editado
    if (isEditingEvent()) {
        eventPreviousPeople.forEach(p => {
            if (appUser.friends.findIndex(f => f.id === p) === -1)
                createListFriends(appUser.getProfileFromId(p) , creating_event.people.includes(p));
        });
    }
}

function createListFriends(friendProfile, checked){
    const li = document.createElement("li");
    li.classList.add("people-out-div");

    const div = document.createElement("div");
    div.classList.add("people-card");

    const img = document.createElement("img");
    img.src = friendProfile.image;
    const p = document.createElement("p");
    p.innerText = friendProfile.name;
    div.appendChild(img);
    div.appendChild(p);

    const span = document.createElement("span");
    if(!checked){
        span.classList.add("material-symbols-outlined", "icon-not-check", "icons");
        span.innerText = "circle";
    } else {
        li.classList.add("selected-friend");
        span.classList.add("material-symbols-outlined", "material-fill", "icon-check", "icons");
        span.innerText = "check_circle";
    }
    li.addEventListener("click", (event) => changeIconSelectAndUpdate(event, friendProfile));
    li.appendChild(div);
    li.appendChild(span);
    listPeople.appendChild(li);
}

function changeIconSelectAndUpdate(event, friendProfile){
    let li = event.currentTarget;
    let elem = li.querySelector("span");
    if(li.classList.contains("selected-friend")) { //tirar certo
        li.classList.remove("selected-friend");
        elem.classList.remove("icon-check");
        elem.classList.add("icon-not-check");
        elem.classList.remove("material-fill");
        elem.innerText = "circle";
        for (let i = 0; i < creating_event.people.length; i++) {
            if(friendProfile.id === creating_event.people[i]) {
                creating_event.people.splice(i, 1); 
                break;
            }
        }       
    } else { //meter certo
        li.classList.add("selected-friend");
        elem.classList.remove("icon-not-check");
        elem.classList.add("icon-check");
        elem.classList.add("material-fill");
        elem.innerText = "check_circle";
        creating_event.people.push(friendProfile.id);
    }
    showPicturesSelected();
    setStorage();
}


function showPicturesSelected() {
    let friendsIds = creating_event.people;
    photosContainer.innerHTML = "";
    if (friendsIds.length === 0) {
        addPeopleButton.classList.remove("display-hidden");
        editPeopleButton.classList.add("display-hidden");
    } else {
        addPeopleButton.classList.add("display-hidden");
        editPeopleButton.classList.remove("display-hidden");
    }
    for (let i = 0; i < friendsIds.length; i++) {
       let imgLinkFriend = appUser.getProfileFromId(friendsIds[i]).image;
       let img = document.createElement("img");
       img.src = imgLinkFriend;
       photosContainer.appendChild(img);

        if(i === 3 && friendsIds.length > 4) {
            let span1 = document.createElement("span");
            span1.classList.add("material-symbols-outlined", "more-people-outer-circle");
            span1.innerText = "circle";
            let span2 = document.createElement("span");
            span2.classList.add("material-symbols-outlined", "more-people-icon");
            span2.innerText = "more_horiz";
            span1.appendChild(span2);
            photosContainer.appendChild(span1);
            break;
        }
    }
}

//-------------------------------------------------------------------
creating_event.people = creating_event.people || [];
setInterval(() => isValidButton(), 100);
showPicturesSelected();


function isEditingEvent() {
    return creating_event.id !== undefined;
}

if (isEditingEvent()) {
    document.querySelector(".title-header h1").innerText = "Editar evento";
}