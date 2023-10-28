class TitleHeader extends HTMLElement {

    connectedCallback() {

        const header = document.createElement("header");
        header.classList.add("title-header");

        const goBack = document.createElement("span");
        goBack.id = "goBack";
        const goBackText = document.createTextNode("chevron_left");
        goBack.appendChild(goBackText);
        goBack.classList.add("material-symbols-outlined");
        goBack.addEventListener("click", () => {
            document.location.href = this.getAttribute("previous-page");
        });

        const h1 = document.createElement("h1");
        const h1Text = document.createTextNode(this.innerText);
        h1.appendChild(h1Text);
        
        const home = document.createElement("span");
        home.id = "home";
        const homeText = document.createTextNode("house");
        home.appendChild(homeText);
        home.classList.add("material-symbols-outlined", "material-fill");
        home.addEventListener("click", () => {
            document.location.href = "main-menu.html";
        });

        const hideHorribleHoleHouse = document.createElement("div");
        hideHorribleHoleHouse.classList.add("hide-hole");
        hideHorribleHoleHouse.style.width = ".3rem";
        hideHorribleHoleHouse.style.height = ".2rem";
        hideHorribleHoleHouse.style.backgroundColor = "#e9ecef";
        hideHorribleHoleHouse.style.position = "absolute";
        hideHorribleHoleHouse.style.top = ".7rem";
        hideHorribleHoleHouse.style.left = "9.5rem";

        header.appendChild(hideHorribleHoleHouse);
        header.appendChild(goBack);
        header.appendChild(h1);
        header.appendChild(home);
        this.innerText = "";
        const parent = this.parentElement;
        parent.insertBefore(header, this);
        this.remove();
    }
}
customElements.define("title-header", TitleHeader);