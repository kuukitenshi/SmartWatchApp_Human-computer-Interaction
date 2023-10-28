function removeRippleEffect(button) {
    const previousEffect = button.querySelector(".ripple-effect");
    if (previousEffect !== null)
        previousEffect.remove();
}

function createRippleEffect(button, event) {
    removeRippleEffect(button);
    const rippleEffect = document.createElement("span");
    rippleEffect.classList.add("ripple-effect");
    const elemRect = button.getBoundingClientRect();
    const diameter = Math.max(elemRect.width, elemRect.height);
    const radius = diameter / 2;
    rippleEffect.style.width = diameter + "px";
    rippleEffect.style.height = diameter + "px";
    rippleEffect.style.left = (event.clientX - radius - elemRect.x) + "px";
    rippleEffect.style.top = (event.clientY - radius - elemRect.y) + "px";
    button.appendChild(rippleEffect);
}