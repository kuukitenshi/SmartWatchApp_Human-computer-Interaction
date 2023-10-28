const creatingEvent = getCreatingEvent();
const user = User.loadFromWebStorage();

function getCreatingEvent() {
    const creatingEventStr = sessionStorage.getItem("creating_event");
    if (creatingEventStr !== null)
        return JSON.parse(creatingEventStr);
    return {};
}

const index = user.currentEvents.findIndex(e => e.id === creatingEvent.id);
user.currentEvents[index] = creatingEvent;
user.saveToWebStorage();
sessionStorage.setItem("viewing_event", JSON.stringify(creatingEvent));