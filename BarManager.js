
import Bar from "./Bar.js";

export default class BarManager {

  #bars;
  #sceneElement;

  constructor(sceneElement) {
    this.#bars = [];
    this.#sceneElement = sceneElement;
  }

  createBars(number) {
    number = number ? number : 1;
    for (var index = 0; index < number; index++) {
      const newBar = new Bar(this.#sceneElement);
      const index = this.#bars.length;
      this.#bars.push(newBar);
      const barElement = newBar.element;
      barElement.onmousedown = (e) => {

        e.preventDefault();
        this.barBeingDragged = newBar;
        newBar.dragOffset = e.clientX - barElement.getBoundingClientRect().left;
        document.onmousemove = (e) => this.#dragBar(e, newBar);
        document.onmouseup = (e) => {
          this.updateBarPosition(index, true, 50);
          document.onmousemove = null;
          document.onmouseup = null;
        }
        
      }
    }
    this.updateAll();
  }

  #dragBar(e, bar) {

    // Get base data

    const index = this.#bars.findIndex((item) => item === bar);
    const barWidth = parseInt(this.#sceneElement.clientWidth) / this.#bars.length;

    // Figure out where the bar is being dragged and move it there
    const newLocation = e.clientX - this.#sceneElement.getBoundingClientRect().left - bar.dragOffset;
    const oldLocation = parseInt(bar.getPosition());
    bar.setPosition(newLocation + "px", false);

    const centerOfMovingBar = newLocation + (barWidth / 2)
    const rightSidePositionOfLeftBar = 0;

    const isMovingLeft = (newLocation < oldLocation);
    
    if (isMovingLeft) {
      if (this.getBar(index - 1) === undefined) { return };
      const rightPositionOfLeftBar = parseInt(this.#getPositionFromIndex(index - 1)) + barWidth;
      if (rightPositionOfLeftBar > centerOfMovingBar) {
        this.swapBars(index, index - 1, false, false);
        this.updateBarPosition(index, true, 50);
      }
    } else {
      if (this.getBar(index + 1) === undefined) { return };
      const leftPositionOfRightBar = parseInt(this.#getPositionFromIndex(index + 1));
      if (leftPositionOfRightBar < centerOfMovingBar) {
        this.swapBars(index, index + 1, false, false);
        this.updateBarPosition(index, true, 50);
      }
    }

  }

  swapBars(index1, index2, animate=false, moveItems=true, speed=undefined) {

    const barHolder = this.getBar(index1);
    this.#bars[index1] = this.#bars[index2];
    this.#bars[index2] = barHolder;

    if (moveItems) {
      console.log("moving items")
      this.getBar(index1).setPosition(this.#getPositionFromIndex(index1), animate, speed);
      this.getBar(index2).setPosition(this.#getPositionFromIndex(index2), animate, speed);
    }

  }

  #getPositionFromIndex(index) {
    return (index * (this.#sceneElement.clientWidth / this.#bars.length)) + "px";
  }

  // Default is to update all bars
  updateBarPosition(index, animate=false, speed=undefined) {

      this.#bars[index].setPosition(this.#getPositionFromIndex(index), animate, speed);

  }

  updateElementWidths() {
    const width = this.#sceneElement.clientWidth / this.#bars.length
    for (const bar of this.#bars) {
      bar.setWidth(width + "px");
    }
  }

  updateAll() {
    for (var index in this.#bars) {
      this.#bars[index].setPosition(this.#getPositionFromIndex(index), false);
    }
    this.updateElementWidths();
  }

  getBar(index) {
    return this.#bars[index];
  }

}
