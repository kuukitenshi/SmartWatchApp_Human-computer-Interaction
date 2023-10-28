const micro = new MicrophoneSpeech();
const cancelButton = document.getElementById("cancel-button");
const nextButton = document.getElementById("next-button");
const textBox = document.querySelector("input[type=text]");
const micButton = document.getElementById("mic-button");

const limitCharsWarning = document.querySelector(".input-chars-popup");
const MAX_TITLE_LENGTH = 20;

let creating_event = getStorage();

cancelButton.addEventListener("click", () => {
    if (isEditingEvent())
        document.location.href = "view-event.html";
    else
        document.location.href = "event.html";
        
});

nextButton.addEventListener("click", () => {
    if(isValidButton()) {
        document.location.href = "event-image.html";
        getTitle();
        setStorage();
    }
});

//----------------------------------------------------
micro.onresult = (result) => {
    if (result.length > MAX_USERNAME_LENGTH) {
        result = result.substring(0, MAX_USERNAME_LENGTH);
        showPopup(true);
    } else {
        showPopup(false);
    }
    textBox.value = result;
};

micro.onend = () => {
    micButton.classList.remove("material-fill");
}

micro.onstart = () => {
    micButton.classList.add("material-fill");
}

micButton.addEventListener("click", () => {
    if(!micButton.classList.contains("material-fill"))
        micro.start();
    else
        micro.stop();
});

textBox.addEventListener("beforeinput", (event) => {
    if (textBox.value.length >= MAX_TITLE_LENGTH && event.data !== null) {
        event.preventDefault();
        showPopup(true);
    } else {
        showPopup(false);
    }
});


//----------------------------------------
function setStorage(){
    if (typeof (Storage) != "undefined")
        sessionStorage.setItem("creating_event", JSON.stringify(creating_event));
}

function isValidButton() {
    if(textBox.value !== "") {
        nextButton.classList.add("valid-next-button");
        nextButton.style.cursor = "pointer";
        return true;
    }else {
        if(nextButton.classList.contains("valid-next-button")){
            nextButton.classList.remove("valid-next-button");
            nextButton.style.cursor = "auto";
            return false;
        }
        return false;
    }
}

function getStorage() {
    let obj = sessionStorage.getItem("creating_event");
    if (obj !== null) {
        return JSON.parse(obj);
    }
    return {};
}

//-----------------------------------------------

function showPopup(hasExceeded) {
    if (hasExceeded) {
        limitCharsWarning.classList.remove("display-hidden");
        limitCharsWarning.classList.remove("input-chars-popup-hide");
        limitCharsWarning.classList.add("input-chars-popup-show");
    } else {
        limitCharsWarning.classList.remove("input-chars-popup-show");
        limitCharsWarning.classList.add("input-chars-popup-hide")
    }
}

function getTitle() {
    if (isValidButton()) {
        const input = document.querySelector("input[type=text]");
        if (input.value.length > MAX_USERNAME_LENGTH) {
            input.value = input.value.substring(0, MAX_USERNAME_LENGTH);
        }
        creating_event.title = input.value;
    }
}


//---------------run----------------------
setInterval(() => isValidButton(), 100);
textBox.value = creating_event.title || "";


function isEditingEvent() {
    return creating_event.id !== undefined;
}

if (isEditingEvent()) {
    document.querySelector(".title-header h1").innerText = "Editar evento";
    const goBackButton = document.getElementById("goBack");
    const cloned = goBackButton.cloneNode(true);
    cloned.addEventListener("click", () => {
        document.location.href = "view-event.html";
    });
    goBackButton.parentElement.replaceChild(cloned, goBackButton);
}