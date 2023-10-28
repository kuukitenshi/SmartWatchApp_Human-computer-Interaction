class Profile {
    name = "";
    id = 0;
    image = "../images/profile.png";

    constructor(name, id, image) {
        this.name = name || this.name;
        this.id = id || this.id;
        this.image = image || this.image;
    }
}

const userDatabase = 
[
    new Profile("Angelo", 101010, "../images/andre.webp"),
    new Profile("Vrás", 202020, "../images/bras.webp"),
    new Profile("Daniula", 303030, "../images/daniela.webp"),
    new Profile("Danunes", 404040, "../images/daniel.webp"),
    new Profile("NoNameBoy", 505050, "../images/diogo.webp"),
    new Profile("Gaaajo", 606060, "../images/goncalo.webp"),
    new Profile("Guizinho", 707070, "../images/gui.webp"),
    new Profile("CampoBoy", 808080, "../images/joao.webp"),
    new Profile("Martim", 909090, "../images/martim.png"),
    new Profile("π-lo", 100100, "../images/pilo.webp"),
    new Profile("Rafa G", 110110, "../images/rafa.webp"),
    new Profile("Sequeira", 120120, "../images/wang.webp")
];

class User {
    profile = new Profile("Miguel", 123456, "../images/myprofilepicture.png");
    friends = [userDatabase[0], userDatabase[7]]
    requests = [userDatabase[3], userDatabase[6]];
    currentEvents = [];
    pendingEvents = [];
    nextEventId = 0;

    constructor(profile, friends, requests, currentEvents, pendingEvents) {
        this.profile = profile || this.profile;
        this.friends = friends || this.friends;
        this.requests = requests || this.requests;
        this.currentEvents = currentEvents || [];
        this.pendingEvents = pendingEvents || 
        [
            {
                "id": 0,
                "title": "Game night",
                "image": "../images/event-pics/game.jpg",
                "people": [101010, 120120, 110110, 808080],
                "start_time": "21:00",
                "end_time": "04:30",
                "start_date": "20/05/2023",
                "end_date": "21/05/2023",
                "location": "Casa do angelo",
                "description": "Ir jogar smash",
                "created_by": 101010
            },
            {
                "id": 1,
                "title": "Almoço",
                "image": "../images/event-pics/food.jpg",
                "people": [101010, 303030, 404040, 606060,707070, 808080, 909090, 110110, 120120],
                "start_time": "12:00",
                "end_time": "13:00",
                "start_date": "22/05/2023",
                "end_date": "22/05/2023",
                "location": "FDUL",
                "description": "Ir almoçar à FDUL depois da aula de história de jogos de tabuleiro",
                "created_by": 404040
            }
        ];
    }

    static loadFromWebStorage() {
        const userString = localStorage.getItem("user");
        if (userString === null) {
            const user = new User();
            user.saveToWebStorage();
            return user;
        }
        const userData = JSON.parse(userString);
        return new User(userData.profile, userData.friends, userData.requests, userData.currentEvents, userData.pendingEvents);
    }

    saveToWebStorage() {
        localStorage.setItem("user", JSON.stringify(this));
    }

    addFriend(profile) {
        this.friends.push(profile);
        for (let i = 0; i < this.requests.length; i++) {
            if (this.requests[i].id === profile.id) {
                this.requests.splice(i, 1);
                break;
            }
        }
        this.saveToWebStorage();
    }

    getProfileFromId(id) {
        if(this.profile.id === id)
            return this.profile;
        for (let i = 0; i < userDatabase.length; i++) {
            if(userDatabase[i].id === id)
                return userDatabase[i];
        }
        return null;
    }

    removeFriend(profile) {
        this.friends.splice(this.friends.indexOf(profile), 1);
        this.saveToWebStorage();
    }

    isFriendWith(profile) {
        for (let friend of this.friends) {
            if (friend.id === profile.id)
                return true;
        }
        return false;
    }

    addRequest(profile) {
        this.requests.push(profile);
        this.saveToWebStorage(); 
    }

    removeRequest(profile) {
        this.requests.splice(this.requests.indexOf(profile), 1);
        this.saveToWebStorage();
    }

    addEvent(event) {
        if (event.id === undefined)
            event.id = this.#getNextEventId();
        this.currentEvents.push(event);
        this.saveToWebStorage();
    }

    removeEvent(event) {
        const index = this.currentEvents.findIndex(e => e.id === event.id);
        this.currentEvents.splice(index, 1);
        this.saveToWebStorage();
    }

    hasCurrentEvent(event) {
        return this.currentEvents.findIndex(e => e.id === event.id) !== -1;
    }

    addPendingEvent(event) {
        if (event.id === undefined)
            event.id = this.#getNextEventId();
        this.pendingEvents.push(event);
        this.saveToWebStorage();
    }

    removePendingEvent(event) {
        const index = this.pendingEvents.findIndex(e => e.id === event.id);
        this.pendingEvents.splice(index, 1);
        this.saveToWebStorage();
    }

    #getNextEventId() {
        if (this.currentEvents.length === 0 && this.pendingEvents.length === 0)
            return 0;
        let max = 0;
        this.currentEvents.forEach(e => {
            if (e.id > max)
                max = e.id;
        });
        this.pendingEvents.forEach(e => {
            if (e.id > max)
                max = e.id;
        });
        return max+1;
    }
}