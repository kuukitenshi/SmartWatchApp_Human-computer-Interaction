const micButton = document.getElementById("mic-button");
const microphoneSpeech = new MicrophoneSpeech();
const textBox = document.querySelector("input");
const creatingEvent = getCreatingEvent();
const nextButton = document.getElementById("next-button");
const cancelButton = document.getElementById("cancel-button");

function getCreatingEvent() {
    const creatingEventStr = sessionStorage.getItem("creating_event");
    if (creatingEventStr !== null)
        return JSON.parse(creatingEventStr);
    return {};
}

function checkButton() {
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

microphoneSpeech.onresult = (result) => {
    textBox.value = result;
    creatingEvent.description = result;
    sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
    checkButton();
};

microphoneSpeech.onstart = () => {
    micButton.classList.add("material-fill");
};

microphoneSpeech.onend = () => {
    micButton.classList.remove("material-fill");
};

micButton.addEventListener("click", () => {
    microphoneSpeech.start();
});

textBox.addEventListener("input", () => {
    creatingEvent.description = textBox.value;
    sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
    checkButton();
});

nextButton.addEventListener("click", () => {
    if (checkButton()) {
        sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
        if (isEditingEvent())
            document.location.href = "event-edited.html";
        else
            document.location.href = "event-created.html";
    }
});

cancelButton.addEventListener("click", () => {
    if (isEditingEvent())
        document.location.href = "view-event.html";
    else
        document.location.href = "event.html";
});

textBox.value = creatingEvent.description || "";
setInterval(() => checkButton(), 100);


function isEditingEvent() {
    return creatingEvent.id !== undefined;
}

if (isEditingEvent()) {
    document.querySelector(".title-header h1").innerText = "Editar evento";
    document.getElementById("next-button").innerText = "Editar";
}