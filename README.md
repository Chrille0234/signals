# How to Use

Create a New Instance of Signal

    let aSignal = new Signal(initial_value, variable_name);

initial_value: The initial value for your signal.

variable_name: The name of the variable you will use in your HTML, surrounded by pipes.

Wrap the Signal in Your HTML

    <p>Signal value: |variable_name|</p>

Replace variable_name with the name you provided when creating the Signal instance.

Update the Value

    aSignal.value = "new value";

You can change the value at any time using the value property.
Note: The datatype of the value cannot be changed once set.

# To Do

* Future Improvements: There are plans for a rewritten version that avoids creating span elements. Only god knows when that'll be.

* Let the user opt into being allowed to change the datatype of the value
