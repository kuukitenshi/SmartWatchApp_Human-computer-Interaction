const textBox = document.getElementById("code-textbox");
const addButton = document.getElementById("add-button");
const cancelButton = document.getElementById("cancel-button");
const micButton = document.getElementById("microphone-button");
const micro = new MicrophoneSpeech();
const errorMessageContainer = document.querySelector(".error-message-container");
const user = User.loadFromWebStorage();
const textError = document.getElementById("error-message");
const limitCharsWarning = document.querySelector(".input-chars-popup");

const MAX_CODE_LENGTH = 6;

//-----------------------------------------------------------------------------
cancelButton.addEventListener("click", () => {
    document.location.href = "add-friend.html";
});

addButton.addEventListener("click", () => {
    let ret = isValidInput();
    if(ret.isValid) {
        user.addFriend(ret.profile);
        document.location.href = "request-sent.html";
    }
});

//-----------------------------------------------------------------------------
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

textBox.addEventListener("beforeinput", (event) => {
    if (event.data !== null) {
        if (event.data < '0' || event.data > '9') {
            event.preventDefault();
            return;
        }
        if (textBox.value.length >= MAX_CODE_LENGTH) {
            event.preventDefault();
            showPopup(true);
            return;
        }
    }
    showPopup(false);
});


function isValidInput(){
    addButton.style.cursor = "auto";
    if(errorMessageContainer.classList.contains("show-error-message"))
        errorMessageContainer.classList.remove("show-error-message");
    if(addButton.classList.contains("valid-add-button"))
        addButton.classList.remove("valid-add-button");

    if (textBox.value.length > 6) {
        textBox.value = textBox.value.substring(0, 6);
        return {isValid: false, profile: null};

    }else if (textBox.value.length == 6){
        const friendsList = JSON.parse(localStorage.getItem("user")).friends;
        const id = parseInt(textBox.value);

        for (let i = 0; i < userDatabase.length; i++) { //ver se esta na database
            const profile = userDatabase[i];

            if (profile.id === id) { //id esta na data base
                for (let j = 0; j < friendsList.length; j++) { //ver se ja foi add
                    if (friendsList[j].id === id) { //ja foi add
                        if(addButton.classList.contains("valid-add-button"))
                            addButton.classList.remove("valid-add-button");
                        if(!errorMessageContainer.classList.contains("show-error-message")); 
                            errorMessageContainer.classList.add("show-error-message");
                        textError.innerText = "Amigo já adicionado."
                        return {isValid: false, profile: null};
                    }
                }//nao foi add e esta na database
                if(!addButton.classList.contains("valid-add-button"))
                    addButton.classList.add("valid-add-button");
                addButton.style.cursor = "pointer";
                if(errorMessageContainer.classList.contains("show-error-message"))
                    errorMessageContainer.classList.remove("show-error-message");
                return {isValid: true, profile: profile};
            }
        }//id nao esta na data base
        if(!errorMessageContainer.classList.contains("show-error-message"))
            errorMessageContainer.classList.add("show-error-message");
        textError.innerText = "Código inválido.";
        return {isValid: false, profile: null};
    }
    return {isValid: false, profile: null};
}

setInterval(() => isValidInput(), 100);

//-----------------------------------------------------------------------------
// Speech recognition
micButton.addEventListener("click", () => {
    if(!micButton.classList.contains("material-fill"))
        micro.start();
    else
        micro.stop();
});

micro.onresult = (result) => {
    let parsedResult = "";
    for (let i = 0; i < result.length; i++) {
        const char = result.charAt(i);
        if (char >= '0' && char <= '9' && parsedResult.length < 6)
        parsedResult += char;
    }
    textBox.value = parsedResult;
};

micro.onend = () => {
    micButton.classList.remove("material-fill");
}

micro.onstart = () => {
    micButton.classList.add("material-fill");
}
