/**
 * Bar object. This guy handles the position and width of the actual element, 
 * but it is dumb and needs to be told exactly where to go. It's basically just 
 * a convenient abstraction of code, it doesn't acually do anything without 
 * being told exactly what to do.
 */
export default class Bar {

  static #currentId = 0;

  constructor (sceneElement) {

    this.sceneElement = sceneElement;
    this.dragOffset = null;
    this.id = Bar.currentId;
    Bar.currentId++;

    // Create html element
    this.element = document.createElement("div");
    this.element.className = "bar";
    this.element.innerHTML = Math.random();
    this.sceneElement.appendChild(this.element);

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
  #runMoveAnimation(oldPosition, newPosition, time) {

    const keyframes = new KeyframeEffect(
      this.element,
      [{left: oldPosition},
      {left: newPosition}],
      {duration: time, fill: "none"}
    );

    const animation = new Animation(keyframes);

    animation.onfinish = (event) => {
      this.element.style.left = newPosition;
    }

    animation.play();
  }

  // Bunch of getters and setters. Yay.

  /**
   * This is just a fancy setter. It updates the element position and possibly 
   * runs an animation while doing it.
   * 
   * @param {String} newPosition 
   * @param {bool} animate 
   * @param {int} speed 
   */
  setPosition(newPosition, animate, speed) {
    if (animate === undefined) { animate = false };
    if (animate) {
      this.#runMoveAnimation(this.getPosition(), newPosition, speed);
    } else {
      this.element.style.left = newPosition;
    }
  }

  getPosition() {
    return this.element.style.left;
  }

  setWidth(width) {
    this.element.style.width = width;
  }

  getWidth() {
    return this.element.style.width;
  }

  getId() {
    return this.id;
  }

}