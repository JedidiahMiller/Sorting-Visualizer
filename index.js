import BarManager from "./BarManager.js";
import AlgorithmExecutor from "./AlgorithmExecutor.js"
import initializeControlBar from "./controlBar.js"

console.log("Js running")

const sceneElement = document.getElementById("scene");

const barManager = new BarManager(sceneElement);
const algorithmExecutor = new AlgorithmExecutor(barManager);
initializeControlBar(algorithmExecutor);

barManager.createBars(5);

window.onresize = () => barManager.updateAll();
