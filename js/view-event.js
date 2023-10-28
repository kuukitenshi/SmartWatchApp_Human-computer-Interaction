const peopleOverlay = document.querySelector(".people-overlay");
const locationOverlay = document.querySelector(".location-overlay");
const descriptionOverlay = document.querySelector(".description-overlay");

const confirmationOverlay = document.querySelector(".remove-event-overlay");
const leaveOrQuitButton = document.querySelector(".leave-or-quit-button");
const leaveQuitConfirmButton = document.querySelector(".remove-confirm-button");
const cancelConfirmButton = document.querySelector(".remove-cancel-button");
const viewingEvent = getVieweingEvent();
const user = User.loadFromWebStorage();
const peopleOverlayList = peopleOverlay.querySelector(".people-list");

const peopleButton = document.querySelector(".people-button");
const locationButton = document.querySelector(".location-button");
const descriptionButton = document.querySelector(".description-button");
const editButton = document.getElementById("edit-button");

const locationOverlayCloseButton = document.querySelector(".location-overlay-close-button");
const descriptionOverlayCloseButton = document.querySelector(".description-overlay-close-button");

function addPersonToOverlay(profile) {
    const li = document.createElement("li");
    li.classList.add("people-card");
    const img = document.createElement("img");
    img.src = profile.image;
    const p = document.createElement("p");
    const text = document.createTextNode(profile.name);
    p.appendChild(text);
    if (viewingEvent.created_by === profile.id) {
        const star = document.createElement("span");
        star.classList.add("material-symbols-outlined", "material-fill", "event-owner-icon");
        star.innerText = "star";
        p.appendChild(star);
    }
    li.appendChild(img);
    li.appendChild(p);
    if (viewingEvent.created_by === profile.id && peopleOverlay.children.length > 0) {
        peopleOverlayList.insertBefore(li, peopleOverlayList.children[0]);
    } else {
        peopleOverlayList.appendChild(li);
    }
}

function renderEvent() {
    updateBanner(viewingEvent.image);
    const eventTitle = document.querySelector(".event-title");
    eventTitle.innerText = viewingEvent.title;
    const eventDate = document.querySelector(".event-date");
    eventDate.innerText = viewingEvent.start_date + " - " + viewingEvent.end_date;
    const eventHours = document.querySelector(".event-time");
    eventHours.innerText = viewingEvent.start_time + " - " + viewingEvent.end_time;

    const isOwner = viewingEvent.created_by === user.profile.id;
    if (user.hasCurrentEvent(viewingEvent) && isOwner)
        addPersonToOverlay(user.profile);
    for (let i = 0; i < viewingEvent.people.length; i++) {
        const profile = user.getProfileFromId(viewingEvent.people[i]);
        addPersonToOverlay(profile);
    }
    if (user.hasCurrentEvent(viewingEvent) && !isOwner)
        addPersonToOverlay(user.profile);

    const eventLocation = document.querySelector(".location-text")
    eventLocation.innerText = viewingEvent.location;
    const eventDescription = document.querySelector(".description-text");
    eventDescription.innerText = viewingEvent.description;
}

function getVieweingEvent() {
    const eventStr = sessionStorage.getItem("viewing_event");
    return JSON.parse(eventStr);
}

leaveOrQuitButton.addEventListener("mousedown", (clickEvent) => {
    createRippleEffect(leaveOrQuitButton, clickEvent);
});

leaveOrQuitButton.addEventListener("click", () => {
    showOverlay(confirmationOverlay);
});

cancelConfirmButton.addEventListener("mousedown", (mouseEvent) => {
    createRippleEffect(cancelConfirmButton, mouseEvent);
});

cancelConfirmButton.addEventListener("click", () => {
    hideOverlay(confirmationOverlay);
});

leaveQuitConfirmButton.addEventListener("mousedown", (mouseEvent) => {
    createRippleEffect(leaveQuitConfirmButton, mouseEvent);
});

leaveQuitConfirmButton.addEventListener("click", () => {
    hideOverlay(confirmationOverlay);
    user.removeEvent(viewingEvent);
    document.location.href = "event.html";
});


// PEOPLE

peopleButton.addEventListener("click", () => {
    showOverlay(peopleOverlay);
});

locationButton.addEventListener("click", () => {
    showOverlay(locationOverlay);
});

locationOverlayCloseButton.addEventListener("click", () => {
    hideOverlay(locationOverlay);
});

descriptionButton.addEventListener("click", () => {
    showOverlay(descriptionOverlay);
});

descriptionOverlayCloseButton.addEventListener("click", () => {
    hideOverlay(descriptionOverlay);
});

editButton.addEventListener("click", () => {
    sessionStorage.setItem("creating_event", JSON.stringify(viewingEvent));
    document.location.href = "event-title.html";
});


if (user.hasCurrentEvent(viewingEvent)) {
    leaveOrQuitButton.classList.remove("display-hidden");
    if (viewingEvent.created_by === user.profile.id) {
        editButton.classList.remove("display-hidden");
        leaveOrQuitButton.innerText = "Desmarcar";
        const overlayTitle = document.querySelector(".remove-event-popup-title-container h1");
        overlayTitle.innerText = overlayTitle.innerText.replace("sair", "desmarcar");
        const overlayButtonText = document.querySelector(".remove-confirm-button");
        overlayButtonText.innerText = "Desmarcar";
    }
}

renderEvent();