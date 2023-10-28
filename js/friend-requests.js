const requestsList = document.querySelector(".friend-requests-list");
const noRequestsContainer = document.querySelector(".no-requests-container");
const user = User.loadFromWebStorage();

function buttonClick(event) {
    const button = event.currentTarget;
    const friendRequestContainer = button.parentElement.parentElement;
    button.classList.add("material-fill");
    createRippleEffect(friendRequestContainer, event);
    friendRequestContainer.classList.add("disappear-request");
    friendRequestContainer.addEventListener("animationend", (event) => {
        if (event.animationName === "requests-scroll-animation") {
            friendRequestContainer.remove();
            if (requestsList.children.length === 0) {
                requestsList.classList.add("display-hidden");
                noRequestsContainer.classList.remove("display-hidden");
            }
        }
    });
}

function acceptFriend(event, profile) {
    const button = event.currentTarget;
    const friendRequestContainer = button.parentElement.parentElement;
    if (friendRequestContainer.classList.contains("friend-accepted") || friendRequestContainer.classList.contains("friend-reject"))
        return;
    friendRequestContainer.classList.add("friend-accepted");
    buttonClick(event);
    user.removeRequest(profile);
    user.addFriend(profile);
}

function rejectFriend(event, profile) {
    const button = event.currentTarget;
    const friendRequestContainer = button.parentElement.parentElement;
    if (friendRequestContainer.classList.contains("friend-accepted") || friendRequestContainer.classList.contains("friend-reject"))
        return;
    friendRequestContainer.classList.add("friend-rejected");
    user.removeRequest(profile);
    buttonClick(event);
}

function createRequestCard(profile) {
    const li = document.createElement("li");
    li.classList.add("friend-request", "ripple-button");
    const profileDiv = document.createElement("div");
    profileDiv.classList.add("friend-request-profile");
    const img = document.createElement("img");
    img.src = profile.image;
    const p = document.createElement("p");
    p.innerText = profile.name;
    profileDiv.appendChild(img);
    profileDiv.appendChild(p);
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("friend-request-buttons");
    const rejectButton = document.createElement("span");
    rejectButton.classList.add("material-symbols-outlined", "friend-reject-button");
    rejectButton.innerText = "cancel";
    rejectButton.addEventListener("click", (event) => rejectFriend(event, profile));
    const acceptButton = document.createElement("span");
    acceptButton.classList.add("material-symbols-outlined", "friend-accept-button");
    acceptButton.innerText = "check_circle";
    acceptButton.addEventListener("click", (event) => acceptFriend(event, profile));
    buttonsDiv.appendChild(rejectButton);
    buttonsDiv.appendChild(acceptButton);
    li.appendChild(profileDiv);
    li.appendChild(buttonsDiv);
    requestsList.appendChild(li);
}

function renderRequests() {
    if (user.requests.length > 0) {
        noRequestsContainer.classList.add("display-hidden");
        requestsList.classList.remove("display-hidden");
        user.requests.forEach(profile => {
            createRequestCard(profile)
        });
    }
}

renderRequests();