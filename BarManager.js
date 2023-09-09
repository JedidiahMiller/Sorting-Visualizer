
import Bar from "./Bar.js";

/**
 * This guy handles all the high level stuff of managing what the current state 
 * of the array of bars is both in the state array and in the visual 
 * representation. 
 */
export default class BarManager {

  #bars;
  #sceneElement;
  static #transitionTime = 123;

  /**
   * Do you normally even put comments on constructors?
   * 
   * @param {Element} sceneElement element to act as the container for the bar 
   * elements
   */
  constructor(sceneElement) {
    this.#bars = [];
    this.#sceneElement = sceneElement;
  }

  /**
   * This function creates a specified number of bars and adds them to the
   * current lineup. A good portion of bar setup is handled by the bar object 
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
      this.#bars.push(newBar);

      // Allows bars to be dragged around and reordered
      const barElement = newBar.getElement();
      barElement.onmousedown = (e) => {
        console.log("Click")

        e.preventDefault();
        this.barBeingDragged = newBar;
        newBar.setDragOffset(e.clientX - barElement.getBoundingClientRect().left);
        document.onmousemove = (e) => this.#dragBar(e, newBar);
        document.onmouseup = (e) => {
          // Snap bar being dragged to location
          this.updateBarPosition(this.getIndexFromId(newBar.getId()), true, BarManager.#transitionTime);
          document.onmousemove = null;
          document.onmouseup = null;
        }
        
      }
    }
    // Sets widths and positions
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

    console.log("Drag")
    // Get base data

    const index = this.#bars.findIndex((item) => item === bar);
    const barWidth = parseInt(this.#sceneElement.clientWidth) / this.#bars.length;

    // Figure out where the bar is being dragged and move it there
    const newLocation = e.clientX - this.#sceneElement.getBoundingClientRect().left - bar.getDragOffset();
    const oldLocation = parseInt(bar.getPosition());
    bar.setPosition(newLocation + "px", false, BarManager.#transitionTime);

    const centerOfMovingBar = newLocation + (barWidth / 2)
    const rightSidePositionOfLeftBar = 0;

    const isMovingLeft = (newLocation < oldLocation);
    
    // Figures out if the bar has been dragged far enough to swap with another
    if (isMovingLeft) {
      if (this.getBarFromIndex(index - 1) === undefined) { return };
      const rightPositionOfLeftBar = parseInt(this.#getPositionFromIndex(index - 1)) + barWidth;
      if (rightPositionOfLeftBar > centerOfMovingBar) {
        this.swapBars(index, index - 1, false, false);
        this.updateBarPosition(index, true, BarManager.#transitionTime);
      }
    } else {
      if (this.getBarFromIndex(index + 1) === undefined) { return };
      const leftPositionOfRightBar = parseInt(this.#getPositionFromIndex(index + 1));
      if (leftPositionOfRightBar < centerOfMovingBar) {
        this.swapBars(index, index + 1, false, false);
        this.updateBarPosition(index, true, BarManager.#transitionTime);
      }
    }

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
  swapBars(index1, index2, animate=false, moveItems=true, speed=BarManager.#transitionTime) {

    // State update
    const barHolder = this.getBarFromIndex(index1);
    this.#bars[index1] = this.#bars[index2];
    this.#bars[index2] = barHolder;

    // Visual update
    if (moveItems) {
      this.getBarFromIndex(index1).setPosition(this.#getPositionFromIndex(index1), animate, speed);
      this.getBarFromIndex(index2).setPosition(this.#getPositionFromIndex(index2), animate, speed);
    }

  }

  /**
   * Take a index (doesn't matter what is actually there) and returns what
   * position an element at that index should be at
   * 
   * @param {*} index to get position for
   * @returns a string of what the position should be. ei, "0px"
   */
  #getPositionFromIndex(index) {
    return (index * (this.#sceneElement.clientWidth / this.#bars.length)) + "px";
  }

  /**
   * Sets a bars position to what it should be based on its index
   * 
   * @param {int} index 
   * @param {bool} animate 
   * @param {int} speed 
   */
  updateBarPosition(index, animate=false, speed=BarManager.#transitionTime) {
    this.#bars[index].setPosition(this.#getPositionFromIndex(index), animate, speed);
  }

  /**
   * Yeah. It calculates what all of the elements widths should be and updates
   * them.
   */
  updateElementWidths() {
    const width = this.#sceneElement.clientWidth / this.#bars.length
    for (const bar of this.#bars) {
      bar.setWidth(width + "px");
    }
  }

  /**
   * Updates everythings width and position. Useful for program initiation and 
   * window resizing updates
   */
  updateAll() {
    for (var index in this.#bars) {
      this.#bars[index].setPosition(this.#getPositionFromIndex(index), false);
    }
    this.updateElementWidths();
  }

  /**
   * Gets the bar at the specified index
   * 
   * @param {int} index 
   * @returns the bar
   */
  getBarFromIndex(index) {
    return this.#bars[index];
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
    for (let i = 0; i < this.#bars.length; i++) {
      if (this.#bars[i].getId() == id) {
        return i;
      }
    }
    throw new Error("Bar with id " + id + " not found");
  }

}
