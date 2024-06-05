export class Signal {
    /** 
     *  @param {any} value value can be anything
     *  @param {string}  variablename This is what you will be writing in your html, surrounded by pipes ("|")
    */
    constructor(value, variablename) {
        /** @type {any} */
        this._value = value;
        /** @type {Array} stores all elements that use the value */
        this._nodesArr = [];
        /** @type {string} */
        this.variablename = variablename;

        // used for searching through your entire DOM tree for |variablename|
        let allElementOnPage = document.querySelector("body")?.children;

        if(!allElementOnPage) {
            console.log("Using signals require a body.")
            return
        }

        Array.from(allElementOnPage).forEach(el => {
            if (!el.textContent?.includes("|" + this.variablename + "|")) {
                return;
            }

            /** @type {string[]} */
            let oldInnerTextSplitted = el.textContent.split("|");

            // Replace |variablename| with <span class="variablename">value</span>
            // The span is needed because i need a proper way to replace the variable without the pipes, as they will no longer be there.
            let newInnerText = oldInnerTextSplitted.map(text => text === this.variablename ? `<span class="${this.variablename}">${this._value}</span>` : text).join("");
            el.innerHTML = newInnerText;

            this._nodesArr.push(el.querySelector("." + this.variablename));
        });
    }

    _updateNodes() {
        this._nodesArr.forEach(el => {
            el.innerText = this._value
        });
    }

    set value(newValue) {
        if(typeof this._value !== typeof newValue) {
            console.log("changing the data type is not allowed")
            return 
        }
        this._value = newValue;
        this._updateNodes();
    }

    get value() {
        return this._value;
    }
}