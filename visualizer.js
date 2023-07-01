

export class Bar {

  constructor (parentElement) {

    this.parentElement = parentElement;

    // Create html element
    this.element = document.createElement("div");
    this.element.className = "bar";

    // Add dragging functionality
    this.isBeingDragged = false;
    this.element.addEventListener("mousedown", () => this.isBeingDragged = true);
    this.parentElement.addEventListener("mousemove", () => console.log("Element drag attempt"));
    this.parentElement.addEventListener("mouseup", () => this.isBeingDragged = false);


    this.parentElement.appendChild(this.element);

  }

}

export class Scene {

  constructor (sceneElement) {

    this.sceneElement = sceneElement;
    // This also keeps track of the childrens order
    // Has getter and setter functions
    this.children = [];

  }

  createChild(number) {
    number = number ? number : 1;
    for (var i = 0; i < number; i++) {
      const newBar = new Bar(this.sceneElement);
      this.children.push(newBar);
    }
    this.updateElementWidths();
    this.updateElementPositions();
  }

  removeChild(index) {
    this.children.splice(index, 1); 
  }

  swapBars(index1, index2) {

    // This function will have to handle communicating movement to bars
    const temp = this.children[index1];
    this.children[index1] = this.children[index2];
    this.children[index2] = this.children[temp];

  }

  updateElementPositions(elements) {
    if (arguments.length == 0) {
      for (var index in this.children) {
        this.children[index].element.style.left = (index * (this.sceneElement.clientWidth / this.children.length)) + "px";
      }
    } else {
      for (index of arguments) {
        this.children[index].element.style.left = (index * (this.sceneElement.clientWidth / this.children.length)) + "px";
      }
    }

  }

  updateElementWidths() {
    const width = this.sceneElement.clientWidth / this.children.length
    for (var child of this.children) {
      child.element.style.width = width + "px"
    }
  }

}

export class Animator {

  constructor(scene) {
    this.scene = scene;
    this.animationIsPaused = false;
    this.currentFrame = 0;
    this.animationSteps = undefined;
    this.speed = 500;
  }

  runAnimation(frame) {
    setTimeout(() => {
      if (!this.animationIsPaused) {

      }
    }, this.speed)
  }



}