const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});
console.log("Welcome to Forth\n\nTo close the program type 'quit'\n\n");
readline.prompt();

let inputStream: string[] = [];

function convertInputToTokens(input: string[]) {
  let tokens = input.toString();
  let stack = tokens.split(" ");
  return stack;
}

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

function handleArithmetic(arr: string[]) {
  let stack: (string | number)[] = [];

  for (let val of arr) {
    if (val in mathFunctions) {
      let second = stack.pop();
      let first = stack.pop();
      if (
        (typeof first === "string" && isNaN(Number(first))) ||
        (typeof second === "string" && isNaN(Number(second)))
      ) {
        console.log("Invalid expression: not enough numeric operands.");
        return;
      }
      const num1 = Number(first);
      const num2 = Number(second);
      let result = mathFunctions[val](num1, num2);
      stack.push(result.toString());
    } else {
      stack.push(val);
    }
  }

  return stack.map(String);
}

readline.on("line", (input: string) => {
  if (input === "quit") {
    readline.close();
    return;
  }
  if (input === "clear") {
    inputStream = [];
  } else {
    inputStream.push(input);
    let stack = convertInputToTokens(inputStream);
    console.log("Stack is: ", stack);
    let result = handleArithmetic(stack);
    console.log("result is: ", result);
    if (result != null) {
      console.log(result.join(" "));
    }
    inputStream = [];
  }
});
