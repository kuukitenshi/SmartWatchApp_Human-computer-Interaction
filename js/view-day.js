const addOccupiedHourButton = document.getElementById("add-occupied-hour");
const viewDay = document.getElementById("day-view");
const containerOccups = document.querySelector(".container-occupied-hours");
let currentDate;

//----------------------------------------------------------
addOccupiedHourButton.addEventListener("click", () => {
    document.location.href = "occupied-day.html";
});

//---------------------------------------------------------------------------------

function setDate() {
    let storageDate = sessionStorage.getItem("viewDate");
    if (storageDate !== null) {
        currentDate = new Date(storageDate);
        let formatDate = setFormatZero(currentDate.getDate()) + "/" + setFormatZero(currentDate.getMonth() + 1) + "/" + setFormatZero(currentDate.getFullYear());
        viewDay.innerText = formatDate;
    }
}

function setFormatZero(number) {
    return number < 10 ? `0${number}` : "" + number;
}


function compareOccups(occup1, occup2) {
    if (`${occup1.start}:00` > `${occup2.start}:00`)
        return 1;
    else if (`${occup1.start}:00` < `${occup2.start}:00`)
        return -1;
    return 0;
}

function renderOccup() {
    let objCalendar = localStorage.getItem("objCalendar");
    if (objCalendar === null) {
        createFreeDay();
    } else {
        let obj = JSON.parse(objCalendar);
        let arrOccup = obj.occupiedDays;
        for (let i = 0; i < arrOccup.length; i++) {
            if (equalsDate(new Date(arrOccup[i].date), currentDate)) {
                arrOccup[i].events.sort(compareOccups);
                buildOccups(arrOccup[i]); //{date: Date(), events:[{start: 12:00, end: 23:57, description: blablabla}
            }
        }
        if (containerOccups.innerText === "")
            createFreeDay();
    }
}

function equalsDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

function createFreeDay() {
    containerOccups.innerHTML = "";
    let p = document.createElement("p");
    p.innerText = "Dia livre";
    p.classList.add("day-free");
    containerOccups.appendChild(p);
}

function buildOccups(objDateEvents) {
    containerOccups.innerHTML = "";
    let eventsArr = objDateEvents.events;
    for (let i = 0; i < eventsArr.length; i++) {
        let dayContainer = document.createElement("div");
        let headerDay = document.createElement("div");
        let pHour = document.createElement("p");
        let showMore = document.createElement("span");
        let divEditBtn = document.createElement("div");
        let spanEditBtn = document.createElement("span");

        pHour.innerText = `${eventsArr[i].start} - ${eventsArr[i].end}`;
        pHour.classList.add("time");

        showMore.innerText = "expand_more";
        showMore.classList.add("show-more");
        showMore.classList.add("material-symbols-outlined");

        divEditBtn.id = "edit-button";
        spanEditBtn.id = "icon-edit";
        spanEditBtn.classList.add("material-symbols-outlined");
        spanEditBtn.innerText = "edit";
        divEditBtn.appendChild(spanEditBtn);
        divEditBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            editOccupiedDay(eventsArr[i], i);
        });

        headerDay.classList.add("header-day");
        headerDay.addEventListener("click", (event) => {
            showMoreLess(eventsArr[i].description, event.currentTarget.parentElement);
        });

        headerDay.appendChild(pHour);
        headerDay.appendChild(showMore);
        headerDay.appendChild(divEditBtn);
        dayContainer.classList.add("day-container");
        dayContainer.classList.add("ripple-button");
        dayContainer.appendChild(headerDay);
        containerOccups.appendChild(dayContainer);
    }
}


