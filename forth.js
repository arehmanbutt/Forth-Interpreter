var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
});
console.log("Welcome to Forth\n\nTo close the program type 'quit'\n\n");
readline.prompt();
var inputStream = [];
function convertInputToTokens(input) {
    var tokens = input.toString();
    var stack = tokens.split(" ");
    return stack;
}
var mathFunctions = {
    "+": function (x, y) {
        return x + y;
    },
    "-": function (x, y) {
        return x - y;
    },
    "*": function (x, y) {
        return x * y;
    },
    "/": function (x, y) {
        return x / y;
    },
};
function handleArithmetic(arr) {
    var stack = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var val = arr_1[_i];
        if (val in mathFunctions) {
            var second = stack.pop();
            var first = stack.pop();
            // Convert only if both are valid numbers
            if ((typeof first === "string" && isNaN(Number(first))) ||
                (typeof second === "string" && isNaN(Number(second)))) {
                console.log("Invalid expression: not enough numeric operands.");
                return;
            }
            var num1 = Number(first);
            var num2 = Number(second);
            var result = mathFunctions[val](num1, num2);
            stack.push(result.toString());
        }
        else {
            stack.push(val);
        }
    }
    return stack.map(String); // final output as string array
}
readline.on("line", function (input) {
    if (input === "quit") {
        readline.close();
        return;
    }
    if (input === "clear") {
        inputStream = [];
    }
    else {
        inputStream.push(input);
        var stack = convertInputToTokens(inputStream);
        console.log("Stack is: ", stack);
        var result = handleArithmetic(stack);
        console.log("result is: ", result);
        if (result != null) {
            console.log(result.join(" "));
        }
        inputStream = [];
    }
});
