class ScrollableOptions {
    startingIndex = 0;
    touchThreshold = 48;
    scrollDirection = "vertical";
}

class Scrollable {

    #scrollEvents = [];

    constructor(scrollableElement, scrollableOptions = new ScrollableOptions()) {
        this.scrollableOptions = scrollableOptions;
        this.scrollableElement = scrollableElement;
        this.currentIndex = scrollableOptions.startingIndex || 0;
        this.scrollDirection = scrollableOptions.scrollDirection === "horizontal" ? "horizontal" : "vertical";
        this.touchThreshold = scrollableOptions.touchThreshold || 48;
        
        scrollableElement.addEventListener("touchstart", (event) => {
            this.#handleTouchEvent(event);
        }, {passive: false});
        
        scrollableElement.addEventListener("touchmove", (event) => {
            if (this.#handleTouchMoveEvent(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, {passive: false});
        
        scrollableElement.addEventListener("wheel", (event) => {
            if (this.#handleWheelEvent(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, {passive: false});
        this.scrollTo(this.currentIndex);
    }


    scrollTo(index) {
        if (this.blockScroll)
            return;
        const scrollEvent = {
            element: this.scrollableElement, 
            from: this.currentIndex, 
            to: index, 
            cancelled: false, 
            stopPropagation: false
        };
        this.currentIndex = index;
        for (let i = 0; i < this.#scrollEvents.length; i++) {
            this.#scrollEvents[i](scrollEvent);
            if (scrollEvent.stopPropagation)
                break;
        }
        if (scrollEvent.cancelled)
            return;
        if (this.scrollDirection === "vertical")
            this.#verticalScrollTo(index);
        else
            this.#horizontalScrollTo(index);
    }

    scrollMove(direction) {
        const index = Math.max(Math.min(this.currentIndex + direction, this.scrollableElement.children.length - 1), 0);
        this.scrollTo(index);
    }

    addScrollListener(listenerFunction) {
        this.#scrollEvents.push(listenerFunction);
        return listenerFunction;
    }

    removeScrollListener(listenerFunction) {
        this.#scrollEvents.splice(this.#scrollEvents.indexOf(listenerFunction), 1);
    }

    #verticalScrollTo(index) {
        let scrollAmount = 0;
        for (let i = 0; i < index; i++) {
            scrollAmount += this.scrollableElement.children[index].getBoundingClientRect().height;
        }
        this.scrollableElement.style.transform = `translate(0, -${scrollAmount}px)`;
    }

    #horizontalScrollTo(index) {
        let scrollAmount = 0;
        for (let i = 0; i < index; i++) {
            scrollAmount += this.scrollableElement.children[index].getBoundingClientRect().width;
        }
        this.scrollableElement.style.transform = `translate(-${scrollAmount}px, 0px)`;
    }

    #handleTouchEvent(event) {
        if (this.scrollDirection === "vertical")
            this.lastTouch = event.touches[0].clientY;
        else
            this.lastTouch = event.touches[0].clientX;
    }

    #handleTouchMoveEvent(event) {
        if (this.scrollDirection === "vertical") {
            let currentY = event.changedTouches[0].clientY;
            let moveAmount = Math.abs(currentY - this.lastTouch);
            if (moveAmount > (this.touchThreshold || 48)) {
                if (currentY > this.lastTouch)
                    this.scrollMove(-1);
                else
                    this.scrollMove(1);
                this.lastTouch = currentY;
                return true;
            }
        } else {
            let currentX = event.changedTouches[0].clientX;
            let moveAmount = Math.abs(currentX - this.lastTouch);
            if (moveAmount > (this.touchThreshold || 48)) {
                if (currentX > this.lastTouch)
                    this.scrollMove(-1);
                else
                    this.scrollMove(1);
                this.lastTouch = currentX;
                return true;
            }
        }
        return false;
    }

    #handleWheelEvent(event) {
        if ((this.scrollDirection === "vertical" && !event.shiftKey) || (this.scrollDirection === "horizontal" && event.shiftKey)) {
            if (event.deltaY < 0)
                this.scrollMove(-1);
            else if (event.deltaY > 0)
                this.scrollMove(1);
            return true;
        }
        return false;
    }
}