function showMoreLess(description, dayContainer) {
    const arrow = dayContainer.children[0].children[1];
    const dayContChilds = dayContainer.children;

    if (dayContChilds.length === 1) { //estica
        let footer = document.createElement("div");
        let descrip = document.createElement("div");
        let pDesc = document.createElement("p");
        pDesc.innerText = description;
        descrip.classList.add("description");
        descrip.appendChild(pDesc);
        footer.classList.add("footer");
        footer.appendChild(descrip);
        const removebtn = createRemoveButton();
        footer.appendChild(removebtn.parentElement);

        footer.classList.add("show-desc");
        removebtn.classList.add("show-btn");
        dayContainer.appendChild(footer);
        arrow.style.transform = "rotate(180deg)";

        footer.addEventListener("animationend", (event) => {
            if (event.animationName === "show-desc-animation") {
                footer.classList.remove("show-desc");
            }
        });

        removebtn.addEventListener("animationend", (event) => {
            if (event.animationName === "show-btn-animation") {
                removebtn.classList.remove("show-btn");
            }
        });

    } else { //encolhe
        let descAndButtonRemove = dayContainer.children[1];
        const removebtn = dayContainer.children[1].children[1].children[0];
        removebtn.classList.add("hide-desc");
        descAndButtonRemove.classList.add("hide-desc");
        arrow.style.transform = "rotate(0deg)";

        descAndButtonRemove.addEventListener("animationend", (event) => {
            if (event.animationName === "hide-desc-animation") {
                descAndButtonRemove.remove();
            }
        });
    }
}

function createRemoveButton() {
    const div = document.createElement("div");
    div.classList.add("remove-occupied-button-container");
    const removeOccupButton = document.createElement("span");
    removeOccupButton.classList.add("material-symbols-outlined", "remove-occupied-button");
    removeOccupButton.innerText = "cancel";
    removeOccupButton.addEventListener("click", (event) => removeOccupButtonAction(event));
    div.appendChild(removeOccupButton);
    return removeOccupButton;
}

function removeOccupButtonAction(buttonElemHTML) {
    let currentDayContainer = buttonElemHTML.currentTarget.parentElement.parentElement.parentElement;
    createRippleEffect(currentDayContainer, buttonElemHTML);
    currentDayContainer.classList.add("disappear-occuped-day");
    currentDayContainer.addEventListener("animationend", (event) => {
        if (event.animationName === "requests-scroll-animation") {
            containerOccups.removeChild(currentDayContainer);
            if (containerOccups.children.length === 0)
                createFreeDay();
        }
    });
    let stringHours = buttonElemHTML.currentTarget.parentElement.parentElement.parentElement.children[0].children[0].innerText;
    let startHour = stringHours.substring(0, 5);
    let endHour = stringHours.substring(8);
    let desc = buttonElemHTML.currentTarget.parentElement.parentElement.children[0].children[0].innerText;
    removeFromLocalStorage(startHour, endHour, desc);
}


function removeFromLocalStorage(startHour, endHour, desc) {
    let storage = localStorage.getItem("objCalendar");
    if (storage !== null) {
        let objCalendar = JSON.parse(storage);
        let arr = objCalendar.occupiedDays;
        for (let i = 0; i < arr.length; i++) {
            if (equalsDate(currentDate, new Date(arr[i].date))) {
                let eventsArr = arr[i].events;
                for (let j = 0; j < eventsArr.length; j++) {
                    if (eventsArr[j].start === startHour && eventsArr[j].end === endHour && eventsArr[j].description === desc) {
                        eventsArr.splice(j, 1);
                        break;
                    }
                }
            }
        }
        if (typeof (Storage) != "undefined")
            localStorage.setItem("objCalendar", JSON.stringify(objCalendar));
    }
}

//---------------------------------------------------
function editOccupiedDay(dayObj, index) {
    const editingDay = {start: dayObj.start, 
                        end: dayObj.end, 
                        description: dayObj.description,
                        index: index};

    if (typeof (Storage) != "undefined")
        sessionStorage.setItem("editing_day", JSON.stringify(editingDay));
    document.location.href = "occupied-day.html";
}


//-------------run-------------------------

setDate();
renderOccup();

sessionStorage.removeItem("editing_day");
