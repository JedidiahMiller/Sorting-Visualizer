
import { ALGORITHM_TYPES, AlgorithmActions, Frame } from "./AlgorithmDataTypes.js";
import FramePlayer from "./FramePlayer.js";
import bubbleSort from "./Algorithms/bubbleSort.js"
import selectionSort from "./Algorithms/selectionSort.js";
import BarManager from "./BarManager.js"

export default class AlgorithmPlayer extends FramePlayer {

  barManager;
  currentAlgorithm = 1;

  constructor(barManager: BarManager) {
    super();
    this.barManager = barManager;
    // Set callback function so array will update when changed
    this.barManager.onBaseStateChange = () => {
      // This is the only place where steps are generated
      this.reset();
      this.updateAlgorithmSteps();
    }
    this.barManager.onUserInteraction = () => this.pause();
  }

  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort
   * @returns array of commands to execute
   */
  generateStepsFromArray(arrayToSort: number[]) {
    switch (this.currentAlgorithm) {
      case 0:
        return bubbleSort(arrayToSort);
      case 1:
        return selectionSort(arrayToSort);
    }
    throw new Error("Current algorithm code is not valid, cannot generate steps");
  } 

  reset() {
    this.currentFrameNumber = 0;
    this.barManager.resetBars();

  }

  runFrame(number: number, onFinish?: () => void) {
    const step = this.frames[number];
    if (step.action === AlgorithmActions.SWAP_ELEMENTS) {
      this.barManager.swapVisualBars(step.parameters[0], step.parameters[1], onFinish);
    }
  }

  /**
   * Overrides pause function.
   */
  pause() {
    super.pause();
    this.barManager.endAnimations();
  }

  /**
   * Updates the algorithm steps
   */
  updateAlgorithmSteps() {
    this.frames = this.generateStepsFromArray(this.barManager.getBaseArray());
  }

}