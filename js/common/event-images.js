function updateBanner(imgLink) {
    const banner = document.querySelector(".banner");
    banner.style.backgroundImage = `url("${imgLink}")`;
    banner.style.backgroundSize = "4.5cm 2cm";
    if(imgLink.includes("game")) {
        banner.style.backgroundPosition = "50% 0";
        banner.style.backgroundSize = "6cm 2cm";
    }
    else if(imgLink.includes("books"))
        banner.style.backgroundPosition = "50% 90%";
    else if(imgLink.includes("friends"))
        banner.style.backgroundPosition = "50% 20%";
    else if(imgLink.includes("travel"))
        banner.style.backgroundPosition = "80% 60%";
}