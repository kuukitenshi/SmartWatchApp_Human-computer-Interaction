const startTimeButton = document.querySelector(".start-time-button");
const endTimeButton = document.querySelector(".end-time-button");
const startDateButton = document.getElementById("date-start");
const endDateButton = document.getElementById("date-end");
const dateOverlay = document.querySelector(".date-overlay");
const timeOverlay = document.querySelector(".time-overlay");
const ulHours = document.getElementById("hh");
const ulMinutes = document.getElementById("mm");
const arrow = document.querySelector(".time-overlay .overlay-down-arrow");

const cancelHourButton = document.getElementById("cancel-button-time");
const confirmHourButton = document.getElementById("confirm-button-time");

const cancelDateButton = document.getElementById("cancel-button-date");
const confirmDateButton = document.getElementById("confirm-button-date");

const overlayContainer = document.querySelector(".overlay-background");

const timeStart = document.getElementById("time-start");
const timeEnd = document.getElementById("time-end");

const scrollableHH = new Scrollable(ulHours);
const scrollableMM = new Scrollable(ulMinutes);

const creatingEvent = getCreatingEvent();

const user = User.loadFromWebStorage();


let dateType;

setDefaultHours();

let type;

const ulDays = document.getElementById("dd");
const ulMonths = document.getElementById("MM");
const ulYears = document.getElementById("yyyy");

const scrollableDD = new Scrollable(ulDays);
const scrollableMoM = new Scrollable(ulMonths);
const scrollableYYYY = new Scrollable(ulYears);





// --- Slider & Scroll ---
const tabsContainer = document.querySelector(".tabs-container");
const scrollable = new Scrollable(tabsContainer, {scrollDirection: "horizontal"});
const startEventButton = document.querySelector(".start-event-button");
const endEventButton = document.querySelector(".end-event-button");
const tabButtonSlider = document.querySelector(".tab-button-background-slider");
const buttons = document.querySelectorAll(".tab-button-background button");

scrollable.addScrollListener((event) => {
    if (event.to === event.from)
        return;
    const currentSelected = document.querySelector(".active-tab");
    currentSelected.classList.remove("active-tab");
    const button = buttons[event.to];
    button.classList.add("active-tab");
    adjustBackgroundSlider(event.to);
});

function startButtonClick(event) {
    scrollable.scrollTo(0);
}

function endButtonClick(event) {
    scrollable.scrollTo(1);
}

function adjustBackgroundSlider(index) {
    const button = buttons[index];
    const buttonRect = button.getBoundingClientRect();
    const sliderRect = tabButtonSlider.getBoundingClientRect();
    const offsetX = sliderRect.width/2 - buttonRect.width/2;
    const background = document.querySelector(".tab-button-background");
    const backgroundRect = background.getBoundingClientRect();
    const offsetY = backgroundRect.height/2 - sliderRect.height/2;
    tabButtonSlider.style.transform = `translate(${buttonRect.x - tabButtonSlider.parentElement.getBoundingClientRect().x - offsetX}px, ${offsetY}px)`;
}

window.addEventListener("load", () => {
    adjustBackgroundSlider(scrollable.currentIndex);
    tabButtonSlider.style.opacity = "1";
});


startEventButton.addEventListener("click", startButtonClick);
endEventButton.addEventListener("click", endButtonClick);

//-------------------------------------------
const cancelButton = document.getElementById("cancel-button");
const nextButton = document.getElementById("next-button");

const alterarContinuarOverlay = document.querySelector(".confirm-overlap-events-popup-overlay");

cancelButton.addEventListener("click", () => {
    if (isEditingEvent())
        document.location.href = "view-event.html";
    else
        document.location.href = "event.html";
});

nextButton.addEventListener("click", () => {
    if(isValidButton() && !isOverlap()) {
        document.location.href = "event-location.html";
    }else if (isOverlap()) {
        showOverlay(alterarContinuarOverlay);
        const title = alterarContinuarOverlay.querySelector(".confirm-overlap-events-popup-title-container").querySelector("h1");
        title.innerText = "Sobreposição de eventos. Deseja continuar?";
    }
});

const alterarButton = document.querySelector(".overlap-events-alterar-button");
const continuarButton = document.querySelector(".overlap-events-continuar-confirm-button");

