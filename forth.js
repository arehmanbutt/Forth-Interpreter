var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
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
// Dictionary for word definitions
var wordDefinitions = {};
function isWordDefinition(tokens) {
  return tokens[0] === ":" && tokens[tokens.length - 1] === ";";
}
function isWordDefinitionCorrect(tokens) {
  var word = tokens[1];
  var body = tokens.slice(2, -1);
  if (!isLengthCorrect(body, 1)) {
    console.log("Invalid definition: Format: : name body ;");
    return false;
  } else if (word in wordDefinitions) {
    console.log("This word definition already exists");
    return false;
  } else {
    for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {
      var ch = word_1[_i];
      if (ch < "a" || ch > "z") {
        console.log(
          "Invalid word name: must contain only lowercase letters (a-z)"
        );
        return false;
      }
    }
  }
  return true;
}
function addDefinition(tokens) {
  var word = tokens[1];
  var body = tokens.slice(2, -1);
  wordDefinitions[word] = body;
}
var StackOperations = {
  dup: {
    validate: function (stack) {
      return isLengthCorrect(stack, 1);
    },
    execute: function (stack) {
      var top = stack[stack.length - 1];
      if (top !== undefined) {
        stack.push(top);
      }
    },
  },
  swap: {
    validate: function (stack) {
      return isLengthCorrect(stack, 2);
    },
    execute: function (stack) {
      var second = stack.pop();
      var first = stack.pop();
      if (first !== undefined && second !== undefined) {
        stack.push(second, first);
      }
    },
  },
  drop: {
    validate: function (stack) {
      return isLengthCorrect(stack, 1);
    },
    execute: function (stack) {
      stack.pop();
    },
  },
  over: {
    validate: function (stack) {
      return isLengthCorrect(stack, 2);
    },
    execute: function (stack) {
      var secondLast = stack[stack.length - 2];
      if (secondLast !== undefined) {
        stack.push(secondLast);
      }
    },
  },
};
function isLengthCorrect(stack, size) {
  if (stack.length < size) {
    console.log("This operation needs ".concat(size, " operands"));
    return false;
  }
  return true;
}
// Lexer: convertInputToTokens
// function lexer(input: string) {
//   let tokens = input.trim();
//   let stack = tokens.split(" ");
//   return stack;
// }
function lexer(input) {
  var trimmed = input.trim();
  if (trimmed === "") return []; // ✅ fix for truly empty input
  return trimmed.split(/\s+/);
}
// Parser: isSyntaxOkay
function parser(tokens) {
  var stack = [];
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (
      !isNaN(Number(token)) ||
      (!(token in StackOperations) && !(token in mathFunctions))
    ) {
      stack.push(token);
    } else if (token in mathFunctions && isLengthCorrect(stack, 2)) {
      var b = stack.pop();
      var a = stack.pop();
      if (
        b === undefined ||
        a === undefined ||
        isNaN(Number(a)) ||
        isNaN(Number(b))
      ) {
        console.log(
          "Type error: '".concat(token, "' needs two numeric operands")
        );
        return false;
      }
      stack.push("0");
    } else if (
      token in StackOperations &&
      StackOperations[token].validate(stack)
    ) {
      StackOperations[token].execute(stack);
    } else {
      console.log("Unknown word: '".concat(token, "'"));
      return false;
    }
  }
  return true;
}
// Evaluator
function evaluator(tokens) {
  var stack = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (
      !isNaN(Number(token)) &&
      !(token in StackOperations) &&
      !(token in mathFunctions) &&
      !(token in wordDefinitions)
    ) {
      stack.push(token);
    } else if (token in mathFunctions) {
      var second = Number(stack.pop());
      var first = Number(stack.pop());
      var result = mathFunctions[token](first, second).toString();
      stack.push(result);
    } else if (token in StackOperations) {
      if (StackOperations[token].validate(stack)) {
        StackOperations[token].execute(stack);
      } else {
        return "Logical Errror";
      }
    } else if (token in wordDefinitions) {
      var definitionTokens = wordDefinitions[token];
      if (definitionTokens) {
        tokens.splice.apply(
          tokens,
          __spreadArray([i, 1], definitionTokens, false)
        );
        i--;
      }
    } else {
      stack.push(token);
    }
  }
  return stack.join(" ");
}

if (require.main === module) {
  rl.on("line", function (input) {
    if (input === "quit") {
      rl.close();
      return;
    }
    var tokens = lexer(input);
    if (isWordDefinition(tokens)) {
      if (isWordDefinitionCorrect(tokens)) {
        addDefinition(tokens);
        console.log("Defined new word: '".concat(tokens[1], "'"));
      }
    } else if (parser(tokens)) {
      var result = evaluator(tokens);
      console.log(result);
    } else {
      console.log("Syntax check failed. Expression not evaluated.");
    }
    rl.prompt();
  });
}

module.exports = {
  lexer,
  parser,
  evaluator,
  isWordDefinition,
  isWordDefinitionCorrect,
  addDefinition,
  wordDefinitions,
  runForthLine, // ✅ include this too
};

function runForthLine(input) {
  const tokens = lexer(input);
  if (isWordDefinition(tokens)) {
    if (isWordDefinitionCorrect(tokens)) {
      addDefinition(tokens);
      return `Defined: ${tokens[1]}`;
    } else {
      return "Invalid word definition.";
    }
  } else if (parser(tokens)) {
    return evaluator(tokens);
  } else {
    return "Syntax error";
  }
}
