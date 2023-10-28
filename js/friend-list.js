const addFriendButton = document.querySelector(".add-friend-button");
const friendsRequestButton = document.getElementById("friends-request-button");
const friendOverlayProfileImage = document.querySelector(".friend-overlay-profile-image");
const friendOverlayProfileName = document.querySelector(".friend-overlay-profile-name");
const friendOverlayProfileCode = document.querySelector(".friend-overlay-profile-code");
const removeFriendButton = document.getElementById("remove-friend-button");
const overlay = document.querySelector(".overlay-background");
const friendsList = document.querySelector(".friends-container");
const user = User.loadFromWebStorage();

const removeConfirmOverlay = document.querySelector(".remove-confirm-popup-overlay");

const removeConfirmButton = document.querySelector(".remove-confirm-button");
const removeCancelButton = document.querySelector(".remove-cancel-button");

let selectedFriendProfile;
let selectedFriendCard;

function showFriendOverlay(profile) {
    removeRippleEffect(removeFriendButton);
    showOverlay(overlay);
    friendOverlayProfileCode.innerText = profile.id;
    friendOverlayProfileName.innerText = profile.name;
    friendOverlayProfileImage.src = profile.image;
}

removeFriendButton.addEventListener("mousedown", (event) => {
    createRippleEffect(event.currentTarget, event);
});

removeFriendButton.addEventListener("click", () => {
    removeRippleEffect(removeCancelButton);
    removeRippleEffect(removeConfirmButton);
    showOverlay(removeConfirmOverlay);
    const title = removeConfirmOverlay.querySelector(".remove-confirm-popup-title-container").querySelector("h1");
    title.innerText = "Remover " + selectedFriendProfile.name + " dos amigos?";
});

addFriendButton.addEventListener("click", () => {
    document.location.href = "add-friend.html";
});

friendsRequestButton.addEventListener("click", () => {
    document.location.href = "friend-requests.html";
});

function createFriendCard(profile) {
    const friendsList = document.querySelector(".friends-container");
    const li = document.createElement("li");
    li.classList.add("friend-card");
    const img = document.createElement("img");
    img.src = profile.image;
    const p = document.createElement("p");
    p.innerText = profile.name;
    li.appendChild(img);
    li.appendChild(p);
    friendsList.append(li);
    li.addEventListener("click", () => {
        showFriendOverlay(profile);
        selectedFriendProfile = profile;
        selectedFriendCard = li;
    });
}

function renderFriendList() {
    const requestsAmountLabel = document.getElementById("friends-request-amount");
    if (user.requests.length > 0) {
        requestsAmountLabel.innerText = user.requests.length;
        requestsAmountLabel.classList.remove("display-hidden");
    }
    if (user.friends.length > 0) {
        document.querySelector(".no-friends-container").classList.add("display-hidden");
        document.querySelector(".friends-container").classList.remove("display-hidden");

        const copiedFriends = JSON.parse(JSON.stringify(user.friends));
        copiedFriends.sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
        copiedFriends.forEach(friend => {
            createFriendCard(friend);
        });
    }
}

removeConfirmButton.addEventListener("mousedown", (event) => {
    createRippleEffect(event.currentTarget, event);
});

removeCancelButton.addEventListener("mousedown", () => {
    createRippleEffect(event.currentTarget, event);
});

removeConfirmButton.addEventListener("click", () => {
    selectedFriendCard.remove();
    user.removeFriend(selectedFriendProfile);
    if (user.friends.length === 0) {
        friendsList.classList.add("display-hidden");
        document.querySelector(".no-friends-container").classList.remove("display-hidden");
    }
    hideOverlay(removeConfirmOverlay);
    hideOverlay(overlay);
});

removeCancelButton.addEventListener("click", () => {
    hideOverlay(removeConfirmOverlay);
});

renderFriendList();