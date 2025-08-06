import { signal, effect } from "../signal.js";

export class EffectLoggerComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 10px 0;
          font-family: Arial, sans-serif;
        }
        
        button {
          padding: 8px 16px;
          margin: 5px;
          border: none;
          border-radius: 4px;
          background: #28a745;
          color: white;
          cursor: pointer;
        }
        
        button:hover {
          background: #218838;
        }
        
        .log {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 10px;
          margin-top: 10px;
          max-height: 150px;
          overflow-y: auto;
          font-family: monospace;
          font-size: 12px;
        }
        
        .log-entry {
          margin: 2px 0;
          color: #495057;
        }
      </style>
      
      <h3>Effect System Demo</h3>
      <div>
        <button id="triggerChange">Trigger Change</button>
        <button id="clearLog">Clear Log</button>
        <div><strong>Random Value:</strong> {{randomValue}}</div>
      </div>
      
      <div class="log" id="effectLog">
        <div class="log-entry">Effect system ready...</div>
      </div>
    `;

    // Create signal scoped to this component
    this.randomValue = signal(0, "randomValue", this.shadow);

    // Set up effect to log changes
    effect(() => {
      const log = this.shadow.getElementById("effectLog");
      if (log && this.randomValue !== 0) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement("div");
        entry.className = "log-entry";
        entry.textContent = `[${timestamp}] Value changed to: ${this.randomValue}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
      }
    });
  }

  connectedCallback() {
    this.shadow.getElementById("triggerChange").addEventListener("click", () => {
      const newValue = Math.floor(Math.random() * 100);
      this.randomValue.set(newValue);
    });
    
    this.shadow.getElementById("clearLog").addEventListener("click", () => {
      const log = this.shadow.getElementById("effectLog");
      log.innerHTML = '<div class="log-entry">Log cleared...</div>';
    });
  }
}

customElements.define("signal-effect-logger", EffectLoggerComponent);
