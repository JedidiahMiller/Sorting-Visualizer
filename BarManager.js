
import Bar from "./Bar.js";

/**
 * This guy handles all the high level stuff of managing what the current state 
 * of the array of bars is both in the state array and in the visual 
 * representation. 
 */
export default class BarManager {

  speedOfDragAnimations = 50;
  #baseArray = [];
  #visualArray = [];
  #sortedArray = [];

  #sceneElement;

  // Time animations take to run
  #transitionTime;

  // event handlers
  onBaseArrayChange;
  onBaseArraySizeChange;
  onVisualArrayOrderChange;

  /**
   * Do you normally even put comments on constructors?
   * 
   * @param {Element} sceneElement element to act as the container for the bar 
   * elements
   */
  constructor(sceneElement, defaultTransitionSpeed) {
    if (defaultTransitionSpeed === undefined) {
      this.setTransitionTime(1000);
      console.warn("BarManager default transition speed was not set. This may cause unexpected behavior");
    } else {
      this.setTransitionTime(defaultTransitionSpeed);
    }
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

      // Add bar to bar array
      this.#visualArray.push(newBar);

      // Allows bars to be dragged around and reordered
      const barElement = newBar.getElement();
      barElement.onmousedown = (e) => {

        e.preventDefault();
        this.barBeingDragged = newBar;
        newBar.setDragOffset(e.clientX - barElement.getBoundingClientRect().left);
        document.onmousemove = (e) => this.#dragBar(e, newBar);
        document.onmouseup = (e) => {
          // Snap bar being dragged to location
          this.updateBarPosition(this.getIndexFromId(newBar.getId()), true, this.speedOfDragAnimations);
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
    // Run event handlers if present
    // Array size change is also consitered an array order change
    this.captureNewBaseArray();
    this.#baseArrayChanged();
    if (this.onBaseArraySizeChange) this.onBaseArraySizeChange();

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
  #dragBar(e, bar) {

    const index = this.#visualArray.findIndex((item) => item === bar);
    const barWidth = parseInt(this.#sceneElement.clientWidth) / this.#visualArray.length;

    // Figure out where the bar is being dragged and move it there
    const newLocation = e.clientX - this.#sceneElement.getBoundingClientRect().left - bar.getDragOffset();
    const oldLocation = parseInt(bar.getPosition());
    bar.setPosition(newLocation + "px", false, this.speedOfDragAnimations);

    const centerOfMovingBar = newLocation + (barWidth / 2)
    const isMovingLeft = (newLocation < oldLocation);
    
    var barsWereSwapped = false
    // Figures out if the bar has been dragged far enough to swap with another
    if (isMovingLeft) {
      if (this.#visualArray[index - 1] === undefined) { return };
      const rightPositionOfLeftBar = parseInt(this.#getPositionFromIndex(index - 1)) + barWidth;
      if (rightPositionOfLeftBar > centerOfMovingBar) {
        this.swapVisualArrayBars(index, index - 1, this.speedOfDragAnimations);
        barsWereSwapped = true;
      }
    } else {
      if (this.#visualArray[index + 1] === undefined) { return };
      const leftPositionOfRightBar = parseInt(this.#getPositionFromIndex(index + 1));
      if (leftPositionOfRightBar < centerOfMovingBar) {
        this.swapVisualArrayBars(index, index + 1, this.speedOfDragAnimations);
        barsWereSwapped = true;
      }
    }
    if (barsWereSwapped) {
      this.captureNewBaseArray();
      if (this.onVisualArrayOrderChange) this.onVisualArrayOrderChange();
    }
  }
  
  /**
   * This copies the visual state to the base array
   */
  captureNewBaseArray() {

    this.#baseArray = [...this.#visualArray];
  
    if (this.onBaseArrayChange) this.onBaseArrayChange();

    const sizeChange = this.#baseArray.length != this.#visualArray.length;
    if (sizeChange && this.onBaseArraySizeChange) this.onBaseArraySizeChange();
  }

  /**
   * Swaps two bars just in the state array and/or visually
   * 
   * @param {int} index1 item to swap
   * @param {int} index2 other item to swap
   * @param {bool} animate 
   * @param {bool} moveItems visually move elements, or just swap in the array
   * @param {int} speed defaults to 0 I think, so instant snap
   */
  swapVisualArrayBars(index1, index2, speed=this.#transitionTime, updatePositions=true) {

    // Array update
    const temp = this.#visualArray[index1];
    this.#visualArray[index1] = this.#visualArray[index2];
    this.#visualArray[index2] = temp;

    // Visual update
    this.#visualArray[index1].setPosition(this.#getPositionFromIndex(index1), true, speed);
    this.#visualArray[index2].setPosition(this.#getPositionFromIndex(index2), true, speed);

    // Run event handler if present
    if (this.onVisualArrayOrderChange) this.onVisualArrayOrderChange();

    console.log("Swapped indeces", index1, index2, "corresponding to values", this.#visualArray[index1].getValue(),this.#visualArray[index2].getValue())

  }

  /**
   * Take a index (doesn't matter what is actually there) and returns what
   * position an element at that index should be at
   * 
   * @param {*} index to get position for
   * @returns a string of what the position should be. ei, "0px"
   */
  #getPositionFromIndex(index) {
    return (index * (this.#sceneElement.clientWidth / this.#visualArray.length)) + "px";
  }

  /**
   * Sets a bars position to what it should be based on its index
   * 
   * @param {int} index 
   * @param {bool} animate 
   * @param {int} speed 
   */
  updateBarPosition(index, animate=false, speed=this.#transitionTime) {
    this.#visualArray[index].setPosition(this.#getPositionFromIndex(index), animate, speed);
  }

  /**
   * Yeah. It calculates what all of the elements widths should be and updates
   * them.
   */
  updateElementWidths() {
    console.log("Update width");
    const width = this.#sceneElement.clientWidth / this.#visualArray.length;
    console.log(this.#sceneElement.clientWidth, "/", this.#visualArray.length);
    console.log("The width for each will be", width);
    for (const bar of this.#visualArray) {
      bar.setWidth(width + "px");
    }
  }

  /**
   * Updates the width and position of everything. Useful for program initiation
   * and window resizing updates
   */
  updateAll() {
    for (var index in this.#visualArray) {
      this.#visualArray[index].setPosition(this.#getPositionFromIndex(index), false);
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
    for (let i = 0; i < this.#visualArray.length; i++) {
      if (this.#visualArray[i].getId() == id) {
        return i;
      }
    }
    throw new Error("Bar with id " + id + " not found");
  }

  getTransitionTime() {
    return this.#transitionTime;
  }

  setTransitionTime(time) {
    this.#transitionTime = time;
  }

  getBars() {
    return this.#visualArray;
  }

  getBaseArray () {
    console.log("getBaseArray returning", this.#visualArray.map(x => x.getValue()));
    
    return this.#visualArray.map((bar) => bar.getValue());
  }

  #baseArrayChanged() {
    this.#baseArray = [];
    for (var bar of this.#visualArray) {
      this.#baseArray.push(bar);
    }
    if (this.onBaseArrayChange) this.onBaseArrayChange();
  }

  resetBars() {
    this.#visualArray = [...this.#baseArray];
    this.updateBarPosition();
  }

}
