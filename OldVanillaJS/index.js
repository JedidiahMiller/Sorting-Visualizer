import BarManager from "./BarManager.js";
import AlgorithmManager from "./AlgorithmManager.js"
import initializeControlBar from "./Algorithms/controlBar.js"

const sceneElement = document.getElementById("scene");

const barManager = new BarManager(sceneElement);
const algorithmManager = new AlgorithmManager(barManager);
initializeControlBar(algorithmManager);

barManager.createBars(6);

window.onresize = () => barManager.updateAllWidthsAndPositions();
