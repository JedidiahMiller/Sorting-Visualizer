import {Bar, Scene} from "./visualizer.js"

console.log("Js running")

const scene = new Scene(document.getElementById("scene"))

scene.createChild(5);

document.getElementById("swapStuff").onclick = () => scene.swapBars(0,2);
