

enum AlgorithmTypes {
  // Sorting algorithms
  BUBBLE_SORT = "Bubble Sort"
}

enum AlgorithmActions {
  SWAP_ELEMENTS = "Swap elements"
}

class Frame {

  action;
  parameters;

  constructor(action: AlgorithmActions, ...parameters: any[]) {
    this.action = action;
    this.parameters = parameters;
  }

}

export { AlgorithmTypes, AlgorithmActions, Frame };