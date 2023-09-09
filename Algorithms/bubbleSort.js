import ref from "../AlgorithmReferenceSheet.js"

export default function bubbleSort(array) {

  var stepsList = [];
  var topLine = array.length - 1;

  while (topLine > 0) {
    for (var i = 0; i < topLine; i++) {
      if (array[i] > array[i + 1]) {
        stepsList.push([ref.SWAP_ELEMENTS, i, i + 1]);
      }
    }
    topLine -= 1;
  }
}