alterarButton.addEventListener("click", () => {
    hideOverlay(alterarContinuarOverlay);
});

continuarButton.addEventListener("click", () => {
    if(isValidButton())
        document.location.href = "event-location.html";
});


function dateFromString(dateString, timeString) {
    const dateSplitted = dateString.split("/");
    const timeSplitted = timeString.split(":");

    const year = parseInt(dateSplitted[2]);
    const monthIndex = parseInt(dateSplitted[1]) - 1;
    const day = parseInt(dateSplitted[0]);
    const hours = parseInt(timeSplitted[0]);
    const minutes = parseInt(timeSplitted[1]);

    return new Date(year, monthIndex, day, hours, minutes);
}

//----------------------------------------------------------------------------------
function isOverlap() {
    const startDate = dateFromString(startDateButton.innerText, timeStart.innerText);
    const endDate = dateFromString(endDateButton.innerText, timeEnd.innerText);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    for (let i = 0; i < user.currentEvents.length; i++) {
        if (isEditingEvent() && creatingEvent.id == user.currentEvents[i].id)
            continue;
        const event = user.currentEvents[i];
        const eventStart = dateFromString(event.start_date, event.start_time);
        const eventEnd = dateFromString(event.end_date, event.end_time);
        const eventStartTime = eventStart.getTime();
        const eventEndTime = eventEnd.getTime();
        if (startTime >= eventStartTime && startTime < eventEndTime)
            return true;
        if (endTime > eventStartTime && endTime <= eventEndTime)
            return true;
    }
    return false;
}

function toISOString(dateString) {
    const splitted = dateString.split("/");
    return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
}

//----------------------------------------------------------------------------------


