import { ALGORITHM_TYPES } from "./AlgorithmDataTypes.js";
import AlgorithmManager from "./AlgorithmManager.js";
export default function initializeControlBar(algorithmManager) {
    if (!(algorithmManager instanceof AlgorithmManager)) {
        throw new Error("Control bar cannot be initialized without proper AlgorithmManager instance parameter");
    }
    if (algorithmManager === null) {
        throw new Error("initializeControlBar() missing algorithmExecutor parameter");
    }
    const speedSlider = document.getElementById("speedSlider");
    const speedSliderLabel = document.getElementById("speedSliderLabel");
    const algorithmSelector = document.getElementById("algorithmSelector");
    const pausePlay = document.getElementById("pausePlay");
    const MAX_SPEED_MULTIPLIER = 200;
    const MAX_SLIDER_VALUE = 100;
    const updateSpeedSlider = () => {
        const sliderValue = parseInt(speedSlider.value);
        const dividerThing = (MAX_SLIDER_VALUE ** 3) / MAX_SPEED_MULTIPLIER;
        var multiplierValue = (sliderValue ** 3) / dividerThing;
        multiplierValue = multiplierValue < 0.5 ? 0.5 : multiplierValue;
        algorithmManager.barManager.setAnimationSpeedMultiplier(multiplierValue);
        speedSliderLabel.innerText = speedSlider.value + "%";
    };
    speedSlider.value = "25";
    updateSpeedSlider();
    speedSlider.onmousedown = () => {
        updateSpeedSlider();
        document.onmousemove = () => {
            updateSpeedSlider();
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            speedSlider.onmouseup = null;
        };
    };
    for (var i in ALGORITHM_TYPES) {
        const newOption = document.createElement("option");
        newOption.value = i;
        newOption.text = ALGORITHM_TYPES[i];
        algorithmSelector.appendChild(newOption);
    }
    algorithmSelector.onchange = () => {
        algorithmManager.currentAlgorithm = parseInt(algorithmSelector.value);
        algorithmManager.updateAlgorithmSteps();
    };
    pausePlay.innerText = "Play";
    pausePlay.onclick = () => {
        if (algorithmManager.isPlaying()) {
            algorithmManager.pause();
        }
        else {
            algorithmManager.play();
        }
    };
    algorithmManager.onPlayStateChange = () => {
        if (algorithmManager.isPlaying()) {
            pausePlay.innerText = "Pause";
        }
        else {
            pausePlay.innerText = "Play";
        }
    };
}
