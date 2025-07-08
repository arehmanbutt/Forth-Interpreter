const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});
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
  return stack;
}

// Evaluation

function evaluate(tokens: string[]) {
  let stack: (string | number)[] = [];

  for (let token of tokens) {
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
    } else {
      stack.push(token);
    }
  }
  return stack.join(" ");
}

readline.on("line", (input: string) => {
  if (input === "quit") {
    readline.close();
    return;
  }

  inputStream.push(input);
  let tokens = convertInputToTokens(inputStream);

  let result = evaluate(tokens);
  if (result != null) {
    console.log(result);
  }

  inputStream = [];
});
