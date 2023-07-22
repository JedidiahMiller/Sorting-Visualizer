
export class Bar {

  constructor (parentElement) {

    this.parentElement = parentElement;
    this.dragOffset = null;

    // Create html element
    this.element = document.createElement("div");
    this.element.className = "bar";
    this.element.innerHTML = Math.random();
    this.parentElement.appendChild(this.element);

    this.element.onmousedown = (e) => this.startDraggingElement(e);

  }

  startDraggingElement(e) {
    e.preventDefault();
    this.dragOffset = e.clientX - this.element.getBoundingClientRect().left
    document.onmousemove = (e) => this.dragElement(e);
    document.onmouseup = (e) => this.endDrag(e)
  }

  dragElement(e) {
    var location = e.clientX - this.parentElement.getBoundingClientRect().left - this.dragOffset;
    this.element.style.left = location + "px";
  }

  endDrag(e) {
    document.onmousemove = null;
    document.onmouseup = null;
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
    this.children[index2] = temp;

    this.updateElementPositions(index1, index2);
  }

  // Provide index parameter to limit update to selected elements
  // Defaults to updating all
  updateElementPositions(indexes) {
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
      child.element.style.width = width + "px";
    }
  }

}

export class Animator {

  constructor(scene) {
    this.scene = scene;
    this.animationIsPaused = false;
    this.currentFrame = 0;
    this.animationFrames = undefined;
    this.delay = 500;
  }

  runAnimation(frame) {
    setTimeout(() => {
      if (frame > this.animationFrames.length - 1) {
        return;
      } else if (!this.animationIsPaused && this.frame != this.animationFrames.length - 1) {
        this.scene.swapBars(this.animationFrames[frame][0], this.animationFrames[frame][1])
        this.runAnimation(frame + 1);
      }
    }, this.delay);
  }

}