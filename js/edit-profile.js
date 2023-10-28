const micro = new MicrophoneSpeech();
const cancelButton = document.getElementById("cancel-button");
const confirmButton = document.getElementById("confirm-button");
const textBox = document.querySelector("input[type=text]");
const micButton = document.getElementById("mic-button");

const editPhotoButton = document.getElementById("edit-button");
const infoButton = document.getElementById("info");
const infoOverlay = document.querySelector(".info-edit-profile-popup-overlay");
const closeButton = document.getElementById("close-button");

const photoPreview = document.querySelector(".your-profile");
const photosOverlay = document.querySelector(".grid-photos-overlay");
const gridElem = document.querySelectorAll(".grid-item");

const limitCharsWarning = document.querySelector(".input-chars-popup");
const MAX_USERNAME_LENGTH = 10;

const user = User.loadFromWebStorage();
let imgLinkToSave = user.profile.image;
setValueDefault();
setInterval(() => isValidButton(), 100);


function showPopup(text) {
    if(text.length > MAX_USERNAME_LENGTH) {
        limitCharsWarning.classList.remove("display-hidden");
        limitCharsWarning.classList.remove("input-chars-popup-hide");
        limitCharsWarning.classList.add("input-chars-popup-show")
        textBox.value = text.substring(0, MAX_USERNAME_LENGTH);
    } else {
        limitCharsWarning.classList.remove("input-chars-popup-show");
        limitCharsWarning.classList.add("input-chars-popup-hide")
    }
}

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
    if (!micButton.classList.contains("material-fill"))
        micro.start();
    else
        micro.stop();
});

//----------------------------------------------------
infoButton.addEventListener("click", () => {
    showOverlay(infoOverlay);
});

closeButton.addEventListener("click", () => {
    hideOverlay(infoOverlay);
});

//-----------------------------------------------
cancelButton.addEventListener("click", () => {
    document.location.href = "profile.html";
});

confirmButton.addEventListener("click", () => {
    if (isValidButton()) {
        changeUserName();
        user.profile.image = imgLinkToSave;
        user.saveToWebStorage();
        document.location.href = "profile.html";
    }
});

textBox.addEventListener("beforeinput", (event) => {
    if (textBox.value.length >= MAX_USERNAME_LENGTH && event.data !== null) {
        event.preventDefault();
        showPopup(true);
    } else {
        showPopup(false);
    }
});

photoPreview.addEventListener("click", () => {
    showOverlay(photosOverlay);
});

//----------------------------------------------

function changeUserName() {
    if (isValidButton()) {
        const input = document.querySelector("input[type=text]");
        if (input.value.length > MAX_USERNAME_LENGTH) {
            input.value = input.value.substring(0, MAX_USERNAME_LENGTH);
        }
        user.profile.name = input.value;
    }
}

function isValidButton() {
    const input = document.querySelector("input[type=text]");
    if (input.value !== "") {
        confirmButton.classList.add("valid-next-button");
        confirmButton.style.cursor = "pointer";
        return true;
    } else {
        if (confirmButton.classList.contains("valid-next-button")) {
            confirmButton.classList.remove("valid-next-button");
            confirmButton.style.cursor = "auto";
            return false;
        }
        return false;
    }
}

function setValueDefault() {
    textBox.value = user.profile.name;
    photoPreview.children[0].src = imgLinkToSave;

    let itensGrid = document.querySelectorAll(".grid-item");
    for (let i = 0; i < itensGrid.length; i++) {
        if (itensGrid[i].children[0].getAttribute("src") === imgLinkToSave) {
            itensGrid[i].classList.add("selected-elem-grid-border");
            createPhotoSelected(itensGrid[i]);
        }
    }
}

//------------------------------------------
for (let i = 0; i < gridElem.length; i++) {
    gridElem[i].addEventListener("click", (event) => changePic(event));
}

function changePic(event) {
    const lastSelected = document.querySelector(".selected-elem-grid-border");
    let lastImgSelectedLink = lastSelected.children[0].getAttribute("src");
    let newSelected = event.currentTarget;
    let imgSelectedLink = newSelected.children[0].getAttribute("src");
    imgLinkToSave = imgSelectedLink;

    if (imgSelectedLink != lastImgSelectedLink) {
        lastSelected.children[1].remove();
        lastSelected.classList.remove("selected-elem-grid-border");
        newSelected.classList.add("selected-elem-grid-border");
        createPhotoSelected(newSelected);
        previewBigImage();
    }
}

function previewBigImage() {
    photoPreview.children[0].src = imgLinkToSave;
}

function createPhotoSelected(parent) {
    const div = document.createElement("div");
    div.id = "selected-elem-grid-check";
    const span = document.createElement("span");
    span.id = "icon-check";
    span.classList.add("material-symbols-outlined", "material-fill");
    span.innerText = "check_circle";
    div.appendChild(span);
    parent.appendChild(div);
}

