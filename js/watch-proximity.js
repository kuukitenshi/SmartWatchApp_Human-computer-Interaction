const user = User.loadFromWebStorage();

setTimeout(() => {
    if (user.friends.length === userDatabase.length) {
        document.location.href = "add-failed.html"
        return;
    }
    const rng = Math.random();
    if (rng < 0.5)
        document.location.href = "add-failed.html"
    else
        document.location.href = "add-success.html"
}, 2000);