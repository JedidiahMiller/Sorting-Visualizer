/**
 * Bar object. This guy handles the position and width of the actual element, 
 * but it is dumb and needs to be told exactly where to go. It's basically just 
 * a convenient abstraction of code, it doesn't acually do anything without 
 * being told exactly what to do.
 */
export default class Bar {

  static #currentId = 0;

  #element;
  #dragOffset;
  #sceneElement;
  #id;
  #value;
  #currentAnimation;

  constructor (sceneElement, value) {

    // Used to create element 
    this.#sceneElement = sceneElement;

    // This is refered to by barManager when handling drag operations
    this.#dragOffset = null;

    // Id is used to find elements within various arrays
    this.#id = Bar.createId();

    // Create html element
    this.#element = document.createElement("div");
    this.#element.className = "bar";
    this.setValue(value === undefined ? this.#id : value);
    this.#sceneElement.appendChild(this.#element);

  }

  /**
   * Handles animating the moves
   * 
   * Note:
   * Even though the animation has ended, if the fill property is not none, it 
   * will hold that last position and resist any attempt to change it. 
   * The cancel function can be run to fix this. Cancel is meant to stop the
   * animation which seems to already be stopped, but it stops whatever thing
   * is making that final position stay frozen
   * 
   * @param {*} oldPosition 
   * @param {*} newPosition 
   * @param {*} time 
   */
  #runMoveAnimation(oldPosition, newPosition, time, onAnimationEnd=null) {

    console.log("running move animation with time", time)

    const keyframes = new KeyframeEffect(
      this.#element,
      [{left: oldPosition},
      {left: newPosition}],
      {duration: time, fill: "none"}
    );

    this.#currentAnimation = new Animation(keyframes);
    this.#currentAnimation.onfinish = (event) => {
      this.#element.style.left = newPosition;
      if (onAnimationEnd) onAnimationEnd();
    }

    this.#currentAnimation.play();
  }

  
  /**
   * This is just a fancy setter. It updates the element position and possibly 
   * runs an animation while doing it.
   * 
   * @param {String} newPosition 
   * @param {bool} animate 
   * @param {int} speed 
   */
  setPosition(newPosition, animate=false, speed) {
    console.log("setting position with", speed);
    if (animate && speed === undefined) {
      console.warn("Animation will be disabled unless given a valid speed parameter");
    }
    if (animate) {
      this.#runMoveAnimation(this.getPosition(), newPosition, speed);
    } else {
      this.#element.style.left = newPosition;
    }
  }
  
  /**
   * This generates ids for bars. This can return anything as long as it is of a 
   * type that can be compared to itself using === (Aka, don't use ref. types).
   * 
   * @returns new id
   */
  static createId() {
    Bar.#currentId++;
    return Bar.#currentId;
  }
  
  // Bunch of getters and setters. Yay.
  
  getPosition() {
    return this.#element.style.left;
  }

  setWidth(width) {
    this.#element.style.width = width;
  }

  getWidth() {
    return this.#element.style.width;
  }

  getId() {
    return this.#id;
  }

  getElement() {
    return this.#element;
  }

  getDragOffset() {
    return this.#dragOffset;
  }

  setDragOffset(i) {
    this.#dragOffset = i;
  }

  getValue() {
    return this.#value;
  }

  setValue(i) {
    this.#value = i;
    this.#element.innerHTML = i;
  }


}