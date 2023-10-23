
import refSheet from "./AlgorithmReferenceSheet.js";
import FramePlayer from "./FramePlayer.js";
import bubbleSort from "../Algorithms/bubbleSort.js"

export default class AlgorithmPlayer extends FramePlayer {

  #barManager;
  #currentAlgorithm = refSheet.BUBBLE_SORT;

  constructor(barManager) {
    super();
    this.#barManager = barManager;
    // Set callback function so array will update when changed
    this.#barManager.onBaseStateChange = () => {
      // This is the only place where steps are generated
      console.log("base array changed")
      this.frames = this.#generateStepsFromArray(this.#barManager.getBaseArray());
    }
  }

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort
   * @returns array of commands to execute
   */
  #generateStepsFromArray(arrayToSort) {
    switch (this.#currentAlgorithm) {
      case refSheet.BUBBLE_SORT:
       return bubbleSort(arrayToSort);

    }
    throw new Error("Current algorithm code is not valid, cannot generate steps");
  } 

  /**
   * Implementation of abstract method. Defines the action to take for a frame.
   * 
   * @param {*} frameNumber 
   * @param {*} onFinish 
   */
  runFrame(frameNumber, onFinish) {

    console.log(this.frames);
    const step = this.frames[frameNumber];
    if (step[0] === refSheet.SWAP_ELEMENTS) {
      this.#barManager.swapVisualBars(step[1], step[2], onFinish);
    }

  }

  reset() {
    super.reset();
    this.#barManager.resetBars();
    console.log("Reset");
  }

}