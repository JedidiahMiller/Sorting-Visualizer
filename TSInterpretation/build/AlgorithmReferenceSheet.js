"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = exports.AlgorithmActions = exports.AlgorithmTypes = void 0;
var AlgorithmTypes;
(function (AlgorithmTypes) {
    AlgorithmTypes["BUBBLE_SORT"] = "Bubble Sort";
})(AlgorithmTypes || (exports.AlgorithmTypes = AlgorithmTypes = {}));
var AlgorithmActions;
(function (AlgorithmActions) {
    AlgorithmActions["SWAP_ELEMENTS"] = "Swap elements";
})(AlgorithmActions || (exports.AlgorithmActions = AlgorithmActions = {}));
class Frame {
    constructor(action, ...parameters) {
        this.action = action;
        this.parameters = parameters;
    }
}
exports.Frame = Frame;
