
import ref from "./AlgorithmReferenceSheet.js";



/**
 * This will eventually handle running all of the sorting algorithms
 * Currently it is just a half finished jumbled mess of random code bits
 */

export default class AlgorithmManager {

  #barManager;
  #runSpeed;
  #currentAlgorithm;
  #currentSteps = [];
  #isPlaying = false;
  #arrayInput = [];

  constructor(barManager) {
    this.#barManager = barManager;
  }
   

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort 
   * @returns array of commands to execute
   */
  #generateStepsForArray(arrayToSort) {
    
    switch (this.#currentAlgorithm) {
      case ref.BUBBLE_SORT:
        return bubbleSort(arrayToSort);

    }

  } 

  updateSteps() {
    this.#currentSteps = this.#generateStepsForArray(this.#arrayInput);
  }

  runStep(index) {
    console.log(this.#currentSteps)
    var step = this.#currentSteps[index];
    if (step[0] === ref.SWAP_ELEMENTS) {
      this.#barManager.swapBars(step[1], step[2], true, true);
    }
  }

  setArrayInput(array) {
    this.#arrayInput = array;
  }

  setIsPlaying(value) {
    this.value = value;
  }


}