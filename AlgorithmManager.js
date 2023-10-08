
import refSheet from "./AlgorithmReferenceSheet.js";
import FramePlayer from "./FramePlayer.js";
import bubbleSort from "./Algorithms/bubbleSort.js"

export default class AlgorithmManager {

  #barManager;
  #runSpeed = 5000;
  #currentAlgorithm = refSheet.BUBBLE_SORT;
  #algorithmSteps = [];
  #nextStep = 0;
  #isPlaying = false;
  #arrayInput = [];

  onPlayStateChange;

  constructor(barManager) {
    this.#barManager = barManager;
    this.#barManager.setTransitionTime(this.#runSpeed);  
    // Set callback function so array will update when changed
    this.#barManager.onBaseArrayChange = () => {
      // This is the only place where steps are generated
      this.#algorithmSteps = this.#generateStepsFromArray(this.#barManager.getBaseArray());
      this.#nextStep = 0;
    }
    this.#framePlayer = new FramePlayer(() => {
      this.#runFrame();
    }, this.#runSpeed);
  }

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort 
   * @returns array of commands to execute
   */
  #generateStepsFromArray(arrayToSort) {
    console.log("Generating from array", arrayToSort);
    switch (this.#currentAlgorithm) {
      case refSheet.BUBBLE_SORT:
       return bubbleSort(arrayToSort);

    }
    throw new Error("Current algorithm code is not valid");
  } 

  #runAnimationLoop(index) {

    
    // Run the step
    var step = this.#algorithmSteps[index];
    if (step[0] === refSheet.SWAP_ELEMENTS) {
      console.log("Attempting to swap", step[1], step[2], "from", step)
      this.#barManager.swapVisualArrayBars(step[1], step[2], this.#runSpeed);
    }
    // Set the step to the next thing
    this.#nextStep++;

    if (this.#nextStep === this.#algorithmSteps.length)
  }



  #runFrame() {
    // Run that step
    this.#runStep(this.#nextStep);
    // Pause if that was the last step
    if (this.#nextStep == this.#algorithmSteps.length - 1) {
      this.pause();
      return;
    }
    this.#nextStep += 1;
    if (this.#nextStep == this.#algorithmSteps.length) {
      this.pause();
    }
  }


  play() {
    if (this.#nextStep == this.#algorithmSteps.length) this.#nextStep = 0;
    if (this.#algorithmSteps.length === 0) {
      console.warn("There are no algorithm steps");
      this.pause();
      return;
    }
    this.#isPlaying = true;
    this.#framePlayer.start();
    if (this.onPlayStateChange) this.onPlayStateChange();
  }

  pause() {
    this.#isPlaying = false;
    this.#framePlayer.stop();
    if (this.onPlayStateChange) this.onPlayStateChange();
  }

  isPlaying() {
    return this.#isPlaying;
  }

  setRunSpeed(speed) {
    this.#runSpeed = speed;
    this.#barManager.setTransitionTime(speed);
  }
}