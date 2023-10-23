import ref from "../OldVanillaJS/AlgorithmReferenceSheet.js"

export default function bubbleSort(baseArray) {

  var array = [...baseArray]
  var stepsList = [];

  var sorted = false;

  while (!sorted) {
    // Set sorted to true, change it if anything has to be done
    sorted = true;
    // Iterate through array
    for (var i = 0; i < array.length - 1; i++) {
      // Swap elements if needed
      if (array[i] > array[i + 1]) {
        // Add to the steps array
        stepsList.push([ref.SWAP_ELEMENTS, i, i + 1]);

        // Run the step to keep track of place
        const temp = array[i];
        array[i] = array[i+1];
        array[i+1] = temp;

        // Tell the while loop to keep going
        sorted = false;
      }
    }
  }
  return stepsList;
}