function isValidButton() {
    const startDate = startDateButton.innerText;
    const endDate = endDateButton.innerText;
    let inputValid = isValidTime() && isValidDate(startDate) && isValidDate(endDate) && validDates();
    
    if(inputValid) {
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

//---------------------------------------------

function getCreatingEvent() {
    const creatingEventStr = sessionStorage.getItem("creating_event");
    if (creatingEventStr !== null)
        return JSON.parse(creatingEventStr);
    return {};
}

document.getElementById("time-start").innerText = creatingEvent.start_time || "00:00";
document.getElementById("time-end").innerText = creatingEvent.end_time || "00:01";

scrollableHH.addScrollListener((event) => {
    updateCurrentElem("current-hh", event);
});

scrollableMM.addScrollListener((event) => {
    updateCurrentElem("current-mm", event);
});

function setDefaultHours() {
    creatingEvent.start_time = creatingEvent.start_time || "00:00";
    creatingEvent.end_time = creatingEvent.end_time || "00:01";
    const today = new Date();
    let formatDate = setFormatZero(today.getDate()) + "/" + setFormatZero(today.getMonth()+1) + "/" + setFormatZero(today.getFullYear());

    startDateButton.innerText = creatingEvent.start_date || formatDate;
    endDateButton.innerText = creatingEvent.end_date || formatDate;

    creatingEvent.start_date = startDateButton.innerText;
    creatingEvent.end_date = endDateButton.innerText;
    sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
}

function setFormatZero(number) {
    return number < 10 ? `0${number}` : ""+number;
}

//--------------------------------------------------
function updateCurrentElem(className, evt) {
    let dest = evt.to;
    let src = evt.from;
    if(className === "current-hh"){
        let childsHH = ulHours.children;
        childsHH[src].classList.remove(className);
        childsHH[dest].classList.add(className);
    }else if(className === "current-mm") {
        let childsMM = ulMinutes.children;
        childsMM[src].classList.remove(className);
        childsMM[dest].classList.add(className);
    }else if(className === "current-DD") {
        let childsDD = ulDays.children;
        childsDD[src].classList.remove(className);
        childsDD[dest].classList.add(className);
    }else if(className === "current-MM") {
        let childsMoM = ulMonths.children;
        childsMoM[src].classList.remove(className);
        childsMoM[dest].classList.add(className);
    }else if(className === "current-YYYY") {
        let childsYYYY = ulYears.children;
        childsYYYY[src].classList.remove(className);
        childsYYYY[dest].classList.add(className);
    }
    if(dest !== src){
        const audio = new Audio("../sounds/scroll.mp3");
        audio.play();
        navigator.vibrate(30);
    }
}

function manageScroll(){
    showOverlay(timeOverlay);
    const realContainer = timeOverlay.querySelector(".overlay-container");
    realContainer.addEventListener("animationend", (event) => {
        if(event.animationName === "overlay-slide-animation") {
            scrollToCurrentTime();
            ulHours.addEventListener("transitionstart", () => {
                if (ulHours.classList.contains("show-time")) {
                    scrollableHH.blockScroll = true;
                    scrollableMM.blockScroll = true;
                }
            }, {once: true});
            ulMinutes.addEventListener("transitionstart", () => {
                if (ulMinutes.classList.contains("show-time")) {
                    scrollableHH.blockScroll = true;
                    scrollableMM.blockScroll = true;
                }
            }, {once: true});
            ulHours.addEventListener("transitionend", () => {
                ulHours.classList.remove("show-time");
                ulHours.classList.add("scroll-time");
                if (!ulMinutes.classList.contains("show-time")) {
                    scrollableHH.blockScroll = false;
                    scrollableMM.blockScroll = false;
                }
            }, {once: true});
            ulMinutes.addEventListener("transitionend", () => {
                ulMinutes.classList.remove("show-time");
                ulMinutes.classList.add("scroll-time");
                if (!ulHours.classList.contains("show-time")) {
                    scrollableHH.blockScroll = false;
                    scrollableMM.blockScroll = false;
                }
            }, {once: true});
        }
    }, {once: true});
}

ulMinutes.addEventListener("transitioncancel", () => {
    scrollableMM.blockScroll = false;
});

ulHours.addEventListener("transitioncancel", () => {
    scrollableHH.blockScroll = false;
});

function scrollToCurrentTime() {
    let date = new Date();
    let currH = date.getHours();
    let currM = date.getMinutes();
    if (currH === scrollableHH.currentIndex) {
        ulHours.classList.remove("show-time");
        ulHours.classList.add("scroll-time");
    }
    if (currM === scrollableMM.currentIndex) {
        ulMinutes.classList.remove("show-time");
        ulMinutes.classList.add("scroll-time");
    }
    scrollableHH.scrollTo(currH);
    scrollableMM.scrollTo(currM);
}

function addClassIfNotExistsHHMM(klass) {
    if(!ulHours.classList.contains(klass) && !ulMinutes.classList.contains(klass))
        addClassesToHHMM(klass);
}

function addClassesToHHMM(klass){
    ulHours.classList.add(klass);
    ulMinutes.classList.add(klass);
}

cancelHourButton.addEventListener("click", () => {
    hideOverlay(timeOverlay);
    addClassIfNotExistsHHMM("show-time");
});

confirmHourButton.addEventListener("click", () => setTime());

//------------------------------------------------------------------
cancelDateButton.addEventListener("click", () => {
    hideOverlay(dateOverlay);
    addClassIfNotExistsDate("show-time");
});

confirmDateButton.addEventListener("click", () => setDate());
//----------------------------------------------------------------

function setTime(){
    const getTimeOfType = document.getElementById(`time-${type}`);
    const currentHH = document.querySelector(".current-hh");
    const currentMM = document.querySelector(".current-mm");
    getTimeOfType.innerText = `${currentHH.innerText}:${currentMM.innerText}`;
    hideOverlay(timeOverlay);
    addClassIfNotExistsHHMM("show-time");
    if (type === "start") {
        creatingEvent.start_time = getTimeOfType.innerText;
    } else if (type === "end") {
        creatingEvent.end_time = getTimeOfType.innerText;
    }
    sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
}

arrow.addEventListener("click" , () => addClassIfNotExistsHHMM("show-time"));

startTimeButton.addEventListener("click", () => {
    type = "start";
    manageScroll();
});

endTimeButton.addEventListener("click", () => {
    type = "end";
    manageScroll();
});

startDateButton.addEventListener("click", () => {
    manageScrollDate();
    dateType = "start";
});

endDateButton.addEventListener("click", () => {
    manageScrollDate();
    dateType = "end";
});

//------------------------------------
function addHoursLi(ul, limit) {
    for (let i = 0; i < limit; i++) {
        const li = document.createElement("li");
        li.innerText = i < 10 ? `0${i}` : `${i}`;
        ul.appendChild(li);  
    }
}

addHoursLi(ulHours, 24);
addHoursLi(ulMinutes, 60);

addDateList();

//-------------------DATE-----------------------------------------------------------------------------

function addDateList() {
    const currYear = new Date().getFullYear();

    let count = 0;
    for (let i = currYear; i < (currYear+10); i++) { //years
        const li = document.createElement("li");
        li.innerText = currYear+count;
        ulYears.appendChild(li); 
        count ++;
    }

    for (let i = 1; i < 13; i++) { //month
        const li = document.createElement("li");
        li.innerText = i < 10 ? `0${i}` : `${i}`;
        ulMonths.appendChild(li);  
    }

    for (let i = 1; i < 32; i++) { //days
        const li = document.createElement("li");
        li.innerText = i < 10 ? `0${i}` : `${i}`;
        ulDays.appendChild(li);  
    }
}

scrollableDD.addScrollListener((event) => {
    updateCurrentElem("current-DD", event);
});

scrollableMoM.addScrollListener((event) => {
    updateCurrentElem("current-MM", event);
});

scrollableYYYY.addScrollListener((event) => {
    updateCurrentElem("current-YYYY", event);
});

function scrollToCurrentDate() {
    let date = new Date();
    let currDD = date.getDate();
    let currMoM = date.getMonth();
    let currYYYY = date.getFullYear();
    if (currDD-1 === scrollableDD.currentIndex) {
        ulDays.classList.remove("show-time");
        ulDays.classList.add("scroll-time");
    }
    if (currMoM === scrollableMoM.currentIndex) {
        ulMonths.classList.remove("show-time");
        ulMonths.classList.add("scroll-time");
    }
    if (currYYYY-currYYYY === scrollableYYYY.currentIndex) {
        ulYears.classList.remove("show-time");
        ulYears.classList.add("scroll-time");
    }
    scrollableDD.scrollTo(currDD-1);
    scrollableMoM.scrollTo(currMoM);
    scrollableYYYY.scrollTo(0);
}

function manageScrollDate(){
    showOverlay(dateOverlay);
    const realContainer = dateOverlay.querySelector(".overlay-container");
    realContainer.addEventListener("animationend", (event) => {
        if(event.animationName === "overlay-slide-animation") {
            scrollToCurrentDate();
            ulDays.addEventListener("transitionstart", () => {
                if (ulDays.classList.contains("show-time")) {
                    scrollableDD.blockScroll = true;
                    scrollableMoM.blockScroll = true;
                    scrollableYYYY.blockScroll = true;
                }
            }, {once: true});
            ulMonths.addEventListener("transitionstart", () => {
                if (ulMonths.classList.contains("show-time")) {
                    scrollableDD.blockScroll = true;
                    scrollableMoM.blockScroll = true;
                    scrollableYYYY.blockScroll = true;
                }
            }, {once: true});
            ulYears.addEventListener("transitionstart", () => {
                if (ulYears.classList.contains("show-time")) {
                    scrollableDD.blockScroll = true;
                    scrollableMoM.blockScroll = true;
                    scrollableYYYY.blockScroll = true;
                }
            }, {once: true});
            ulDays.addEventListener("transitionend", () => {
                ulDays.classList.remove("show-time");
                ulDays.classList.add("scroll-time");
                if (ulMonths.classList.contains("scroll-time") || ulYears.classList.contains("scroll-time")) {
                    scrollableDD.blockScroll = false;
                    scrollableMoM.blockScroll = false;
                    scrollableYYYY.blockScroll = false;
                }
            }, {once: true});
            ulMonths.addEventListener("transitionend", () => {
                ulMonths.classList.remove("show-time");
                ulMonths.classList.add("scroll-time");
                if (ulDays.classList.contains("scroll-time") || ulYears.classList.contains("scroll-time")) {
                    scrollableDD.blockScroll = false;
                    scrollableMoM.blockScroll = false;
                    scrollableYYYY.blockScroll = false;
                }
            }, {once: true});
            ulYears.addEventListener("transitionend", () => {
                ulYears.classList.remove("show-time");
                ulYears.classList.add("scroll-time");
                if (ulDays.classList.contains("scroll-time") || ulMonths.classList.contains("scroll-time")) {
                    scrollableDD.blockScroll = false;
                    scrollableMoM.blockScroll = false;
                    scrollableYYYY.blockScroll = false;
                }
            }, {once: true});
        }
    }, {once: true});
}

ulDays.addEventListener("transitioncancel", () => {
    scrollableDD.blockScroll = false;
});

ulMonths.addEventListener("transitioncancel", () => {
    scrollableMoM.blockScroll = false;
});

ulYears.addEventListener("transitioncancel", () => {
    scrollableYYYY.blockScroll = false;
});


//--------------------------------------------

function isLeapYear(year) {
    if (year % 400 == 0)
        return true;
    if (year % 100 == 0)
        return false;
    if (year % 4 == 0)
        return true;
    return false;
}

function isValidDate(dateString) {
    const splitted = dateString.split("/");
    const isoDate = splitted[2] + "-" + splitted[1] + "-" + splitted[0];
    const date = new Date(isoDate);
    const textMonth = parseInt(splitted[1]);
    const dateMonth = date.getMonth() + 1;
    return !isNaN(date.getTime()) && dateMonth === textMonth;
}

function setDate(){
    const cDD = document.querySelector(".current-DD");
    const cMoM = document.querySelector(".current-MM");
    const cYYYY = document.querySelector(".current-YYYY");
    const dateButton = dateType === "start" ? startDateButton : endDateButton;
    dateButton.innerText = `${cDD.innerText}/${cMoM.innerText}/${cYYYY.innerText}`;
    hideOverlay(dateOverlay);
    addClassIfNotExistsDate("show-time");
    if (dateType === "start")
        creatingEvent.start_date = dateButton.innerText;
    else
        creatingEvent.end_date = dateButton.innerText;
    sessionStorage.setItem("creating_event", JSON.stringify(creatingEvent));
}

function addClassIfNotExistsDate(klass) {
    if(!ulDays.classList.contains(klass) && !ulMonths.classList.contains(klass) && !ulYears.classList.contains(klass))
        addClassesDate(klass);
}

function addClassesDate(klass){
    ulDays.classList.add(klass);
    ulMonths.classList.add(klass);
    ulYears.classList.add(klass);
}

//----------------------------------------------
const warning = document.querySelector(".error");
const text = document.getElementById("warning-text");

function showWarning(opacity, errorText) {
    warning.style.opacity = opacity;
    text.innerText = errorText;
}

function isValidTime() {
    const startDate = startDateButton.innerText;
    const endDate = endDateButton.innerText;
    if (startDate === endDate) {
        let tStart = `${timeStart.innerText}:00`;
        let tEnd = `${timeEnd.innerText}:00`;
        if(tEnd <= tStart)
            return false;
    }
    return true;
}


function toDate(dateString) {
    const splitted = dateString.split("/");
    const isoDate = splitted[2] + "-" + splitted[1] + "-" + splitted[0];
    return new Date(isoDate);
}

function compareDates(date1, date2) {
    return date1.getTime() - date2.getTime();
}

function validDates() {
    const startDate = startDateButton.innerText;
    const endDate = endDateButton.innerText;
    const startDateObj = toDate(startDate);
    const endDateObj = toDate(endDate);
    return compareDates(startDateObj, endDateObj) <= 0;
}

function theresSomeWarning() {
    const startDate = startDateButton.innerText;
    const endDate = endDateButton.innerText;
    const startDateObj = toDate(startDate);
    const endDateObj = toDate(endDate);
    if ((!isValidDate(startDate) && !isValidDate(endDate)) || !validDates()) {
        showWarning("1", "Datas inválidas.");
    } else if (!isValidDate(startDate)) {
        showWarning("1", "Data de inicio inválida.")
    } else if (!isValidDate(endDate)) {
        showWarning("1", "Data de fim inválida.")
    } else if (!isValidTime()) {
        showWarning("1", "Horas inválidas.")
    } else {
        showWarning("0", "");
    }
}

//--------------------------------------
setInterval(() => isValidButton(), 100);
setInterval(() => theresSomeWarning(), 100);


function isEditingEvent() {
    return creatingEvent.id !== undefined;
}

if (isEditingEvent()) {
    document.querySelector(".title-header h1").innerText = "Editar evento";
}