import {Signal} from "./signal.js";

let counter = new Signal(0, "counter");

const greeting = new Signal("Hello world!", "greeting")

function increment(){
    counter.value += 1
}

function updateGreeting(event) {
    const value = event.target.value
    greeting.value = value
}

document.querySelector("button")?.addEventListener("click", increment)
document.querySelector("input")?.addEventListener("input", updateGreeting)