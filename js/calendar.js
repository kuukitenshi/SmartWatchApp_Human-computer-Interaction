let objCalendar = { occupiedDays: [] }; //{ocupieddays: [ {date: Date(), events:[{start: 12:00, end: 23:57, description: blablabla}, ...]}, ...]}

function getIndexWeek() {
    const indexWeekStr = sessionStorage.getItem("calendar_last_index");
    if (indexWeekStr !== null)
        return parseInt(indexWeekStr);
    return 0;
}

class Calendar {

    #months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    #currentDaysHTML = document.querySelector(".days").children;

    #prevIcon = document.getElementById("arrow-icon-left");
    #nextIcon = document.getElementById("arrow-icon-right");

    #monthShow = -1;
    #yearShow = -1;

    #firstShow = this.getCurrentDate();
    #anchorSunday = this.getCurrentDate();
    #indexWeek = 0;

    #millesecOfDay = 86400000;

    constructor() {
        this.setLocalStorage();
        this.getLocalStorage();
        this.addListenerPrevNext();
        const weekDay = this.getCurrentDate().getDay();
        this.#anchorSunday = this.getDateYT(this.#firstShow.getTime(), -weekDay);
        this.#firstShow = this.#anchorSunday;
        this.#indexWeek = getIndexWeek();
        this.renderWeek(this.#indexWeek);
    }

    getCurrentDate() {
        return new Date();
    }

    getToday() {
        return this.getCurrentDate().getDate();
    }

    getCurrentMonth() {
        return this.getCurrentDate().getMonth();
    }

    getCurrentYear() {
        return this.getCurrentDate().getFullYear();
    }

    getDateYT(time, mult) {
        return new Date(time + mult * this.#millesecOfDay);
    }

    isToday(date) {
        return date.getDate() === this.getToday() &&
            date.getMonth() === this.getCurrentMonth() &&
            date.getFullYear() === this.getCurrentYear();
    }

    getWeeklyDay(month, year, day) {
        return new Date(year, month, day).getDay();
    }

    addListenerPrevNext() {
        this.#prevIcon.addEventListener("click", () => this.putPreviousWeek());
        this.#nextIcon.addEventListener("click", () => this.putNextWeek());
    }

    putMonthYearHTML(month, year) {
        let monthYear = `${this.#months[month]} ${year}`;
        const currentDateHTML = document.querySelector(".current-date");
        currentDateHTML.innerText = monthYear;
    }

    putInactiveDays() {
        let iter = this.#firstShow;
        for (let i = 0; i < this.#currentDaysHTML.length; i++) {
            if (this.getDateYT(iter.getTime(), i).getMonth() !== this.#monthShow) {
                this.#currentDaysHTML[i].classList.add("inactive");
            }
        }
    }

    putPreviousWeek() {
        this.#indexWeek -= 1;
        this.renderWeek(this.#indexWeek);
    }

    putNextWeek() {
        this.#indexWeek += 1;
        this.renderWeek(this.#indexWeek);
    }

    addOccupiedDay(li) {
        const divOccupied = document.createElement("div");
        divOccupied.classList.add("occupied-day");
        li.appendChild(divOccupied);
    }

    viewDay(date) {
        if (typeof (Storage) != "undefined")
            sessionStorage.setItem("viewDate", date.toJSON());
        document.location.href = "view-day.html";
    }

    getLocalStorage() {
        let storage = localStorage.getItem("objCalendar");
        if (storage !== null)
            objCalendar = JSON.parse(storage);
    }

    setLocalStorage() {
        if (typeof (Storage) !== "undefined") {
            let storage = localStorage.getItem("objCalendar");
            if (storage === null) {
                localStorage.setItem("objCalendar", JSON.stringify(objCalendar));
            }
        }
    }

    equalsDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }

    renderWeek(index) {
        sessionStorage.setItem("calendar_last_index", index);
        //clear classes and listeners
        for (let i = 0; i < this.#currentDaysHTML.length; i++) {
            this.#currentDaysHTML[i].classList.remove("today", "inactive");
            const replaceElem = this.#currentDaysHTML[i].cloneNode(true);
            this.#currentDaysHTML[i].parentElement.replaceChild(replaceElem, this.#currentDaysHTML[i]);
        }
        this.#firstShow = this.getDateYT(this.#anchorSunday.getTime(), index * 7);

        const monthDayMap = new Map();

        // let countDaysOfMonth = 0;
        for (let i = 0; i < this.#currentDaysHTML.length; i++) {
            let newDate = this.getDateYT(this.#firstShow.getTime(), i);
            this.#currentDaysHTML[i].innerText = newDate.getDate();
            this.#currentDaysHTML[i].addEventListener("click", () => this.viewDay(newDate));

            if (this.isToday(newDate))
                this.#currentDaysHTML[i].classList.add("today");

            const amount = monthDayMap.get(newDate.getMonth() + "-" + newDate.getFullYear()) || 0;
            monthDayMap.set(newDate.getMonth() + "-" + newDate.getFullYear(), amount+1);

            let arrOccup = objCalendar.occupiedDays;
            for (let j = 0; j < arrOccup.length; j++) { //add tracos azuis calendario
                if (this.equalsDate(new Date(arrOccup[j].date), newDate)) {
                    let arrEvents = arrOccup[j].events;
                    let count = 0;
                    for (let k = 0; k < arrEvents.length && count < 4; k++) {
                        this.addOccupiedDay(this.#currentDaysHTML[i]);
                        count++;
                    }
                }
            }
        }
        const months = monthDayMap.keys();
        let selectedMonth = undefined;
        for (let month of months) {
            if (selectedMonth === undefined) {
                selectedMonth = month;
                continue;
            }
            const days = monthDayMap.get(month);
            if (days >= monthDayMap.get(selectedMonth))
                selectedMonth = month;
        }
        const monthAndYear = selectedMonth.split("-");
        this.#monthShow = parseInt(monthAndYear[0]);
        this.#yearShow = parseInt(monthAndYear[1]);
        this.putMonthYearHTML(this.#monthShow, this.#yearShow);
        this.putInactiveDays();
    }
}

const calendar = new Calendar();
