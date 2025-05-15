let allNodesWithSignals = (function(){
    const elements = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function(node) {
            if (node.textContent?.match(/\|([^\s|]+)\|/g)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        }
    });
    while(walker.nextNode()) elements.push(walker.currentNode);
    return elements;
})();

export function initialiseSignal(markupName, value) {
  const signalValueNodes = [];

  const placeholder = `|${markupName}|`;

  function processNode(node) {
    if (!node) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      handleTextNodeReplacement(node, placeholder, value, signalValueNodes);
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(child => processNode(child));
    }
  }

  function handleTextNodeReplacement(textNode, placeholder, value, collectedSignalNodes) {
    if (!textNode.isConnected) {
      return;
    }

    const textContent = textNode.nodeValue;

    if (!textContent || !textContent.includes(placeholder)) {
      return;
    }

    const parent = textNode.parentNode;
    if (!parent) {
      return;
    }

    const parts = textContent.split(placeholder);

    if (parts.length <= 1) {
      return;
    }

    textNode.nodeValue = parts[0];

    let nodeAfterInsertionPoint = textNode;

    for (let i = 1; i < parts.length; i++) {
      const signalTextNode = document.createTextNode(String(value ?? ''));

      collectedSignalNodes.push(signalTextNode);
      parent.insertBefore(signalTextNode, nodeAfterInsertionPoint.nextSibling);

      nodeAfterInsertionPoint = signalTextNode;

      const textAfterPlaceholder = parts[i];
      if (textAfterPlaceholder.length > 0) {
        const afterPartTextNode = document.createTextNode(textAfterPlaceholder);

        parent.insertBefore(afterPartTextNode, nodeAfterInsertionPoint.nextSibling);

        nodeAfterInsertionPoint = afterPartTextNode;
      }
    }
  }

  if (allNodesWithSignals && typeof allNodesWithSignals[Symbol.iterator] === 'function') {
      allNodesWithSignals.forEach(el => {
          processNode(el);
      });
  } else {
      console.warn("initialiseSignal: 'allNodesWithSignals' is not a valid iterable.", allNodesWithSignals);
  }


  return signalValueNodes;
}


/**
 * @type {null | (() => void)}
 */
let subscriber = null

export function signal(val, markupName) {
    const subscribers = new Set()
    const elementsWithSignal = initialiseSignal(markupName, val)

    return {
        get value() {
            if(subscriber) {
                subscribers.add(subscriber)
            }
            return val
        },
        set(updated){
            if(updated === val) return
            val = updated
            elementsWithSignal.forEach(el => el.textContent = updated)
            subscribers.forEach(fn => fn())
        },
        update(fn) {
            const newVal = fn(val)
            if(newVal === val) return
            val = newVal
            elementsWithSignal.forEach(el => el.textContent = newVal)
            subscribers.forEach(fn => fn())
        }
    }
}

export function effect(fn){
    subscriber = fn
    fn()
    subscriber = null
}

export function derived(fn, markupName){
    const derived = signal(undefined, markupName)
    effect(() => {
        derived.set(fn())
    })
    return derived
}
