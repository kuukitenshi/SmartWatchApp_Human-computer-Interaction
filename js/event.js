const currentEventsButton = document.querySelector(".current-events-button");
const pendingEventsButton = document.querySelector(".pending-events-button");
const addEventButton = document.querySelector(".add-event-button");
const buttons = document.querySelectorAll(".tab-button-background button");
const tabsContainer = document.querySelector(".tabs-container");
const tabButtonSlider = document.querySelector(".tab-button-background-slider");
const currentEventsList = document.querySelector(".current-events-list");
const noCurrentEventsContainer = document.querySelector(".no-current-events-container")
const pendingEventsList = document.querySelector(".pending-events-list");
const noPendingEventsContainer = document.querySelector(".no-pending-events-container");

const noFriendsOverlay = document.querySelector(".no-friends-overlay");
const noFriendsOverlayCloseButton = document.querySelector(".no-friends-overlay-close-button");

const user = User.loadFromWebStorage();

function getLastIndex() {
    const latIndexStr = sessionStorage.getItem("event_last_index");
    if (latIndexStr !== null)
        return parseInt(latIndexStr);
    return 0;
}

const lastIndex = getLastIndex();
const scrollable = new Scrollable(tabsContainer, {scrollDirection: "horizontal", startingIndex: getLastIndex()});
adjustBackgroundSlider(lastIndex);

// --- Slider & Scroll ---

scrollable.addScrollListener((event) => {
    if (event.to === event.from)
        return;
    const currentSelected = document.querySelector(".active-tab");
    currentSelected.classList.remove("active-tab");
    const button = buttons[event.to];
    button.classList.add("active-tab");
    adjustBackgroundSlider(event.to);
    sessionStorage.setItem("event_last_index", event.to + "");
});


function currentEventButtonClick() {
    scrollable.scrollTo(0);
}

