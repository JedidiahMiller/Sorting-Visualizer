
export default class Bar {

  constructor (sceneElement) {

    this.sceneElement = sceneElement;
    this.dragOffset = null;

    // Create html element
    this.element = document.createElement("div");
    this.element.className = "bar";
    this.element.innerHTML = Math.random();
    this.sceneElement.appendChild(this.element);

  }

  // Private helper function
  // 
  // Even though the animation has ended, if the fill property is not none, it
  // will hold that last position and resist any attempt to change it. 
  // The cancel function can be run to fix this. Cancel is meant to stop the
  // animation which seems to already be stopped, but it stops whatever thing
  // is making that final position stay frozen
  // 
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

  // Setters

  setPosition(newPosition, animate, speed) {
    console.log(this.getPosition());
    if (animate === undefined) { animate = false };
    if (animate) {
      this.#runMoveAnimation(this.getPosition(), newPosition, speed);
    } else {
      this.element.style.left = newPosition;
    }
    console.log("Position set to ", newPosition)
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

}