import Bar from "./Bar.js";
export default class BarManager {
    constructor(sceneElement) {
        this.BAR_REORDERING_ANIMATION_SPEED = 100;
        this.baseState = [];
        this.visualState = [];
        this.animationSpeedMultiplier = 1;
        this.sceneElement = sceneElement;
        sceneElement.onmousedown = () => {
            if (this.onUserInteraction)
                this.onUserInteraction();
        };
    }
    createBars(number = 1) {
        for (var index = 0; index < number; index++) {
            const newBar = new Bar(this.sceneElement, undefined, true, 100);
            newBar.setAnimationSpeedMultiplier(this.animationSpeedMultiplier);
            this.visualState.push(newBar);
            const newBarElement = newBar.getElement();
            newBarElement.onmousedown = (e) => {
                e.preventDefault();
                var dragOffset = e.clientX - newBarElement.getBoundingClientRect().left;
                document.onmousemove = (e) => this.dragBar(e, newBar, dragOffset);
                document.onmouseup = (e) => {
                    index = this.getIndexFromId(newBar.getId());
                    newBar.setPosition(this.getPositionFromIndex(index), { moveDuration: this.BAR_REORDERING_ANIMATION_SPEED });
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        }
        for (var bar of this.baseState) {
            bar.setMaxValue(this.baseState.length);
        }
        this.captureNewBaseArray();
        if (this.onVisualStateChange)
            this.onVisualStateChange();
        this.updateAllWidthsAndPositions();
    }
    dragBar(e, bar, dragOffset, n = 0) {
        const index = this.visualState.findIndex((item) => item === bar);
        const barWidth = this.sceneElement.clientWidth / this.visualState.length;
        const newLocation = e.clientX - this.sceneElement.getBoundingClientRect().left - dragOffset;
        const centerOfMovingBar = newLocation + (barWidth / 2);
        var rightSidePositionOfLeftBar;
        try {
            rightSidePositionOfLeftBar = parseInt(this.visualState[index - 1].getPosition()) + barWidth;
        }
        catch (_a) {
            rightSidePositionOfLeftBar = undefined;
        }
        const isMovingLeft = centerOfMovingBar < 0 || centerOfMovingBar < rightSidePositionOfLeftBar;
        bar.setPosition(newLocation + "px", { moveDuration: 0 });
        var barsWereSwapped = false;
        if (n > this.visualState.length) {
            console.error("Infinite recursion loop created");
            return;
        }
        if (isMovingLeft) {
            if (this.visualState[index - 1] === undefined) {
                return;
            }
            ;
            const rightSidePositionOfLeftBar = parseInt(this.getPositionFromIndex(index - 1)) + barWidth;
            if (rightSidePositionOfLeftBar > centerOfMovingBar && (rightSidePositionOfLeftBar - centerOfMovingBar) > (barWidth * 0.2)) {
                const temp = this.visualState[index];
                this.visualState[index] = this.visualState[index - 1];
                this.visualState[index - 1] = temp;
                this.visualState[index].setPosition(this.getPositionFromIndex(index), { moveDuration: this.BAR_REORDERING_ANIMATION_SPEED });
                barsWereSwapped = true;
            }
        }
        else {
            if (this.visualState[index + 1] === undefined) {
                return;
            }
            ;
            const leftSidePositionOfRightBar = parseInt(this.getPositionFromIndex(index + 1));
            if (leftSidePositionOfRightBar < centerOfMovingBar && (centerOfMovingBar - leftSidePositionOfRightBar) > (barWidth * 0.2)) {
                const temp = this.visualState[index];
                this.visualState[index] = this.visualState[index + 1];
                this.visualState[index + 1] = temp;
                this.visualState[index].setPosition(this.getPositionFromIndex(index), { moveDuration: this.BAR_REORDERING_ANIMATION_SPEED });
                barsWereSwapped = true;
            }
        }
        if (barsWereSwapped) {
            this.captureNewBaseArray();
            if (this.onVisualStateChange)
                this.onVisualStateChange();
            this.dragBar(e, bar, dragOffset, n + 1);
        }
    }
    captureNewBaseArray() {
        this.baseState = [...this.visualState];
        if (this.onBaseStateChange)
            this.onBaseStateChange();
    }
    moveVisualBarToIndex(barIndex, newIndex, onFinish) {
        this.visualState[barIndex].setPosition(this.getPositionFromIndex(newIndex), { onFinish: onFinish });
    }
    swapVisualBars(index1, index2, onFinish) {
        const temp = this.visualState[index1];
        this.visualState[index1] = this.visualState[index2];
        this.visualState[index2] = temp;
        const obj = { value: false };
        var onFinishFunction;
        if (onFinish != undefined) {
            onFinishFunction = () => obj.value ? onFinish() : obj.value = true;
        }
        this.visualState[index1].setPosition(this.getPositionFromIndex(index1), { onFinish: onFinish != undefined ? onFinishFunction : undefined });
        this.visualState[index2].setPosition(this.getPositionFromIndex(index2), { onFinish: onFinish != undefined ? onFinishFunction : undefined });
        if (this.onVisualStateChange)
            this.onVisualStateChange();
    }
    getPositionFromIndex(index) {
        return (index * (this.sceneElement.clientWidth / this.visualState.length)) + "px";
    }
    updateBarPosition(index, onFinish) {
        if (index === undefined) {
            for (var i = 0; i < this.visualState.length; i += 1) {
                const position = this.getPositionFromIndex(i);
                this.visualState[i].setPosition(position, { onFinish: onFinish, moveDuration: 0 });
            }
        }
        else {
            this.visualState[index].setPosition(this.getPositionFromIndex(index), { onFinish: onFinish, moveDuration: 0 });
        }
    }
    updateElementWidths() {
        const width = this.sceneElement.clientWidth / this.visualState.length;
        for (const bar of this.visualState) {
            bar.setSize(width + "px");
        }
    }
    updateAllWidthsAndPositions() {
        this.updateBarPosition();
        this.updateElementWidths();
    }
    getIndexFromId(id) {
        for (let i = 0; i < this.visualState.length; i++) {
            if (this.visualState[i].getId() == id) {
                return i;
            }
        }
        throw new Error("Bar with id " + id + " not found");
    }
    getBars() {
        return this.visualState;
    }
    getBaseArray() {
        return this.visualState.map((bar) => bar.getValue());
    }
    resetBars() {
        this.visualState = [...this.baseState];
        this.updateBarPosition();
    }
    setAnimationSpeedMultiplier(multiplier) {
        this.animationSpeedMultiplier = multiplier;
        for (var bar of this.baseState) {
            bar.setAnimationSpeedMultiplier(multiplier);
        }
    }
    endAnimations() {
        for (var bar of this.baseState) {
            bar.endAnimation();
        }
    }
}
