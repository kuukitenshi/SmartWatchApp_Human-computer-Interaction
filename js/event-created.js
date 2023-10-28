const creatingEvent = getCreatingEvent();
const user = User.loadFromWebStorage();

function getCreatingEvent() {
    const creatingEventStr = sessionStorage.getItem("creating_event");
    if (creatingEventStr !== null)
        return JSON.parse(creatingEventStr);
    return {};
}

creatingEvent.created_by = user.profile.id;

user.addEvent(creatingEvent);