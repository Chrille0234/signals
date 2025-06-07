import { signal, derived } from "../signal.js";

export class TextInputComponent extends HTMLElement {
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
        
        input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 250px;
          font-size: 16px;
        }
        
        button {
          padding: 8px 16px;
          margin-left: 10px;
          border: none;
          border-radius: 4px;
          background: #dc3545;
          color: white;
          cursor: pointer;
        }
        
        button:hover {
          background: #c82333;
        }
        
        .stats {
          margin-top: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }
      </style>
      
      <h3>Text Input with Derived Values</h3>
      <div>
        <input type="text" id="textInput" placeholder="Type something...">
        <button id="clearText">Clear</button>
      </div>
      
      <div class="stats">
        <div><strong>Text:</strong> "{{inputText}}"</div>
        <div><strong>Length:</strong> {{textLength}} characters</div>
        <div><strong>Word Count:</strong> {{wordCount}} words</div>
      </div>
    `;

    // Create signals scoped to this component
    this.inputText = signal("", "inputText", this.shadow);
    this.textLength = derived(() => this.inputText.value.length, "textLength", this.shadow);
    this.wordCount = derived(() => {
      const text = this.inputText.value.trim();
      return text === "" ? 0 : text.split(/\s+/).length;
    }, "wordCount", this.shadow);
  }

  connectedCallback() {
    const textInput = this.shadow.getElementById("textInput");
    
    textInput.addEventListener("input", (e) => {
      this.inputText.set(e.target.value);
    });
    
    this.shadow.getElementById("clearText").addEventListener("click", () => {
      this.inputText.set("");
      textInput.value = "";
    });
  }
}

customElements.define("signal-text-input", TextInputComponent);
