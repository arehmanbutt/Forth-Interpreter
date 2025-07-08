var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
});
console.log("Welcome to Forth\n\nTo close the program type 'quit'\n\n");
readline.prompt();
var inputStream = [];
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
function convertInputToTokens(input) {
    var tokens = input.toString().trim();
    var stack = tokens.split(" ");
    return stack;
}
// Evaluation
function evaluate(tokens) {
    var stack = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (!isNaN(Number(token))) {
            stack.push(Number(token));
        }
        else if (token in mathFunctions) {
            var b = stack.pop();
            var a = stack.pop();
            if (typeof a !== "number" || typeof b !== "number") {
                console.log("Invalid expression: not enough numeric operands.");
                return;
            }
            var result = mathFunctions[token](a, b);
            stack.push(result);
        }
        else if (token === "dup") {
            var top_1 = stack[stack.length - 1];
            if (typeof top_1 !== "number") {
                console.log("Cannot dup non-number.");
                return;
            }
            stack.push(top_1);
        }
        else if (token === "swap") {
            var b = stack.pop();
            var a = stack.pop();
            if (a === undefined || b === undefined) {
                console.log("swap needs two elements.");
                return;
            }
            stack.push(b, a);
        }
        else if (token === "drop") {
            stack.pop();
        }
        else if (token === "over") {
            var secondLast = stack[stack.length - 2];
            if (secondLast === undefined) {
                console.log("swap needs two elements.");
                return;
            }
            stack.push(secondLast);
        }
        else {
            stack.push(token); // or error out if you want strict handling
        }
    }
    return stack.join(" ");
}
readline.on("line", function (input) {
    if (input === "quit") {
        readline.close();
        return;
    }
    inputStream.push(input);
    var tokens = convertInputToTokens(inputStream);
    var result = evaluate(tokens);
    if (result != null) {
        console.log(result);
    }
    inputStream = [];
});
