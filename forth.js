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
    // console.log("Input", input);
    console.log(tokens);
    var stack = tokens.split(" ");
    // console.log("After splitting", stack);
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
    return stack.join(" ");
}
var wordFunctions = {
    dup: function (x) {
        return [x, x];
    },
};
function handleWordsManipulation(arr) {
    var stack = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === "dup") {
            var first = stack.pop();
            if (isNaN(Number(first))) {
                console.log("please enter a vlid number to be duplicated");
                return;
            }
            var result = wordFunctions["dup"](first);
            console.log("the result i am getting", result);
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var val = result_1[_i];
                stack.push(val);
            }
            console.log("After duplication:", stack);
        }
        else {
            stack.push(arr[i]);
        }
    }
    return stack.join(" ");
}
readline.on("line", function (input) {
    if (input === "quit") {
        readline.close();
        return;
    }
    else {
        inputStream.push(input);
        var tokens = convertInputToTokens(inputStream);
        var afterWordManipulation = handleWordsManipulation(tokens);
        var finalResult = handleArithmetic(afterWordManipulation.split(" "));
        if (finalResult != null) {
            console.log(finalResult);
        }
        inputStream = [];
    }
});
