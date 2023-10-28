const leftArrowButton = document.querySelector(".left-bar-arrow-container span");
const rightArrowButton = document.querySelector(".right-bar-arrow-container span");
const rippleButtons = document.querySelectorAll(".ripple-button");
const iframe = document.querySelector("iframe");
const infoCard = document.querySelector(".info-card");
const infoButton = document.querySelector(".outline-circle");

window.addEventListener("load", () => {
    document.querySelectorAll(".hide-transition").forEach(elem => {
        elem.classList.remove("hide-transition");
    });
});

rippleButtons.forEach(button => button.addEventListener("mousedown", (event) => {
    createRippleEffect(event.currentTarget, event);
}));

function resetRippleEffects() {
    rippleButtons.forEach(button => removeRippleEffect(button));
}

// Sidebars

let tasksInterval;
let devToolsInterval;

function showSidebar(sidebar) {
    resetRippleEffects();
    const sidebarList = sidebar.querySelector("ul");
    let index = 0;
    return setInterval(() => {
        if (index == sidebarList.children.length) {
            return;
        }
        sidebarList.children[index].classList.remove("display-hidden");
        index++;
    }, 80);
}

function arrowClick(event) {
    const arrow = event.currentTarget;
    const sideBar = arrow.parentElement.parentElement.parentElement;
    if (arrow.classList.contains("arrow-rotated")) {
        sideBar.addEventListener("transitionend", () => {
            const sidebarList = sideBar.querySelector("ul");
            for (let i = 0; i < sidebarList.children.length; i++) {
                sidebarList.children[i].classList.add("display-hidden");
            }
        }, {once: true});
        arrow.classList.remove("arrow-rotated");
        sideBar.classList.remove("sidebar-open");
        if (sideBar.classList.contains("left-bar")) {
            clearInterval(tasksInterval);
        } else if (sideBar.classList.contains("right-bar")) {
            clearInterval(devToolsInterval);
        }
    } else {
        arrow.classList.add("arrow-rotated");
        sideBar.classList.add("sidebar-open");
        if (sideBar.classList.contains("left-bar")) {
            tasksInterval = showSidebar(sideBar);
        } else if (sideBar.classList.contains("right-bar")) {
            devToolsInterval = showSidebar(sideBar);
        }
    }
}

leftArrowButton.addEventListener("click", arrowClick);
rightArrowButton.addEventListener("click", arrowClick);


// Info

infoButton.addEventListener("click", () => {
    if (infoCard.classList.contains("display-hidden")) {
        infoCard.classList.remove("info-card-hide-animation");
        infoCard.classList.add("info-card-show-animation")
        infoCard.classList.remove("display-hidden");
        infoCard.addEventListener("animationend", (event) => {
            if (event.animationName === "info-card-show-animation")
                infoCard.classList.remove("info-card-show-animation");
        }, {once: true});
    } else {
        infoCard.classList.remove("info-card-show-animation");
        infoCard.classList.add("info-card-hide-animation");
        infoCard.addEventListener("animationend", (event) => {
            if (event.animationName === "info-card-show-animation")
                infoCard.classList.remove("info-card-hide-animation");
                infoCard.classList.add("display-hidden");
        }, {once: true});
    }
});

// DEV TOOLS

const resetAppButton = document.querySelector(".reset-app-button");
const goToScreenButton = document.querySelector(".go-to-screen-button");

resetAppButton.addEventListener("click", () => {
    sessionStorage.clear();
    localStorage.clear();
    iframe.src = "html/main-menu.html";
});

goToScreenButton.addEventListener("click", () => {
    const screenText = prompt("What screen?");
    if (screenText !== null && screenText !== "") {
        iframe.src = "html/" + screenText + ".html";
        iframe.addEventListener("load", () => {
            if (iframe.contentDocument !== null && iframe.contentDocument.title === "Error") {
                iframe.src = "html/main-menu.html";
                alert("Invalid page!");
            }
        }, {once: true});
    } else {
        alert("Invalid page!");
    }
});