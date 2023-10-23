

const ALGORITHM_TYPES = [
  "Bubble Sort", 
  "Selection Sort"
]

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

export { ALGORITHM_TYPES, AlgorithmActions, Frame };