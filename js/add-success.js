const user = User.loadFromWebStorage();

const nonFriends = [];

for (let otherUser of userDatabase) {
    if (!user.isFriendWith(otherUser)) {
        nonFriends.push(otherUser);
    }
}

const rng = Math.floor(Math.random() * nonFriends.length);

user.addFriend(nonFriends[rng]);