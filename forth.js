var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
});
console.log("\nWelcome to Forth\n\nTo close the program type 'quit'\n\n");
rl.prompt();
var mathFunctions = {
    "+": function (x, y) { return x + y; },
    "-": function (x, y) { return x - y; },
    "*": function (x, y) { return x * y; },
    "/": function (x, y) { return x / y; },
};
// Global dictionary for word definitions
var wordDefinitions = {};
function isWordDefinition(tokens) {
    return tokens[0] === ":" && tokens[tokens.length - 1] === ";";
}
function isWordDefinitionCorrect(body) {
    if (body.length < 2) {
        console.log("Invalid definition: Format: : name body ;");
        return false;
    }
    else {
        return true;
    }
}
function addDefinition(tokens) {
    var word = tokens[1];
    var body = tokens.slice(2, -1);
    wordDefinitions[word] = body;
}
function convertInputToTokens(input) {
    var tokens = input.trim();
    var stack = tokens.split(" ");
    return stack;
}
function isSyntaxOkay(tokens) {
    var stack = [];
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (!isNaN(Number(token))) {
            stack.push(token);
        }
        else if (token != "swap" &&
            token != "dup" &&
            token != "over" &&
            token != "drop" &&
            !(token in mathFunctions)) {
            stack.push(token);
        }
        else if (token in mathFunctions) {
            if (stack.length < 2) {
                console.log("Syntax error: '".concat(token, "' needs two operands"));
                return false;
            }
            var b = stack.pop();
            var a = stack.pop();
            if (b === undefined ||
                a === undefined ||
                isNaN(Number(a)) ||
                isNaN(Number(b))) {
                console.log("Type error: '".concat(token, "' needs two numeric operands"));
                return false;
            }
            stack.push("0");
        }
        else if (token === "dup") {
            var top_1 = stack[stack.length - 1];
            if (top_1 === undefined) {
                console.log("Syntax error: 'dup' needs one item");
                return false;
            }
            stack.push(top_1);
        }
        else if (token === "swap") {
            if (stack.length < 2) {
                console.log("Syntax error: 'swap' needs two items");
                return false;
            }
            var b = stack.pop();
            var a = stack.pop();
            if (a === undefined || b === undefined)
                return false;
            stack.push(b, a);
        }
        else if (token === "drop") {
            if (stack.length < 1) {
                console.log("Syntax error: 'drop' needs one item");
                return false;
            }
            stack.pop();
        }
        else if (token === "over") {
            if (stack.length < 2) {
                console.log("Syntax error: 'over' needs two items");
                return false;
            }
            var secondLast = stack[stack.length - 2];
            if (secondLast === undefined)
                return false;
            stack.push(secondLast);
        }
        else {
            console.log("Unknown word: '".concat(token, "'"));
            return false;
        }
    }
    return true;
}
function evaluate(tokens) {
    var stack = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (!isNaN(Number(token))) {
            stack.push(token);
        }
        else if (token != "swap" &&
            token != "dup" &&
            token != "over" &&
            token != "drop" &&
            !(token in mathFunctions)) {
            stack.push(token);
        }
        else if (token in mathFunctions) {
            var second = stack.pop();
            var first = stack.pop();
            if (first === undefined || second === undefined)
                continue;
            var a = Number(first);
            var b = Number(second);
            var result = mathFunctions[token](a, b);
            stack.push(result.toString());
        }
        else if (token === "dup") {
            var top_2 = stack[stack.length - 1];
            if (top_2 !== undefined)
                stack.push(top_2);
        }
        else if (token === "swap") {
            var second = stack.pop();
            var first = stack.pop();
            if (first !== undefined && second !== undefined) {
                stack.push(second, first);
            }
        }
        else if (token === "drop") {
            stack.pop();
        }
        else if (token === "over") {
            var secondLast = stack[stack.length - 2];
            if (secondLast !== undefined)
                stack.push(secondLast);
        }
        else if (token in wordDefinitions) {
            var definitionTokens = wordDefinitions[token];
            if (definitionTokens) {
                tokens.splice.apply(tokens, __spreadArray([i, 1], definitionTokens, false));
                i--;
            }
        }
        else {
            stack.push(token); // push literal or unknown token
        }
    }
    return stack.join(" ");
}
rl.on("line", function (input) {
    if (input === "quit") {
        rl.close();
        return;
    }
    var tokens = convertInputToTokens(input);
    if (isWordDefinition(tokens)) {
        var word = tokens[1];
        var body = tokens.slice(2, -1);
        console.log("Body is: ", body);
        if (isWordDefinitionCorrect(body)) {
            addDefinition(tokens);
            console.log("Defined new word: '".concat(word, "'"));
        }
    }
    else if (isSyntaxOkay(tokens)) {
        var result = evaluate(tokens);
        console.log(result);
    }
    else {
        console.log("Syntax check failed. Expression not evaluated.");
    }
    rl.prompt();
});
