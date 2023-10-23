import ref from "../AlgorithmReferenceSheet.js"
import AlgorithmManager from "../AlgorithmManager.js";

export default function initializeControlBar(algorithmManager) {

  if (!(algorithmManager instanceof AlgorithmManager)) {
    throw new Error("Control bar cannot be initialized without proper AlgorithmManager instance parameter");
  }

  if (algorithmManager === null) {
    throw new Error("initializeControlBar() missing algorithmExecutor parameter")
  }

  const speedSlider = document.getElementById("speedSlider");
  const speedSliderLabel = document.getElementById("speedSliderLabel");
  const algorithmSelector = document.getElementById("algorithmSelector");
  const pausePlay = document.getElementById("pausePlay");
  const MAX_SPEED = 5000;

  // Speed slider
  speedSlider.onmousedown = () => {
    speedSliderLabel.innerText = speedSlider.value + "%";
    algorithmManager.setRunSpeed((parseInt(speedSlider.value) / 100) * MAX_SPEED);
    speedSlider.onmousemove = () => {
      speedSliderLabel.innerText = speedSlider.value + "%";
      algorithmManager.setRunSpeed((parseInt(speedSlider.value) / 100) * MAX_SPEED);
    }
    speedSlider.onmouseup = () => {
      speedSlider.onmousemove = null;
      speedSlider.onmouseup = null;
    }
  }

  // Algorithm Selector
  // 
  // Yeah this isnt great having to hard code stuff in right here, but I can't 
  // just do it in AlgorithmReferenceSheet. I'm guessing it's a trade off for 
  // being able to statically reference the class.
  var algorithmDictionary = {}
  algorithmDictionary[ref.BUBBLE_SORT] = "Bubble sort";

  for (var key in algorithmDictionary) {
    const newOption = document.createElement("option");
    newOption.value = key;
    newOption.text = algorithmDictionary[key];
    algorithmSelector.appendChild(newOption);
  }

  // Pause/play

  // Initial text
  pausePlay.innerText = "Play";

  // On click
  pausePlay.onclick = () => {
    if (algorithmManager.isPlaying()) {
      algorithmManager.pause();  
    } else {
      algorithmManager.play();
    }
  }

  // On pause/play
  algorithmManager.onPlayStateChange = () => {
    if (algorithmManager.isPlaying()) {
      pausePlay.innerText = "Pause";
    } else {
      pausePlay.innerText = "Play";
    }
  }

}
