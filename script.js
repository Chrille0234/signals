import "./components/counter.js";
import "./components/textInput.js";
import "./components/effectLogger.js";
import "./components/resource.js";

class SignalDemo extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        
        .intro {
          background: #e7f3ff;
          padding: 15px;
          border-left: 4px solid #007acc;
          margin-bottom: 30px;
          border-radius: 4px;
        }
        
        .components {
          display: grid;
          gap: 20px;
        }
      </style>
      
      <h1>Signal Demo</h1>
      
      <div class="intro">
        <h3>What are Signals?</h3>
        <p>Signals are reactive values that automatically update the UI when they change. 
        This demo shows three concepts:</p>
        <ul>
          <li><strong>Basic Signals:</strong> Simple reactive values</li>
          <li><strong>Derived Signals:</strong> Computed values that update automatically</li>
          <li><strong>Effects:</strong> Side effects that run when signals change</li>
        </ul>
      </div>
      
      <div class="components">
        <product-browser></product-browser>
        <signal-counter></signal-counter>
        <signal-text-input></signal-text-input>
        <signal-effect-logger></signal-effect-logger>
      </div>
    `;
  }
}

customElements.define("signal-demo", SignalDemo);
