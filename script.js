import {Signal} from "./signal.js";

let counter = new Signal(0, "counter");

function increment(){
    counter.value += 1
}

// @ts-ignore
document.querySelector("button").addEventListener("click", () => {increment()})