var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
});
var globalFunctions = {};
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
    console.log("After tokenisation", stack);
    return stack;
}
// Evaluation
function evaluate(tokens) {
    var stack = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
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
        else if (token in globalFunctions) {
            var definitionTokens = globalFunctions[token];
            if (definitionTokens) {
                tokens.splice.apply(tokens, __spreadArray([i, 1], definitionTokens, false));
                i--;
            }
        }
        else {
            stack.push(token);
        }
    }
    return stack.join(" ");
}
function isSyntaxCorrect(tokens) {
    // check proper syntax
    var flag = true;
    if (tokens[0] == ":" && tokens[tokens.length - 1] === ";") {
        console.log("This is a word definition");
    }
    else {
        console.log("This is not a correct word definiton");
        console.log("The correct format is <: word-definition functionality ;>");
        flag = false;
    }
    return flag;
}
function addDefinitons(tokens) {
    if (isSyntaxCorrect(tokens)) {
        var functionality = [];
        var newDefiniton = tokens[1];
        for (var i = 2; i <= tokens.length - 2; i++) {
            functionality.push(tokens[i]);
        }
        globalFunctions[newDefiniton] = functionality;
    }
}
readline.on("line", function (input) {
    if (input === "quit") {
        readline.close();
        return;
    }
    inputStream.push(input);
    console.log(inputStream);
    var tokens = convertInputToTokens(inputStream);
    if (tokens[0] === ":" && tokens[tokens.length - 1] === ";") {
        addDefinitons(tokens);
        console.log("Global Functions: ", globalFunctions);
    }
    else {
        var result = evaluate(tokens);
        if (result != null) {
            console.log(result);
        }
    }
    inputStream = [];
});
