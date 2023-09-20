
import refSheet from "./AlgorithmReferenceSheet.js";
import FramePlayer from "./FramePlayer.js";
import bubbleSort from "./Algorithms/bubbleSort.js"

/**
 * This will eventually handle running all of the sorting algorithms
 * Currently it is just a half finished jumbled mess of random code bits
 */

export default class AlgorithmManager {

  #barManager;
  #framePlayer;
  #runSpeed = 500;
  #currentAlgorithm = refSheet.BUBBLE_SORT;
  #algorithmSteps = [];
  #currentStep = 0;
  #isPlaying = false;
  #arrayInput = [];

  constructor(barManager) {
    this.#barManager = barManager;    
    // Set callback function so array will update when changed
    this.#barManager.onArrayOrderChange = () => {
      this.setArrayInput(this.#barManager.getArray());
      this.#algorithmSteps = this.#generateStepsForArray(this.#arrayInput);
    }
    this.#framePlayer = new FramePlayer(() => {
      this.#runFrame();
      console.log("Tick action attempt");
    }, this.#runSpeed);
  }
   

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort 
   * @returns array of commands to execute
   */
  #generateStepsForArray(arrayToSort) {
    console.log("Generating from array", arrayToSort);
    
    switch (this.#currentAlgorithm) {
      case refSheet.BUBBLE_SORT:
        console.log("Bubble result", bubbleSort(arrayToSort));
       return bubbleSort(arrayToSort);

    }

    throw new Error("Current algorithm code is not valid");
  } 

  updateSteps() {
    this.#algorithmSteps = this.#generateStepsForArray(this.#arrayInput);
  }

  #runFrame() {
    console.log("Run frame", this.#currentStep);
    console.log(this.#algorithmSteps);
    if (this.#currentStep == this.#algorithmSteps.length - 1) {
      console.log("You are already at the end. Why are you trying to go?");
      return;
    }
    // Set the current step to the next thing
    this.#currentStep += 1;
    // Check if you overshot somehow
    // If you went back to step 0 you would have to reset the array and everything
    // Run that step
    this.#runStep(this.#currentStep);
    // Pause if that was the last step
    if (this.#currentStep == this.#algorithmSteps.length - 1) {
      this.pause();
      return;
    }
  }

  #runStep(index) {
    console.log("Running step", index);
    var step = this.#algorithmSteps[index];
    if (step[0] === refSheet.SWAP_ELEMENTS) {
      this.#barManager.swapBars(step[1], step[2], true, true);
    }
  }

  setArrayInput(array) {
    this.#arrayInput = array;
  }

  play() {
    console.log(this.#algorithmSteps);
    if (this.#currentStep == this.#algorithmSteps.length) this.#currentStep = 0;
    this.#isPlaying = true;
    this.#framePlayer.start();
    console.log("Play");
  }

  pause() {
    this.#isPlaying = false;
    this.#framePlayer.stop();
    console.log("Pause");
  }

  isPlaying() {
    return this.#isPlaying;
  }


}