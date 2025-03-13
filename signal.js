// Check which elements contain 2 pipes. This is to avoid scanning the entire document everytime you create a new signal instance
let allNodesWithSignals = function(){
    let allElementOnPage = document.body?.children

    let elements = []

    if(!allElementOnPage) {
        return []
    }
    Array.from(allElementOnPage).forEach(el => {
        let regex = /\|([^\s|]+)\|/g;

        if (el.textContent?.match(regex)) {
            elements.push(el)
        } 
    });

    return elements
}()

function splitAndKeepDelimiterInterleaved(str, delimiter) {
    if (typeof str !== 'string' || typeof delimiter !== 'string' || delimiter === '') {
      return []; // Handle invalid input
    }
  
    const result = [];
    let currentIndex = 0;
    let delimiterIndex;
  
    while ((delimiterIndex = str.indexOf(delimiter, currentIndex)) !== -1) {
      if (currentIndex < delimiterIndex) {
        result.push(str.slice(currentIndex, delimiterIndex));
      }
      result.push(delimiter);
      currentIndex = delimiterIndex + delimiter.length;
    }
  
    if (currentIndex < str.length) {
      result.push(str.slice(currentIndex));
    }
  
    //Remove trailing delimiter if there is one.
    if(result.length > 0 && result[result.length -1] === delimiter){
        result.pop();
    }
  
    return result;
  }

export class Signal {
    /** 
     * @template T
     *  @param {T} value value can be anything
     *  @param {string}  variablename This is what you will be writing in your html, surrounded by pipes ("|")
    */
    constructor(value, variablename) {
        /** @type {T} */
        this._value = value;
        /** @type {Array} stores all text nodes that use the value */
        this._nodesArr = [];
        /** @type {string} */
        this.variablename = variablename;

        Array.from(allNodesWithSignals).forEach(el => {
            if (!el.textContent?.includes("|" + this.variablename + "|")) {
                return;
            }

            let regex = new RegExp(`\\|${this.variablename}\\|`, 'g');
            let matches;
            while ((matches = regex.exec(el.textContent)) !== null) {
                let textNode = document.createTextNode(this._value);
                let start = matches.index;
                let end = start + matches[0].length;
                let before = el.textContent.slice(0, start);
                let after = el.textContent.slice(end);
                el.textContent = before;
                el.appendChild(textNode);
                el.appendChild(document.createTextNode(after));
                this._nodesArr.push(textNode);
            }
        });
    }

    _updateNodes() {
        this._nodesArr.forEach(node => {
            node.nodeValue = this._value;
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
