
import Bar from "./Bar.js";

/**
 * This guy handles all the high level stuff of managing what the current state 
 * of the array of bars is both in the state array and in the visual 
 * representation. 
 */
export default class BarManager {

  // Array states
  #baseState = [];
  #visualState = [];

  // event handlers
  onBaseStateChange;
  onVisualStateChange;

  // Other
  #sceneElement;
  #animationSpeedMultiplier;

  /**
   * Constructor.
   * 
   * @param {Element} sceneElement element to act as the container for the bar 
   * elements
   */
  constructor(sceneElement) {
    this.#sceneElement = sceneElement;
  }

  /**
   * This function creates a specified number of bars and adds them to the
   * base array. A good portion of bar setup is handled by the bar object 
   * itself within the constructor call
   * 
   * @param {int} number of bars to create; will default to one if left blank
   */
  createBars(number=1) {
    // Loop to create bars
    for (var index = 0; index < number; index++) {

      // This constructor call will handle creating the actual html element and 
      // adding it to the screen
      const newBar = new Bar(this.#sceneElement);

      // Add bar to the visual state
      this.#visualState.push(newBar);

      // Add event listeners so bar can be dragged
      const newBarElement = newBar.getElement();

      newBarElement.onmousedown = (e) => {

        // Prevent strange behavior
        e.preventDefault();

        // Maintain an offset value so an element can be dragged from its edge 
        // without trying to center itself on the mouse position
        var dragOffset = e.clientX - newBarElement.getBoundingClientRect().left;

        // Drag the bar around
        document.onmousemove = (e) => this.#dragBar(e, newBar, dragOffset);

        // Cleanup on drag completion
        document.onmouseup = (e) => {
          // Snap bar being dragged to location
          this.updateBarPosition(this.getIndexFromId(newBar.getId()));
          // Clear event listeners
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }

    // Update base array
    this.captureNewBaseArray();

    // Run visualStateChanged event listener
    if (this.onVisualStateChange) this.onVisualStateChange();

    // Update widths and positions of bars
    this.updateAll();
  }

  /**
   * This is called when the mouse is moved during a drag event. It figures out 
   * where to go and whether anything needs to move out of the way.
   * 
   * @param {Event} e 
   * @param {Bar} bar 
   * @returns void
   */
  #dragBar(e, bar, dragOffset) {

    // Find the index of the bar being dragged
    const index = this.#visualState.findIndex((item) => item === bar);

    // Figure out where stuff is moving
    const barWidth = parseInt(this.#sceneElement.clientWidth) / this.#visualState.length;
    const newLocation = e.clientX - this.#sceneElement.getBoundingClientRect().left - dragOffset;
    const oldLocation = parseInt(bar.getPosition());
    const centerOfMovingBar = newLocation + (barWidth / 2)
    const isMovingLeft = (newLocation < oldLocation);

    // Set position of bar being dragged
    bar.setPosition(newLocation + "px", {moveDuration: 0});
    
    var barsWereSwapped = false

    // Figures out if the bar has been dragged far enough to swap with another
    if (isMovingLeft) {

      // Check for index out of bounds
      if (this.#visualState[index - 1] === undefined) { return };

      const rightPositionOfLeftBar = parseInt(this.#getPositionFromIndex(index - 1)) + barWidth;

      // Swap
      if (rightPositionOfLeftBar > centerOfMovingBar) {

        // Swap elements in array
        const temp = this.#visualState[index];
        this.#visualState[index] = this.#visualState[index - 1];
        this.#visualState[index - 1] = temp;

        // Set position of bar that was affected (index has changed)
        this.#visualState[index].setPosition(this.#getPositionFromIndex(index), {moveDuration: 0});

        // Flag that the visual state changed due to dragging elements
        barsWereSwapped = true;
      }

    } else {

      // Check for index out of bounds
      if (this.#visualState[index + 1] === undefined) { return };

      const leftPositionOfRightBar = parseInt(this.#getPositionFromIndex(index + 1));

      // Swap
      if (leftPositionOfRightBar < centerOfMovingBar) {
        // Swap elements in array
        const temp = this.#visualState[index];
        this.#visualState[index] = this.#visualState[index + 1];
        this.#visualState[index + 1] = temp;

        // Set position of bar that was affected (index has changed)
        this.#visualState[index].setPosition(this.#getPositionFromIndex(index), {moveDuration: 0});

        // Flag that the visual state changed due to dragging elements
        barsWereSwapped = true;
      }
    }

    if (barsWereSwapped) {
      this.captureNewBaseArray();
      if (this.onVisualStateChange) this.onVisualStateChange();
    }
  }
  
  /**
   * This copies the visual state to the base state.
   */
  captureNewBaseArray() {
    this.#baseState = [...this.#visualState];
    // Event listener
    if (this.onBaseStateChange) this.onBaseStateChange();
  }

  /**
   * 
   */
  moveVisualBarToIndex(barIndex, newIndex, onFinish) {
    this.#visualState[barIndex].setPosition(this.#getPositionFromIndex(newIndex), {onFinish: onFinish})
  }

  /**
   * Swaps two bars just in the state array and/or visually
   * 
   * @param {int} index1 item to swap
   * @param {int} index2 other item to swap
   */
  swapVisualBars(index1, index2, onFinish) {

    // State update
    const temp = this.#visualState[index1];
    this.#visualState[index1] = this.#visualState[index2];
    this.#visualState[index2] = temp;

    // Position update
    this.#visualState[index1].setPosition(this.#getPositionFromIndex(index1), {onFinish: onFinish});
    this.#visualState[index2].setPosition(this.#getPositionFromIndex(index2), {onFinish: onFinish});

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
  #getPositionFromIndex(index) {
    return (index * (this.#sceneElement.clientWidth / this.#visualState.length)) + "px";
  }

  /**
   * Sets a bars position to what it should be based on its index
   * 
   * @param {int} index 
   * @param {bool} animate 
   */
  updateBarPosition(index, onFinish) {
    if (index === undefined) {
      for (var bar in this.#visualState) {
        bar.setPosition(this.#getPositionFromIndex(index), {onFinish: onFinish});
      }
    } else {
      this.#visualState[index].setPosition(this.#getPositionFromIndex(index), {onFinish: onFinish});
    }
  }

  /**
   * Yeah. It calculates what all of the elements widths should be and updates
   * them.
   */
  updateElementWidths() {
    console.log("Update width");
    const width = this.#sceneElement.clientWidth / this.#visualState.length;
    console.log(this.#sceneElement.clientWidth, "/", this.#visualState.length);
    console.log("The width for each will be", width);
    for (const bar of this.#visualState) {
      bar.setWidth(width + "px");
    }
  }

  /**
   * Updates the width and position of everything. Useful for program initiation
   * and window resizing updates
   */
  updateAll() {
    for (var index in this.#visualState) {
      this.#visualState[index].setPosition(this.#getPositionFromIndex(index), {moveDuration: 0});
    }

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
  getIndexFromId(id) {
    for (let i = 0; i < this.#visualState.length; i++) {
      if (this.#visualState[i].getId() == id) {
        return i;
      }
    }
    throw new Error("Bar with id " + id + " not found");
  }

  getBars() {
    return this.#visualState;
  }

  getBaseArray () {
    console.log("getBaseArray returning", this.#visualState.map(x => x.getValue()));
    
    return this.#visualState.map((bar) => bar.getValue());
  }

  resetBars() {
    this.#visualState = [...this.#baseState];
    this.updateBarPosition();
  }

  setAnimationSpeedMultiplier(multiplier) {

    this.#animationSpeedMultiplier = multiplier;
    for (var bar of this.#visualState) {
      bar.setAnimationSpeedMultiplier(this.#animationSpeedMultiplier);
    }
  }

}
