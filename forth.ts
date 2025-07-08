const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});
let wordDefinitions: { [key: string]: string[] } = {};

console.log("Welcome to Forth\n\nTo close the program type 'quit'\n\n");
readline.prompt();
let inputStream: string[] = [];

const mathFunctions = {
  "+": function (x: number, y: number) {
    return x + y;
  },
  "-": function (x: number, y: number) {
    return x - y;
  },
  "*": function (x: number, y: number) {
    return x * y;
  },
  "/": (x: number, y: number) => {
    return x / y;
  },
};

function convertInputToTokens(input: string[]) {
  let tokens = input.toString().trim();
  let stack = tokens.split(" ");
  // console.log("After tokenisation", stack);
  return stack;
}

// Evaluation

function evaluate(tokens: string[]) {
  let stack: (string | number)[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else if (token in mathFunctions) {
      let b = stack.pop();
      let a = stack.pop();
      if (typeof a !== "number" || typeof b !== "number") {
        console.log("Invalid expression: not enough numeric operands.");
        return;
      }
      let result = mathFunctions[token](a, b);
      stack.push(result);
    } else if (token === "dup") {
      let top = stack[stack.length - 1];
      if (typeof top !== "number") {
        console.log("Cannot dup non-number.");
        return;
      }
      stack.push(top);
    } else if (token === "swap") {
      let b = stack.pop();
      let a = stack.pop();
      if (a === undefined || b === undefined) {
        console.log("swap needs two elements.");
        return;
      }
      stack.push(b, a);
    } else if (token === "drop") {
      stack.pop();
    } else if (token === "over") {
      let secondLast = stack[stack.length - 2];
      if (secondLast === undefined) {
        console.log("swap needs two elements.");
        return;
      }
      stack.push(secondLast);
    } else if (token in wordDefinitions) {
      const definitionTokens = wordDefinitions[token];
      if (definitionTokens) {
        tokens.splice(i, 1, ...definitionTokens);
        i--;
      }
    } else {
      stack.push(token);
    }
  }
  return stack.join(" ");
}

function isSyntaxCorrect(tokens: string[]) {
  // check proper syntax
  let flag: boolean = true;
  if (tokens[0] == ":" && tokens[tokens.length - 1] === ";") {
    console.log("This is a word definition");
  } else {
    console.log("This is not a correct word definiton");
    console.log(`The correct format is <: word-definition functionality ;>`);
    flag = false;
  }
  return flag;
}
function addDefinitons(tokens: string[]) {
  if (isSyntaxCorrect(tokens)) {
    let functionality: string[] = [];
    let newDefiniton = tokens[1];
    for (let i = 2; i <= tokens.length - 2; i++) {
      functionality.push(tokens[i]);
    }
    wordDefinitions[newDefiniton] = functionality;
  }
}

readline.on("line", (input: string) => {
  if (input === "quit") {
    readline.close();
    return;
  }

  inputStream.push(input);
  let tokens = convertInputToTokens(inputStream);
  if (tokens[0] === ":" && tokens[tokens.length - 1] === ";") {
    addDefinitons(tokens);
    console.log("Global Functions: ", wordDefinitions);
  } else {
    let result = evaluate(tokens);
    if (result != null) {
      console.log(result);
    }
  }

  inputStream = [];
});
