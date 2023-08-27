import BarManager from "./BarManager.js";

console.log("Js running")

const sceneElement = document.getElementById("scene");

const barManager = new BarManager(sceneElement);

barManager.createBars(5);

document.getElementById("swapStuff").onclick = () => barManager.swapBars(0,2,true);
