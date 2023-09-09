import ref from "./AlgorithmReferenceSheet.js"
import bubbleSort from "./Algorithms/bubbleSort.js"

export default class AlgorithmExecutor {

  #currentAlgorithm;
  #steps;
  #barManager;
  #isRunning = false;

  constructor(barManager) {
    this.#barManager = barManager;
    this.#currentAlgorithm = ref.BUBBLE_SORT;
    this.#steps = this.#generateSteps(barManager.getBars().map((bar) => bar.value));
    console.log(this.#steps)
    console.log(barManager.getBars())
  }
   
  /**
   * Generates a list of commands to run to execute the algorithm.
   * 
   * @param {int[]} arrayToSort 
   * @returns array of commands to execute
   */
  #generateSteps(arrayToSort) {
    
    switch (this.#currentAlgorithm) {
      case ref.BUBBLE_SORT:
        return bubbleSort(arrayToSort);

    }

  }

  toggleRun() {
    if (this.#isRunning) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    this.runSteps();
  }

  pause() {

  }
  /**
   * Runs the steps previously generated.
   */
  runSteps() {
    for (var i = 0; i < this.#steps.length; i++) {
      this.runStep(i);
    }
  }

  runStep(index) {
    console.log(this.#steps)
    var step = this.#steps[index];
    if (step[0] === ref.SWAP_ELEMENTS) {
      this.#barManager.swapBars(step[1], step[2], true, true);
    }
  }

}