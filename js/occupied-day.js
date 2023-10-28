const micButton = document.getElementById("mic-button");
const micro = new MicrophoneSpeech();

const cancelOccupiedButton = document.getElementById("cancel-button");
const confirmOccupiedButton = document.getElementById("confirm-button");

const cancelHourButton = document.getElementById("cancel-button-time");
const confirmHourButton = document.getElementById("confirm-button-time");

const overlayContainer = document.querySelector(".overlay-background");


const timeStartBorder = document.querySelector(".start .border-click");
const timeEndBorder = document.querySelector(".end .border-click");

const timeStart = document.getElementById("time-start");
const timeEnd = document.getElementById("time-end");

const ulHH = document.getElementById("hh");
const ulMM = document.getElementById("mm");

const textBox = document.querySelector("input[type=text]");
const viewDay = document.getElementById("day");

const arrow = document.querySelector(".overlay-down-arrow");

const warning = document.querySelector(".error");
const text = document.getElementById("warning-text");

let currentDate;
let type;

//-------------------------------------------------------------
// EDIT

const editingDay = getEditingDay();

function getEditingDay() {
    const editingDayStr = sessionStorage.getItem("editing_day");
    if (editingDayStr !== null)
        return JSON.parse(editingDayStr);
    return null;
}

function loadEdits() {
    if (editingDay !== null) {
        timeStart.innerText = editingDay.start;
        timeEnd.innerText = editingDay.end;
        textBox.value = editingDay.description;
        document.getElementById("title").innerText = "Editar hora";
    }
}

loadEdits();

//-------------------------------------------------------------

const scrollableHH = new Scrollable(ulHH);
const scrollableMM = new Scrollable(ulMM);

scrollableHH.addScrollListener((event) => {
    updateCurrentElem("current-hh", event);
});

scrollableMM.addScrollListener((event) => {
    updateCurrentElem("current-mm", event);
});

function updateCurrentElem(className, evt) {
    let dest = evt.to;
    let src = evt.from;
    if(className === "current-hh"){
        let childsHH = ulHH.children;
        childsHH[src].classList.remove(className);
        childsHH[dest].classList.add(className);
    }else {
        let childsMM = ulMM.children;
        childsMM[src].classList.remove(className);
        childsMM[dest].classList.add(className);
    }
    if(dest !== src){
        const audio = new Audio("../sounds/scroll.mp3");
        audio.play();
        navigator.vibrate(30);
    }
}

//----------------------------------------------------
micButton.addEventListener("click", () => {
    if(!micButton.classList.contains("material-fill"))
        micro.start();
    else
        micro.stop();
});

micro.onresult = (result) => {
    textBox.value = result;
};

micro.onend = () => {
    micButton.classList.remove("material-fill");
}

micro.onstart = () => {
    micButton.classList.add("material-fill");
}

//----------------------------------------

timeStartBorder.addEventListener("click", () => {
    type = "start";
    manageScroll();
});

timeEndBorder.addEventListener("click", () => {
    type = "end";
    manageScroll();
});

function manageScroll(){
    showOverlay(overlayContainer);
    const realContainer = overlayContainer.querySelector(".overlay-container");
    realContainer.addEventListener("animationend", (event) => {
        if(event.animationName === "overlay-slide-animation") {
            scrollToCurrentTime();
            ulHH.addEventListener("transitionstart", () => {
                if (ulHH.classList.contains("show-time")) {
                    scrollableHH.blockScroll = true;
                    scrollableMM.blockScroll = true;
                }
            }, {once: true});
            ulMM.addEventListener("transitionstart", () => {
                if (ulMM.classList.contains("show-time")) {
                    scrollableHH.blockScroll = true;
                    scrollableMM.blockScroll = true;
                }
            }, {once: true});
            ulHH.addEventListener("transitionend", () => {
                ulHH.classList.remove("show-time");
                ulHH.classList.add("scroll-time");
                if (!ulMM.classList.contains("show-time")) {
                    scrollableHH.blockScroll = false;
                    scrollableMM.blockScroll = false;
                }
            }, {once: true});
            ulMM.addEventListener("transitionend", () => {
                ulMM.classList.remove("show-time");
                ulMM.classList.add("scroll-time");
                if (!ulHH.classList.contains("show-time")) {
                    scrollableHH.blockScroll = false;
                    scrollableMM.blockScroll = false;
                }
            }, {once: true});
        }
    }, {once: true});
}

ulMM.addEventListener("transitioncancel", () => {
    scrollableMM.blockScroll = false;
});

ulHH.addEventListener("transitioncancel", () => {
    scrollableHH.blockScroll = false;
});

function removeClassesToHHMM(klass){
    ulHH.classList.remove(klass);
    ulMM.classList.remove(klass);
}

function addClassesToHHMM(klass){
    ulHH.classList.add(klass);
    ulMM.classList.add(klass);
}

function scrollToCurrentTime() {
    let date = new Date();
    let currH = date.getHours();
    let currM = date.getMinutes();
    if (currH === scrollableHH.currentIndex) {
        ulHH.classList.remove("show-time");
        ulHH.classList.add("scroll-time");
    }
    if (currM === scrollableMM.currentIndex) {
        ulMM.classList.remove("show-time");
        ulMM.classList.add("scroll-time");
    }
    scrollableHH.scrollTo(currH);
    scrollableMM.scrollTo(currM);
}

