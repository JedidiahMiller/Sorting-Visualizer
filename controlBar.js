import ref from "./AlgorithmReferenceSheet.js"

export default function initializeControlBar(algorithmExecutor) {

  if (algorithmExecutor === null) {
    throw new Error("initializeControlBar() missing algorithmExecutor parameter")
  }

  const speedSlider = document.getElementById("speedSlider");
  const speedSliderLabel = document.getElementById("speedSliderLabel");
  const algorithmSelector = document.getElementById("algorithmSelector");
  const pausePlay = document.getElementById("pausePlay");
  
  // Speed slider
  speedSlider.onmousedown = () => {
    speedSliderLabel.innerText = speedSlider.value + "%";
    speedSlider.onmousemove = () => {
      speedSliderLabel.innerText = speedSlider.value + "%";
    }
    speedSlider.onmouseup = () => {
      speedSlider.onmousemove = null;
      speedSlider.onmouseup = null;
    }
  }

  // Algorithm Selector
  // 
  // Yeah this isnt great, but I can't just do it in AlgorithmReferenceSheet.
  // I'm guessing it's a trade off for being able to statically reference it.
  var algorithmDictionary = {}
  algorithmDictionary[ref.BUBBLE_SORT] = "Bubble sort";

  for (var key in algorithmDictionary) {
    const newOption = document.createElement("option");
    newOption.value = key;
    newOption.text = algorithmDictionary[key];
    algorithmSelector.appendChild(newOption);
  }

  // Pause/play
  pausePlay.text = "Play";
  pausePlay.onclick = algorithmExecutor.toggleRun() ? 
    pausePlay.text = "Pause" : pausePlay.text = "Play";


}
