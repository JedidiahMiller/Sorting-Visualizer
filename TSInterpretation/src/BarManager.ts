
import Bar from "./Bar.js";

/**
 * This guy handles all the high level stuff of managing what the current state 
 * of the array of bars is both in the state array and in the visual 
 * representation. 
 */
export default class BarManager {

  private readonly BAR_REORDERING_ANIMATION_SPEED = 100;

  // Array states
  private baseState: Bar[] = [];
  private visualState: Bar[] = [];

  // event handlers
  onBaseStateChange?: () => void;
  onVisualStateChange?: () => void;
  onUserInteraction?: () => void;

  // Other
  private sceneElement: HTMLElement;
  private animationSpeedMultiplier = 1;


  /**
   * Constructor.
   * 
   * @param {Element} sceneElement element to act as the container for the bar 
   * elements
   */
  constructor(sceneElement: HTMLElement) {
    this.sceneElement = sceneElement;
    sceneElement.onmousedown = () => {
      if (this.onUserInteraction) this.onUserInteraction();
    }
  }

  /**
   * This function creates a specified number of bars and adds them to the
   * base array. A good portion of bar setup is handled by the bar object 
   * itself within the constructor call
   * 
   * @param {int} number of bars to create; will default to one if left blank
   */
  createBars(number: number = 1) {
    // Loop to create bars
    for (var index = 0; index < number; index++) {

      // This constructor call will handle creating the actual html element and 
      // adding it to the screen
      const newBar = new Bar(this.sceneElement, undefined, true, 100);

      // Set current animation speed
      newBar.setAnimationSpeedMultiplier(this.animationSpeedMultiplier);

      // Add bar to the visual state
      this.visualState.push(newBar);

      // Add event listeners so bar can be dragged
      const newBarElement = newBar.getElement();

      newBarElement.onmousedown = (e) => {

        // Prevent strange behavior
        e.preventDefault();

        // Maintain an offset value so an element can be dragged from its edge 
        // without trying to center itself on the mouse position
        var dragOffset = e.clientX - newBarElement.getBoundingClientRect().left;

        // Drag the bar around
        document.onmousemove = (e) => this.dragBar(e, newBar, dragOffset);

        // Cleanup on drag completion
        document.onmouseup = (e) => {
          // Snap bar being dragged to location
          index = this.getIndexFromId(newBar.getId());
          newBar.setPosition(this.getPositionFromIndex(index), { moveDuration: this.BAR_REORDERING_ANIMATION_SPEED });
          // Clear event listeners
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }

    for (var bar of this.baseState) {
      bar.setMaxValue(this.baseState.length);
    }

    // Update base array
    this.captureNewBaseArray();

    // Run visualStateChanged event listener
    if (this.onVisualStateChange) this.onVisualStateChange();

    // Update widths and positions of bars
    this.updateAllWidthsAndPositions();
  }

  /**
   * This is called when the mouse is moved during a drag event. It figures out 
   * where to go and whether anything needs to move out of the way.
   * 
   * @param {Event} e 
   * @param {Bar} bar 
   * @returns void
   */
  dragBar(e: MouseEvent, bar: Bar, dragOffset: number, n=0) {

    // Find the index of the bar being dragged
    const index = this.visualState.findIndex((item) => item === bar);

    // Figure out where stuff is moving
    const barWidth: number = this.sceneElement.clientWidth / this.visualState.length;
    const newLocation: number = e.clientX - this.sceneElement.getBoundingClientRect().left - dragOffset;
    const centerOfMovingBar: number = newLocation + (barWidth / 2)
    var rightSidePositionOfLeftBar;
    try {
      rightSidePositionOfLeftBar = parseInt(this.visualState[index - 1].getPosition()) + barWidth;
    } catch {
      rightSidePositionOfLeftBar = undefined;
    }

    const isMovingLeft = centerOfMovingBar < 0 || centerOfMovingBar < rightSidePositionOfLeftBar!;

    // Set position of bar being dragged
    bar.setPosition(newLocation + "px", { moveDuration: 0 });
    
    var barsWereSwapped = false;

    // This is to catch a bug that might have been fixed but was never confirmed
    if (n > this.visualState.length) {
      console.error("Infinite recursion loop created");
      return;
    }

    // Figures out if the bar has been dragged far enough to swap with another
    if (isMovingLeft) {

      // Check for index out of bounds
      if (this.visualState[index - 1] === undefined) { return };

      const rightSidePositionOfLeftBar: number = parseInt(this.getPositionFromIndex(index - 1)) + barWidth;

      // Swap
      if (rightSidePositionOfLeftBar > centerOfMovingBar  && (rightSidePositionOfLeftBar - centerOfMovingBar) > (barWidth * 0.2)) {

        // Swap elements in array
        const temp = this.visualState[index];
        this.visualState[index] = this.visualState[index - 1];
        this.visualState[index - 1] = temp;

        // Set position of bar that was affected (index has changed)
        this.visualState[index].setPosition(this.getPositionFromIndex(index), {moveDuration: this.BAR_REORDERING_ANIMATION_SPEED});

        // Flag that the visual state changed due to dragging elements
        barsWereSwapped = true;
      }

    } else {

      // Check for index out of bounds
      if (this.visualState[index + 1] === undefined) { return };

      const leftSidePositionOfRightBar: number = parseInt(this.getPositionFromIndex(index + 1));

      // Swap
      if (leftSidePositionOfRightBar < centerOfMovingBar && (centerOfMovingBar - leftSidePositionOfRightBar) > (barWidth * 0.2)) {
        // Swap elements in array
        const temp = this.visualState[index];
        this.visualState[index] = this.visualState[index + 1];
        this.visualState[index + 1] = temp;

        // Set position of bar that was affected (index has changed)
        this.visualState[index].setPosition(this.getPositionFromIndex(index), {moveDuration: this.BAR_REORDERING_ANIMATION_SPEED});

        // Flag that the visual state changed due to dragging elements
        barsWereSwapped = true;
      }
    }

    if (barsWereSwapped) {
      this.captureNewBaseArray();
      if (this.onVisualStateChange) this.onVisualStateChange();
      // Call again to make sure drag didnt skip over a bunch
      this.dragBar(e, bar, dragOffset, n+1);
    }

  }
  
  /**
   * This copies the visual state to the base state.
   */
  captureNewBaseArray() {
    this.baseState = [...this.visualState];
    // Event listener
    if (this.onBaseStateChange) this.onBaseStateChange();
  }

  /**
   * 
   */
  moveVisualBarToIndex(barIndex: number, newIndex: number, onFinish?: () => void) {
    this.visualState[barIndex].setPosition(this.getPositionFromIndex(newIndex), {onFinish: onFinish})
  }

  /**
   * Swaps two bars just in the state array and/or visually
   * 
   * @param {int} index1 item to swap
   * @param {int} index2 other item to swap
   */
  swapVisualBars(index1: number, index2: number, onFinish?: () => void) {

    // State update
    const temp = this.visualState[index1];
    this.visualState[index1] = this.visualState[index2];
    this.visualState[index2] = temp;

    // Prevent double firing
    const obj = { value: false }

    var onFinishFunction: () => void;
    if (onFinish != undefined) {
      onFinishFunction = () => obj.value ? onFinish() : obj.value = true;
    }

    // Position update
    this.visualState[index1].setPosition(this.getPositionFromIndex(index1), {onFinish: onFinish != undefined ? onFinishFunction! : undefined});
    this.visualState[index2].setPosition(this.getPositionFromIndex(index2), {onFinish: onFinish != undefined ? onFinishFunction! : undefined});

    // Run event handler if present
    if (this.onVisualStateChange) this.onVisualStateChange();

  }

  /**
   * Take a index (doesn't matter what is actually there) and returns what
   * position an element at that index should be at
   * 
   * @param {*} index to get position for
   * @returns a string of what the position should be. ei, "0px"
   */
  getPositionFromIndex(index: number) {
    return (index * (this.sceneElement.clientWidth / this.visualState.length)) + "px";
  }

  /**
   * Sets a bars position to what it should be based on its index
   * 
   * @param {int} index 
   * @param {bool} animate 
   */
  updateBarPosition(index?: number, onFinish?: () => void) {
    if (index === undefined) {
      for (var i = 0; i < this.visualState.length; i += 1) {
        const position = this.getPositionFromIndex(i);
        this.visualState[i].setPosition(position, {onFinish: onFinish, moveDuration: 0});
      }
    } else {
      this.visualState[index].setPosition(this.getPositionFromIndex(index), {onFinish: onFinish, moveDuration: 0});
    }
  }

  /**
   * Yeah. It calculates what all of the elements widths should be and updates
   * them.
   */
  updateElementWidths() {
    const width = this.sceneElement.clientWidth / this.visualState.length;
    for (const bar of this.visualState) {
      bar.setSize(width + "px");
    }
  }

  /**
   * Updates the width and position of everything. Useful for program initiation
   * and window resizing updates.
   */
  updateAllWidthsAndPositions() {
    this.updateBarPosition();
    this.updateElementWidths();
  }

  /**
   * Finds the bar with a specific id and returns that bars index. Throws an 
   * error if no bars have the id, so dont worry about checking that further up
   * the line
   * 
   * @param {int} id 
   * @returns 
   */
  getIndexFromId(id: number) {
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

  getBaseArray () {    
    return this.visualState.map((bar) => bar.getValue());
  }

  resetBars() {
    this.visualState = [...this.baseState];
    this.updateBarPosition();
  }

  setAnimationSpeedMultiplier(multiplier: number) {
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