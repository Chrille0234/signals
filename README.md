### signal() example
```javascript
    const counter = signal(0, "counter") // this will create a counter signal, which will look for all nodes in the HTML document that contains '|counter|' and automatically render the changes to counter.
    counter.set(5) // this will set the value of counter to 5, and render the new value.
    counter.update(prev => ++prev) // same as counter.set, except you have access to the previous value.
```

### effect() example
```javascript
    const counter = signal(0)

    effect(() => { // all signals used inside of effect() will automatically subscribe. The effect rerun everytime a signal used inside changes.
        console.log(`counter doubled is: ${counter.value * 2}`)
    )
    
```

## derived() example
```javascript
    const counter = signal(0, "counter")
    // derived is the exact same as effect, except it returns a value, and like signal(), you can give it a second argument. The second argument is explained in the signal() example.
    // you dont necessarily need to assign it to anything. If you don't, it will still reflect the changes in the UI.
    // it's basically as if effect() and signal() had a baby. 
    const counterDoubled = derived(() => counter.value * 2, "doubled")
```
