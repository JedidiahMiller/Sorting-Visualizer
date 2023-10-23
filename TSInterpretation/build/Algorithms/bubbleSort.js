import { AlgorithmActions, Frame } from "../AlgorithmDataTypes.js";
export default function bubbleSort(baseArray) {
    var array = [...baseArray];
    var stepsList = [];
    var sorted = false;
    while (!sorted) {
        sorted = true;
        for (var i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
                stepsList.push(new Frame(AlgorithmActions.SWAP_ELEMENTS, i, i + 1));
                const temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                sorted = false;
            }
        }
    }
    return stepsList;
}
