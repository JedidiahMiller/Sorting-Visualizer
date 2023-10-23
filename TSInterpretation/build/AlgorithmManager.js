import { AlgorithmActions } from "./AlgorithmDataTypes.js";
import FramePlayer from "./FramePlayer.js";
import bubbleSort from "./Algorithms/bubbleSort.js";
import selectionSort from "./Algorithms/selectionSort.js";
export default class AlgorithmPlayer extends FramePlayer {
    constructor(barManager) {
        super();
        this.currentAlgorithm = 1;
        this.barManager = barManager;
        this.barManager.onBaseStateChange = () => {
            this.reset();
            this.updateAlgorithmSteps();
        };
        this.barManager.onUserInteraction = () => this.pause();
    }
    generateStepsFromArray(arrayToSort) {
        switch (this.currentAlgorithm) {
            case 0:
                console.log("Bubble sorting");
                return bubbleSort(arrayToSort);
            case 1:
                console.log("Selection sorting");
                return selectionSort(arrayToSort);
        }
        throw new Error("Current algorithm code is not valid, cannot generate steps");
    }
    reset() {
        this.currentFrameNumber = 0;
        this.barManager.resetBars();
    }
    runFrame(number, onFinish) {
        const step = this.frames[number];
        if (step.action === AlgorithmActions.SWAP_ELEMENTS) {
            this.barManager.swapVisualBars(step.parameters[0], step.parameters[1], onFinish);
        }
    }
    pause() {
        super.pause();
        this.barManager.endAnimations();
    }
    updateAlgorithmSteps() {
        this.frames = this.generateStepsFromArray(this.barManager.getBaseArray());
    }
}
