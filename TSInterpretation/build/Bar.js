class Bar {
    constructor(sceneElement, value, heightProportionalToValue = false, maxValue) {
        this.animationSpeedMultiplier = 1;
        this.heightProportionalToValue = heightProportionalToValue;
        if (heightProportionalToValue)
            this.maxValue = maxValue;
        this.sceneElement = sceneElement;
        this.dragOffset = undefined;
        this.id = Bar.createId();
        this.element = document.createElement("div");
        this.element.className = "bar";
        this.setValue(value === undefined ? this.id : value);
        this.sceneElement.appendChild(this.element);
    }
    runMoveAnimation(oldPosition, newPosition, onFinish, moveDuration) {
        this.element.style.left = newPosition;
        var moveMultiplier = this.animationSpeedMultiplier;
        if (moveDuration === undefined) {
            moveDuration = 1000;
        }
        if (moveDuration != 1000) {
            moveMultiplier = 1;
        }
        if (moveDuration === 0) {
            if (onFinish != undefined)
                onFinish();
            return;
        }
        const keyframes = new KeyframeEffect(this.element, [{ left: oldPosition },
            { left: newPosition }], { duration: moveDuration, fill: "none" });
        this.currentAnimation = new Animation(keyframes);
        this.currentAnimation.playbackRate = moveMultiplier;
        this.currentAnimation.onfinish = (event) => {
            if (onFinish != undefined)
                onFinish();
            this.currentAnimation = undefined;
        };
        this.currentAnimation.play();
    }
    setPosition(newPosition, { onFinish: onFinish, moveDuration: moveDuration }) {
        this.runMoveAnimation(this.getPosition(), newPosition, onFinish, moveDuration);
    }
    static createId() {
        Bar.currentId++;
        return Bar.currentId;
    }
    getPosition() {
        return this.element.style.left;
    }
    setSize(width) {
        this.element.style.width = width;
        if (this.heightProportionalToValue) {
            this.element.style.height = (this.getValue() / this.maxValue) * 100 + "%";
        }
        else {
            this.element.style.height = "50%";
        }
    }
    getWidth() {
        return this.element.style.width;
    }
    getId() {
        return this.id;
    }
    getElement() {
        return this.element;
    }
    getDragOffset() {
        return this.dragOffset;
    }
    setDragOffset(i) {
        this.dragOffset = i;
    }
    getValue() {
        return this.value;
    }
    setValue(i) {
        this.value = i;
    }
    setMaxValue(i) {
        this.maxValue = i;
        this.setSize(this.getWidth());
    }
    setAnimationSpeedMultiplier(val) {
        this.animationSpeedMultiplier = val;
        if (this.currentAnimation != undefined) {
            this.currentAnimation.playbackRate = this.animationSpeedMultiplier;
        }
    }
    endAnimation() {
        if (this.currentAnimation != undefined)
            this.currentAnimation.cancel();
    }
}
Bar.currentId = 0;
export default Bar;
