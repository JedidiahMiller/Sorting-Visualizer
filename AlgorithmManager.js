
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
    this.#barManager.onArraySizeChange = () => {
      this.setArrayInput(this.#barManager.getArray());
    }
    this.#framePlayer = new FramePlayer(() => this.#runFrame, this.#runSpeed);
  }
   

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort 
   * @returns array of commands to execute
   */
  #generateStepsForArray(arrayToSort) {
    
    switch (this.#currentAlgorithm) {
      case refSheet.BUBBLE_SORT:
        return bubbleSort(arrayToSort);

    }

    throw new Error("Current algorithm code is not valid");
  } 

  updateSteps() {
    this.#algorithmSteps = this.#generateStepsForArray(this.#arrayInput);
  }

  #runStep(index) {
    var step = this.#algorithmSteps[index];
    if (step[0] === refSheet.SWAP_ELEMENTS) {
      this.#barManager.swapBars(step[1], step[2], true, true);
    }
  }

  #runFrame() {
    if (this.#currentStep == this.#algorithmSteps.length) {
      this.pause();
      return;
    }
    this.#runStep(this.#currentStep);
    this.#currentStep += 1;
  }

  setArrayInput(array) {
    this.#arrayInput = array;
  }

  play() {
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