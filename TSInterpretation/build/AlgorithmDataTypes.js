const ALGORITHM_TYPES = [
    "Bubble Sort",
    "Selection Sort"
];
var AlgorithmActions;
(function (AlgorithmActions) {
    AlgorithmActions["SWAP_ELEMENTS"] = "Swap elements";
})(AlgorithmActions || (AlgorithmActions = {}));
class Frame {
    constructor(action, ...parameters) {
        this.action = action;
        this.parameters = parameters;
    }
}
export { ALGORITHM_TYPES, AlgorithmActions, Frame };
