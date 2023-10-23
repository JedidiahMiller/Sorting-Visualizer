import { AlgorithmActions, Frame } from "../AlgorithmDataTypes.js"

export default function selectionSort(baseArray: number[]) {

  var array = [...baseArray]
  var stepsList = [];
  var startingIndex = 0;

  while (startingIndex < array.length) {

    var indexOfCurrentSmallestNumber = startingIndex;

    for (var i = startingIndex; i < array.length; i++) {
      if (array[i] < array[indexOfCurrentSmallestNumber]) {
        indexOfCurrentSmallestNumber = i;
      }
    } 

    if (indexOfCurrentSmallestNumber != startingIndex) {
      const temp = array[indexOfCurrentSmallestNumber];
      array[indexOfCurrentSmallestNumber] = array[startingIndex];
      array[startingIndex] = temp;
      stepsList.push(new Frame(AlgorithmActions.SWAP_ELEMENTS, startingIndex, indexOfCurrentSmallestNumber));
    }

    startingIndex++;

  }
  
  return stepsList;
}