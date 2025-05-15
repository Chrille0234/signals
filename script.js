import { signal } from "./signal.js";

const counter = signal(0, "counter")

const button = document.querySelector("button")

button.addEventListener("click", () => counter.update(prev => ++prev))
