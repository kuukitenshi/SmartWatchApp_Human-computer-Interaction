const friendsButton = document.querySelector(".friends-button");
const editProfileButton = document.querySelector(".edit-profile-button");

const user = User.loadFromWebStorage();


function renderProfile() {
    const profilePicture = document.querySelector(".profile-picture");
    const profileName = document.querySelector(".profile-name");
    const profileId = document.querySelector(".profile-id");

    profilePicture.src = user.profile.image;
    profileName.innerText = user.profile.name;
    profileId.innerText = user.profile.id;
}

// ----- Links -----

friendsButton.addEventListener("click", () => {
    document.location.href = "friend-list.html";
});

editProfileButton.addEventListener("click", () => {
    document.location.href = "edit-profile.html";
});

renderProfile();