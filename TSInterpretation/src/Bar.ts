/**
 * Bar object. This guy handles the position and width of the actual element, 
 * but it is dumb and needs to be told exactly where to go. It's basically just 
 * a convenient abstraction of code, it doesn't acually do anything without 
 * being told exactly what to do.
 */
 export default class Bar {

  private static currentId = 0;

  private element: HTMLElement;
  private dragOffset: number | undefined;
  private sceneElement: HTMLElement;
  private id: number;
  private value!: number;
  private currentAnimation: Animation | undefined;
  private animationSpeedMultiplier: number = 1;
  private heightProportionalToValue: boolean;
  private maxValue: number | undefined;

  constructor (sceneElement: HTMLElement, value: number | undefined, heightProportionalToValue=false, maxValue: number | undefined) {

    this.heightProportionalToValue = heightProportionalToValue
    if (heightProportionalToValue) this.maxValue = maxValue;

    // Used to create element 
    this.sceneElement = sceneElement;

    // This is refered to by barManager when handling drag operations
    this.dragOffset = undefined;

    // Id is used to find elements within various arrays
    this.id = Bar.createId();

    // Create html element
    this.element = document.createElement("div");
    this.element.className = "bar";
    this.setValue(value === undefined ? this.id : value);
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
   * @param {string} oldPosition 
   * @param {string} newPosition 
   */
  runMoveAnimation(oldPosition: string, newPosition: string, onFinish?: () => void, moveDuration?: number) {

    // Position is set as soon as this function is called
    this.element.style.left = newPosition;

    // Default move
    var moveMultiplier = this.animationSpeedMultiplier;
    if (moveDuration === undefined) {
      moveDuration = 1000;
    }

    // Unique move
    if (moveDuration != 1000) {
      moveMultiplier = 1;
    }

    // Instant move
    if (moveDuration === 0) {
      if (onFinish != undefined) onFinish();
      return;
    }

    const keyframes = new KeyframeEffect(
      this.element,
      [{left: oldPosition},
      { left: newPosition }],
      { duration: moveDuration, fill: "none" }
    );

    this.currentAnimation = new Animation(keyframes);
    this.currentAnimation.playbackRate = moveMultiplier;
    this.currentAnimation.onfinish = (event) => {
      // Set position so it so it doesn't just snap back
      if (onFinish != undefined) onFinish();
      this.currentAnimation = undefined;
    }

    this.currentAnimation.play();
  }

  
  /**
   * This is just a fancy setter. It updates the element position and possibly 
   * runs an animation while doing it.
   * 
   * @param {String} newPosition 
   * @param {bool} animate 
   */
  setPosition(newPosition: string, {onFinish: onFinish, moveDuration: moveDuration}: {onFinish?: () => void, moveDuration?: number}) {
    this.runMoveAnimation(this.getPosition(), newPosition, onFinish, moveDuration);
  }
  
  /**
   * This generates ids for bars. This can return anything as long as it is of a 
   * type that can be compared to itself using === (Aka, don't use ref. types).
   * 
   * @returns new id
   */
  static createId() {
    Bar.currentId++;
    return Bar.currentId;
  }
  
  // Bunch of getters and setters. Yay.
  
  getPosition() {
    return this.element.style.left;
  }

  setSize(width: string) {
    this.element.style.width = width;
    if (this.heightProportionalToValue) {
      this.element.style.height = (this.getValue() / this.maxValue!) * 100 + "%";
    } else {
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

  setDragOffset(i: number) {
    this.dragOffset = i;
  }

  getValue() {
    return this.value;
  }

  setValue(i: number) {
    this.value = i;
  }

  setMaxValue(i: number) {
    this.maxValue = i;
    this.setSize(this.getWidth());
  }

  setAnimationSpeedMultiplier(val: number) {
    this.animationSpeedMultiplier = val;
    if (this.currentAnimation != undefined) {
      this.currentAnimation.playbackRate = this.animationSpeedMultiplier;
    }
  }

  endAnimation() {
    if (this.currentAnimation != undefined) this.currentAnimation.cancel();
  }


}