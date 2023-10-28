const ul = document.querySelector("ul");
const profileButton = document.getElementById("profile-button");
const calendarButton = document.getElementById("calendar-button");
const eventButton = document.getElementById("event-button");
const upArrows = document.querySelectorAll(".arrow-icon-up");
const downArrows = document.querySelectorAll(".arrow-icon-down");
const directionIcons = document.querySelectorAll("#direction-list li img");


let firstScroll = true;
// ---- Scrollable ----
function getLastIndex() {
    const lastIndexStr = sessionStorage.getItem("main_menu_lastIndex") || "1";
    const lastIndex = parseInt(lastIndexStr);
    if (lastIndex < 0 || lastIndex >= ul.children.length)
        lastIndex = 1;
    return lastIndex;
}

function initScrollable() {
    const lastIndex = getLastIndex();
    const options = new ScrollableOptions()
    options.startingIndex = lastIndex;
    return new Scrollable(ul, options);
}

ul.addEventListener("transitionstart", (event) => {
    if (event.propertyName === "transform")
        scrollable.blockScroll = true;
    if (firstScroll && scrollable.currentIndex === 1)
        scrollable.blockScroll = false;
});

ul.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform" && directionIcons[0].style.opacity !== "0")
        scrollable.blockScroll = false;
});

ul.addEventListener("transitioncancel", (event) => {
    if (event.propertyName === "transform")
        scrollable.blockScroll = false;
});



const scrollable = initScrollable();

updateDirectionIcons();

scrollable.addScrollListener((event) => {
    if (event.to !== event.from) {
        sessionStorage.setItem("main_menu_lastIndex", event.to);
        updateDirectionIcons();
        firstScroll = false;
    }
});

function updateDirectionIcons() {
    const currentActive = document.querySelector(".active-direction-icon");
    currentActive.classList.remove("active-direction-icon");
    directionIcons[scrollable.currentIndex].classList.add("active-direction-icon");
}

upArrows.forEach(x => x.addEventListener("click", () => scrollable.scrollMove(-1)));
downArrows.forEach(x => x.addEventListener("click", () => scrollable.scrollMove(1)));

for(let i = 0; i < directionIcons.length; i++) {
    directionIcons[i].addEventListener("click", () => {
        scrollable.scrollTo(i);
    });
}

// ---- Profile, Event, Calendar button clicks ----
function hideOtherElements(element) {
    for (let i = 0; i < ul.children.length; i++) {
        if (ul.children[i] !== element) {
            ul.children[i].style.opacity = "0";
        }
    }
}

function iconButtonClick(element, iframeSrc) {
    directionIcons.forEach(x => x.style.opacity = "0");
    element.style.transform = "scale(2)";
    element.style.opacity = "0";
    element.style.zIndex = "1";
    const parent = element.parentElement;
    hideOtherElements(parent.parentElement);
    for (let i = 0; i < parent.children.length; i++) {
        if (element !== parent.children[i])
            parent.children[i].style.opacity = "0";
    }
    const containerHeight = ul.children[scrollable.currentIndex].getBoundingClientRect().height;
    const elementRect = element.getBoundingClientRect();
    const desiredXPosition = containerHeight / 2 - elementRect.height / 2;
    const marginToApply = desiredXPosition - elementRect.y;
    element.style.marginTop = marginToApply + "px";
    scrollable.blockScroll = true;
    setTimeout(() => {
        document.location.href = iframeSrc;
    }, 300);
}

profileButton.addEventListener("click", () => iconButtonClick(profileButton, "profile.html"));
calendarButton.addEventListener("click", () => iconButtonClick(calendarButton, "calendar.html"));
eventButton.addEventListener("click", () => iconButtonClick(eventButton, "event.html"));


sessionStorage.removeItem("calendar_last_index");
sessionStorage.removeItem("event_last_index");