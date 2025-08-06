import { signal, derived } from "../signal.js";

export class CounterComponent extends HTMLElement {
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
          margin: 0 5px;
          border: none;
          border-radius: 4px;
          background: #007acc;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:hover {
          background: #005a9e;
        }
        
        .counter-display {
          margin: 10px 0;
          font-size: 18px;
        }
        
        .derived-values {
          margin-top: 15px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }
      </style>
      
      <h3>Interactive Counter</h3>
      <div>
        <button id="decrement">-</button>
        <span class="counter-display">Count: {{count}}</span>
        <button id="increment">+</button>
      </div>
      
      <div class="derived-values">
        <div><strong>Double:</strong> {{doubled}}</div>
        <div><strong>Square:</strong> {{squared}}</div>
        <div><strong>Is Even:</strong> {{isEven}}</div>
      </div>
    `;

    // Create signals scoped to this component
    this.count = signal(0, "count", this.shadow);
    this.doubled = derived(() => this.count * 2, "doubled", this.shadow);
    this.squared = derived(() => this.count ** 2, "squared", this.shadow);
    this.isEven = derived(() => this.count % 2 === 0 ? "Yes" : "No", "isEven", this.shadow);
  }

  connectedCallback() {
    this.shadow.getElementById("increment").addEventListener("click", () => {
      this.count.update(prev => prev + 1);
    });
    
    this.shadow.getElementById("decrement").addEventListener("click", () => {
      this.count.update(prev => prev - 1);
    });
  }
}

customElements.define("signal-counter", CounterComponent);