//------------------------------------------------------
cancelOccupiedButton.addEventListener("click", () => {
    document.location.href = "view-day.html";
});

confirmOccupiedButton.addEventListener("click", () => saveInputs());

//------------------------------------------------------

function addClassIfNotExistsHHMM(klass) {
    if(!ulHH.classList.contains(klass) && !ulMM.classList.contains(klass))
        addClassesToHHMM(klass);
}

arrow.addEventListener("click" , () => {
    addClassIfNotExistsHHMM("show-time");
});

//------------------------------------------------------
cancelHourButton.addEventListener("click", () => {
    hideOverlay(overlayContainer);
    addClassIfNotExistsHHMM("show-time");
});

confirmHourButton.addEventListener("click", () => setTime());

//------------------------------------------------------
function setTime(){
    const getTimeOfType = document.getElementById(`time-${type}`);
    const currentHH = document.querySelector(".current-hh");
    const currentMM = document.querySelector(".current-mm");
    getTimeOfType.innerText = `${currentHH.innerText}:${currentMM.innerText}`;
    hideOverlay(overlayContainer);
    addClassIfNotExistsHHMM("show-time");
}

function checkConfirmButton() {
    let inputValid = textBox.value.length > 0 && isValidTime();
    if(!inputValid){
        // confirmOccupiedButton.style.cursor = "auto";
        return false;
    }
    return !theresSomeWarning();
}

function isOverlap() {
    let tStart = `${timeStart.innerText}:00`;
    let tEnd = `${timeEnd.innerText}:00`;
    let hasOverlap = false;
    let obj = localStorage.getItem("objCalendar");
    if (obj === null)
        return false;
    else {
        let objCalendar = JSON.parse(obj);
        let arrOccup = objCalendar.occupiedDays;
        for (let i = 0; i < arrOccup.length; i++) {
            if(equalsDate(new Date(arrOccup[i].date), currentDate)) {
                let arrEvents = arrOccup[i].events;
                for (let j = 0; j < arrEvents.length; j++) {
                    if (editingDay != null && j === editingDay.index)
                        continue;
                    if((`${arrEvents[j].start}:00` <= tStart && tStart < `${arrEvents[j].end}:00`) ||
                        (`${arrEvents[j].start}:00` < tEnd && tEnd <= `${arrEvents[j].end}:00`)){
                        hasOverlap = true;
                        break;
                    }
                }
            }
        }
    }
    return hasOverlap;
}

function showWarning(opacity, errorText) {
    warning.style.opacity = opacity;
    text.innerText = errorText;
}

function isValidTime() {
    let tStart = `${timeStart.innerText}:00`;
    let tEnd = `${timeEnd.innerText}:00`;
    if(tEnd > tStart)
        return true;
    else 
        return false;
}

function theresSomeWarning() {
    confirmOccupiedButton.style.cursor = "auto";
    if (!isValidTime())
        showWarning("1", "Horas inválidas.");
    else if(isOverlap()) {
        showWarning("1", "Sobreposição de horários.");
        // text.style.fontSize = ".5rem";
    }
    else{
        showWarning("0", "");
        return false;
    }
    return true;
}


function saveInputs() {
    if(checkConfirmButton()) {
        const s = document.getElementById("time-start").innerText;
        const e = document.getElementById("time-end").innerText;
        let occup = {start: s, end: e, description: textBox.value};

        let obj = localStorage.getItem("objCalendar");
        if (obj !== null){
            let objCalendar = JSON.parse(obj);
            let arrOccup = objCalendar.occupiedDays;
            let wasPushed = false;
            for (let i = 0; i < arrOccup.length && !wasPushed; i++) {
                if(equalsDate(new Date(arrOccup[i].date), currentDate)){
                    if (editingDay === null)
                        arrOccup[i].events.push(occup); 
                    else
                        arrOccup[i].events[editingDay.index] = occup;
                    wasPushed = true;
                }
            }
            if(!wasPushed)
                arrOccup.push({date: currentDate, events: [occup]});
            if (typeof (Storage) != "undefined")
                localStorage.setItem("objCalendar", JSON.stringify(objCalendar));
            document.location.href = "view-day.html";
        }
    }
}

function equalsDate(date1, date2){
    return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
}

function greenButton() {
    if(checkConfirmButton())
        confirmOccupiedButton.classList.add("valid-confirm-button");
    else
        confirmOccupiedButton.classList.remove("valid-confirm-button");
}

function addTimeLi(ul, limit) {
    for (let i = 0; i < limit; i++) {
        const li = document.createElement("li");
        li.innerText = i < 10 ? `0${i}` : `${i}`;
        ul.appendChild(li);  
    }
}

function setDate() {
    let storageDate = sessionStorage.getItem("viewDate");
    currentDate = new Date(storageDate);
    let formatDate = setFormatZero(currentDate.getDate()) + "/" + setFormatZero(currentDate.getMonth()+1) + "/" + setFormatZero(currentDate.getFullYear());
    viewDay.innerText = formatDate;
}

function setFormatZero(number) {
    return number < 10 ? `0${number}` : ""+number;
}

//-----------------------------------------------------------
setDate();
setInterval(() => greenButton(), 100);
setInterval(() => theresSomeWarning(), 100);


//----------------------build numbers--------------------------

addTimeLi(ulHH, 24);
addTimeLi(ulMM, 60);