function pendingEventsButtonClick() {
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


// --- Render Events ---

function checkPendingEventsEmpty() {
    if (user.pendingEvents.length === 0) {
        pendingEventsList.classList.add("dispaly-hidden");
        noPendingEventsContainer.classList.remove("display-hidden");
    }
}

function acceptPendingEvent(event, clickEvent) {
    clickEvent.stopPropagation();
    const li = clickEvent.currentTarget.parentElement.parentElement;
    if (li.classList.contains("disappear-pending-event"))
        return;
    li.classList.add("event-accepted", "disappear-pending-event");
    createRippleEffect(li, clickEvent);
    user.removePendingEvent(event);
    user.addEvent(event);
    displaySortedCurrent();
    noCurrentEventsContainer.classList.add("display-hidden");
    currentEventsList.classList.remove("display-hidden");
    li.addEventListener("animationend", (event) => {
        if (event.animationName === "pending-event-scroll-animation") {
            li.remove();
            checkPendingEventsEmpty();
        }
    });
}

function rejectPendingEvent(event, clickEvent) {
    clickEvent.stopPropagation();
    const li = clickEvent.currentTarget.parentElement.parentElement;
    if (li.classList.contains("disappear-pending-event"))
        return;
    user.removePendingEvent(event);
    li.classList.add("event-rejected", "disappear-pending-event");
    createRippleEffect(li, clickEvent);
    li.addEventListener("animationend", (event) => {
        if (event.animationName === "pending-event-scroll-animation") {
            li.remove();
            checkPendingEventsEmpty();
        }
    });
}

function viewEvent(event) {
    sessionStorage.setItem("viewing_event", JSON.stringify(event));
    document.location.href = "view-event.html";
}


function setDivImage(div, event) {
    const imageURL = event.image;
    const urlSplit = imageURL.split("/");
    const imageFile = urlSplit[urlSplit.length - 1];
    const imageName = imageFile.substring(0, imageFile.length -4);
    div.classList.add("event-image-" + imageName);
}

function createCurrentEventCard(event) {
    const li = document.createElement("li");
    li.classList.add("event-card", "current-event-card", "ripple-button");
    li.addEventListener("mousedown", (mouseEvent) => {
        createRippleEffect(li, mouseEvent);
    });
    li.addEventListener("click", () => {
        viewEvent(event);
    });
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("event-image");
    setDivImage(imgDiv, event);
    const div = document.createElement("div");
    div.classList.add("event-card-date-time");
    const p = document.createElement("p");
    p.innerText = event.start_date + " " + event.start_time;
    const h1 = document.createElement("h1");
    h1.innerText = event.title;
    div.appendChild(p);
    div.appendChild(h1);
    li.appendChild(imgDiv);
    li.appendChild(div);
    currentEventsList.appendChild(li);
}

function createPendingEventCard(event) {
    const li = document.createElement("li");
    li.classList.add("event-card", "pending-event-card", "ripple-button");
    li.addEventListener("click", () => {
        viewEvent(event);
    });
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("pending-event-card-info-container");
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("event-image");
    setDivImage(imgDiv, event);
    const dateTimeDiv = document.createElement("div");
    dateTimeDiv.classList.add("event-card-date-time");
    const p = document.createElement("p");
    p.innerText = event.start_date + " " + event.start_time;
    const h1 = document.createElement("h1");
    h1.innerText = event.title;
    dateTimeDiv.appendChild(p);
    dateTimeDiv.appendChild(h1);
    infoDiv.appendChild(imgDiv);
    infoDiv.appendChild(dateTimeDiv);
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("pending-event-buttons-container");
    const rejectButton = document.createElement("span");
    rejectButton.classList.add("material-symbols-outlined", "reject-pending-event-button");
    rejectButton.innerText = "cancel";
    rejectButton.addEventListener("click", (clickEvent) => rejectPendingEvent(event, clickEvent));
    const acceptButton = document.createElement("span");
    acceptButton.classList.add("material-symbols-outlined", "accept-pending-event-button");
    acceptButton.innerText = "check_circle"
    acceptButton.addEventListener("click", (clickEvent) => acceptPendingEvent(event, clickEvent));
    buttonsDiv.appendChild(rejectButton);
    buttonsDiv.appendChild(acceptButton);
    li.appendChild(infoDiv);
    li.appendChild(buttonsDiv);
    pendingEventsList.appendChild(li);
}

function renderEvents() {
    if (user.currentEvents.length === 0) {
        currentEventsList.classList.add("display-hidden");
        noCurrentEventsContainer.classList.remove("dispaly-hidden");
    } else {
        noCurrentEventsContainer.classList.add("display-hidden");
        currentEventsList.classList.remove("display-hidden");
        displaySortedCurrent();
    }
    if (user.pendingEvents.length === 0) {
        pendingEventsList.classList.add("display-hidden");
        noPendingEventsContainer.classList.remove("display-hidden");
    } else {
        noPendingEventsContainer.classList.add("display-hidden");
        pendingEventsList.classList.remove("display-hidden");
        const copiedPendingEvents = JSON.parse(JSON.stringify(user.pendingEvents));
        copiedPendingEvents.sort(compareToEventsTime);
        copiedPendingEvents.forEach(event => {
            createPendingEventCard(event);
        });
    }
}

noFriendsOverlayCloseButton.addEventListener("click", () => {
    hideOverlay(noFriendsOverlay);
});

currentEventsButton.addEventListener("click", currentEventButtonClick);
pendingEventsButton.addEventListener("click", pendingEventsButtonClick);
addEventButton.addEventListener("click", () => {
    if (user.friends.length === 0) {
        showOverlay(noFriendsOverlay);
    } else {
        document.location.href = "event-title.html";
    }
});

window.addEventListener("load", () => {
    // adjustBackgroundSlider(0);
    tabButtonSlider.style.opacity = "1";
});
renderEvents();

sessionStorage.removeItem("creating_event");


function displaySortedCurrent() {
    currentEventsList.innerHTML = "";
    const copiedCurrentEvents = JSON.parse(JSON.stringify(user.currentEvents));
    copiedCurrentEvents.sort(compareToEventsTime);
    copiedCurrentEvents.forEach(event => {
        createCurrentEventCard(event);
    });
}

function toISOString(dateString) {
    const splitted = dateString.split("/");
    return `${splitted[2]}-${splitted[1]}-${splitted[0]}`;
}

function compareToEventsTime(event1, event2) {
    let event1Time = new Date(toISOString(event1.start_date)).getTime();
    let event2Time = new Date(toISOString(event2.start_date)).getTime();

    if(event1Time > event2Time)
        return 1;
    else if(event1Time < event2Time)
        return -1;
    else if (`${event1.start_time}:00` > `${event2.start_time}:00`)
        return 1;
    else if (`${event1.start_time}:00` < `${event2.start_time}:00`)
        return -1;
    return 0;
}
