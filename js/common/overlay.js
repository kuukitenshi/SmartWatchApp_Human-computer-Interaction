class DisplayOverlay extends HTMLElement {

    connectedCallback() {
        const overlayBackground = document.createElement("div");
        overlayBackground.classList.add("overlay-background", "display-hidden", "overlay-type-display");
        this.classList.forEach(clazz => {
            overlayBackground.classList.add(clazz);
        });

        const overlayContainer = document.createElement("div");
        overlayContainer.classList.add("overlay-container");
        overlayContainer.addEventListener("click", (event) => {
            if (event.target === overlayContainer)
                hideOverlay(overlayBackground);
        });

        const overlayDownArrowContainer = document.createElement("div");
        overlayDownArrowContainer.classList.add("overlay-down-arrow-container");
        const downArrowIcon = document.createElement("span");
        downArrowIcon.classList.add("material-symbols-outlined", "overlay-down-arrow");
        downArrowIcon.innerText = "chevron_left";
        downArrowIcon.addEventListener("click", () => {
            hideOverlay(overlayBackground);
        });
        overlayDownArrowContainer.appendChild(downArrowIcon);
        overlayContainer.appendChild(overlayDownArrowContainer);

        const overlayContentContainer = document.createElement("div");
        overlayContentContainer.classList.add("overlay-content-container");
        overlayContentContainer.innerHTML = this.innerHTML;
        overlayContainer.appendChild(overlayContentContainer);
        overlayBackground.appendChild(overlayContainer);

        const parent = this.parentElement;
        parent.insertBefore(overlayBackground, this);
        this.remove();
    }
}


class PopupOverlay extends HTMLElement {
    
    connectedCallback() {
        const overlayBackground = document.createElement("div");
        overlayBackground.classList.add("overlay-background", "display-hidden", "overlay-type-popup");
        this.classList.forEach(clazz => {
            overlayBackground.classList.add(clazz);
        });

        const overlayContainer = document.createElement("div");
        overlayContainer.classList.add("overlay-container");
        overlayContainer.addEventListener("click", (event) => {
            if (event.target === overlayContainer)
                hideOverlay(overlayBackground);
        });

        const overlayContentContainer = document.createElement("div");
        overlayContentContainer.classList.add("overlay-content-container");
        overlayContentContainer.innerHTML = this.innerHTML;
        overlayContainer.appendChild(overlayContentContainer);
        overlayBackground.appendChild(overlayContainer);
        const parent = this.parentElement;
        parent.insertBefore(overlayBackground, this);
        this.remove();
    }
}

customElements.define("display-overlay", DisplayOverlay);
customElements.define("popup-overlay", PopupOverlay);

function showOverlay(overlayBackground) {
    overlayBackground.classList.add("overlay-blur-in-animation");
    overlayBackground.classList.remove("display-hidden");
    overlayBackground.addEventListener("animationend", () => {
        overlayBackground.classList.remove("overlay-blur-in-animation");
    }, {once: true});

    const overlayContainer = overlayBackground.querySelector(".overlay-container");
    overlayContainer.classList.add("overlay-show-animation");
    overlayContainer.addEventListener("animationend", () => {
        overlayContainer.classList.remove("overlay-show-animation");
    }, {once: true});
}


function hideOverlay(overlayBackground) {
    overlayBackground.classList.add("overlay-blur-out-animation");
    overlayBackground.addEventListener("animationend", () => {
        overlayBackground.classList.add("display-hidden");
        overlayBackground.classList.remove("overlay-blur-out-animation");
    }, {once: true});

    const overlayContainer = overlayBackground.querySelector(".overlay-container");
    overlayContainer.classList.add("overlay-hide-animation");
    overlayContainer.addEventListener("animationend", () => {
        overlayContainer.classList.remove("overlay-hide-animation");
    }, {once: true});

}