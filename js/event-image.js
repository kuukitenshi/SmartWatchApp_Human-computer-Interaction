const cancelButton = document.getElementById("cancel-button");
const nextButton = document.getElementById("next-button");
const imageSelected = document.querySelector(".image-selected");
const overlayContainer = document.querySelector(".overlay-background");
const gridElem = document.querySelectorAll(".grid-item");
const backArrow = document.querySelector(".title-header").children[0];

let creating_event = getStorage();
loadPic();

//---------------------------------------
cancelButton.addEventListener("click", () => {
    if (isEditingEvent())
        document.location.href = "view-event.html";
    else
        document.location.href = "event.html";
});

nextButton.addEventListener("click", () => {
    document.location.href = "event-people.html";
});

imageSelected.addEventListener("click", () => {
    showOverlay(overlayContainer);
});

for (let i = 0; i < gridElem.length; i++) {
    gridElem[i].addEventListener("click", (event) => changePic(event.currentTarget));
}


//---------------------------

function loadPic() {
    if (creating_event.image === undefined) {
        creating_event.image = "../images/event-pics/beach.jpg";
        setStorage();
    } else {
        for (let i = 0; i < gridElem.length; i++) {
            const url = getImageUrl(gridElem[i]);
            if (getImageUrl(gridElem[i]) === creating_event.image)
                changePic(gridElem[i]);
        }
    }
}

function getStorage() {
    let obj = sessionStorage.getItem("creating_event");
    if (obj !== null) {
        return JSON.parse(obj);
    }
    return {};
}

function setStorage() {
    if (typeof (Storage) != "undefined") {
        sessionStorage.setItem("creating_event", JSON.stringify(creating_event));
    }
}

function changePic(newSelected) {
    const lastSelected = document.querySelector(".selected-elem-grid-border");
    let lastImgSelectedLink = getImageUrl(lastSelected);
    let imgSelectedLink = getImageUrl(newSelected);

    if (imgSelectedLink != lastImgSelectedLink) {
        creating_event.image = imgSelectedLink;
        lastSelected.children[0].remove();
        lastSelected.classList.remove("selected-elem-grid-border");
        newSelected.classList.add("selected-elem-grid-border");

        const div = document.createElement("div");
        div.id = "selected-elem-grid-check";
        const span = document.createElement("span");
        span.id = "icon-check";
        span.classList.add("material-symbols-outlined", "material-fill");
        span.innerText = "check_circle";
        div.appendChild(span);
        newSelected.appendChild(div);
        updateBanner(imgSelectedLink);
        previewBigImage(imgSelectedLink);
        setStorage();
    }
}

function getImageUrl(elem) {
    let elemStyles = window.getComputedStyle(elem);
    let selectedUrl = elemStyles.backgroundImage;
    let linkComplete = selectedUrl.substring(5, selectedUrl.length - 2);
    let linkValid = `../images${linkComplete.split("images")[1]}`;
    // creating_event.image = linkValid;
    return linkValid;
}

function previewBigImage(imgLink) {
    imageSelected.style.backgroundImage = `url("${imgLink}")`;
    if (imgLink.includes("beach")) {
        imageSelected.style.backgroundPosition = "50% 70%";
        imageSelected.style.backgroundSize = "3.2cm";
    } else if (imgLink.includes("forest")) {
        imageSelected.style.backgroundPosition = "30% 70%";
        imageSelected.style.backgroundSize = "3.7cm";
    } else if (imgLink.includes("books")) {
        imageSelected.style.backgroundPosition = "60% 40%";
        imageSelected.style.backgroundSize = "4.5cm";
    } else if (imgLink.includes("food")) {
        imageSelected.style.backgroundPosition = "30% 40%";
        imageSelected.style.backgroundSize = "3.7cm";
    } else if (imgLink.includes("game")) {
        imageSelected.style.backgroundPosition = "50% 0";
        imageSelected.style.backgroundSize = "6cm";
    } else if (imgLink.includes("movie")) {
        imageSelected.style.backgroundPosition = "50% 30%";
        imageSelected.style.backgroundSize = "4cm";
    } else if (imgLink.includes("shop")) {
        imageSelected.style.backgroundPosition = "30% 0";
        imageSelected.style.backgroundSize = "3.3cm";
    } else if (imgLink.includes("travel")) {
        imageSelected.style.backgroundPosition = "100% 50%";
        imageSelected.style.backgroundSize = "3cm";
    } else if (imgLink.includes("friends")) {
        imageSelected.style.backgroundPosition = "50% 0";
        imageSelected.style.backgroundSize = "4cm";
    }
}

function isEditingEvent() {
    return creating_event.id !== undefined;
}

if (isEditingEvent()) {
    document.querySelector(".title-header h1").innerText = "Editar evento";
}