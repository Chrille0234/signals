/**
 * @template T
 * @typedef {Object} Signal
 * @property {T} value
 * @property {(updated: T) => void} set
 * @property {(fn: (prev: T) => T) => void} update
 */

/** @type {Node[]} */
let allNodesWithSignals = (function(){
    /** @type {Node[]} */
    const elements = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function(node) {
            if (node.textContent?.match(/\{\{([^\s|]+)\}\}/g)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        }
    });
    while(walker.nextNode()) elements.push(walker.currentNode);
    return elements;
})();

/**
 * @template T
 * @param {T} value 
 * @param {string} markupName 
 * @param {Node} [root=document.body]
 * @returns {Node[]}
 */
export function initialiseSignal(value, markupName, root = document.body) {
  /** @type {Node[]} */
  const signalValueNodes = [];

  const placeholder = `{{${markupName}}}`;

  function processNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      // @ts-ignore
      handleTextNodeReplacement(node, placeholder, value, signalValueNodes);
    } else if (node.nodeType === Node.ELEMENT_NODE || node instanceof ShadowRoot) {
      Array.from(node.childNodes).forEach(child => processNode(child));
    }
  }

  function handleTextNodeReplacement(textNode, placeholder, value, collectedSignalNodes) {
    if (!textNode.isConnected) return;
    const textContent = textNode.nodeValue;
    if (!textContent || !textContent.includes(placeholder)) return;
    const parent = textNode.parentNode;
    if (!parent) return;
    const parts = textContent.split(placeholder);
    if (parts.length <= 1) return;
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

  processNode(root);

  return signalValueNodes;
}

/** @type {null | (() => void)} */
let subscriber = null

/**
 * @template T
 * @param {T} value 
 * @param {string} markupName 
 * @param {Node} [root]
 * @returns {Signal<T>}
 */
export function signal(value, markupName, root) {
    /** @type {Set<() => void>} */
    const subscribers = new Set()
    const elementsWithSignal = initialiseSignal(value, markupName, root)

    return {
        get value() {
            if(subscriber) {
                subscribers.add(subscriber)
            }
            return value
        },
        /** @param {T} updated */
        set(updated){
            if(updated === value) return
            value = updated
            elementsWithSignal.forEach(el => el.textContent = String(updated))
            subscribers.forEach(fn => fn())
        },
        /** @param {(prev: T) => T} fn */
        update(fn) {
            const newvalue = fn(value)
            if(newvalue === value) return
            value = newvalue
            elementsWithSignal.forEach(el => el.textContent = String(newvalue))
            subscribers.forEach(fn => fn())
        }
    }
}

/** @param {() => void} fn */
export function effect(fn){
    subscriber = fn
    fn()
    subscriber = null
}

/**
 * @template T
 * @param {() => T} fn 
 * @param {string} markupName 
 * @param {Node} [root]
 * @returns {Signal<T>}
 */
export function derived(fn, markupName, root){
    /** @type {Signal<T>} */
    const derived = signal(fn(), markupName, root)
    effect(() => {
        derived.set(fn())
    })
    return derived
}
