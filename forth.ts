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
  // console.log("Input", input);
  console.log(tokens);
  let stack = tokens.split(" ");
  // console.log("After splitting", stack);
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
  return stack.join(" ");
}

const wordFunctions = {
  dup: (x: any) => {
    return [x, x];
  },
};

function handleWordsManipulation(arr: string[]) {
  let stack: (string | number)[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "dup") {
      let first = stack.pop();
      if (isNaN(Number(first))) {
        console.log("please enter a vlid number to be duplicated");
        return;
      }
      let result = wordFunctions["dup"](first);
      console.log("the result i am getting", result);
      for (let val of result) {
        stack.push(val);
      }
      console.log("After duplication:", stack);
    } else {
      stack.push(arr[i]);
    }
  }
  return stack.join(" ");
}

readline.on("line", (input: string) => {
  if (input === "quit") {
    readline.close();
    return;
  } else {
    inputStream.push(input);
    let tokens = convertInputToTokens(inputStream);
    let afterWordManipulation = handleWordsManipulation(tokens);
    let finalResult = handleArithmetic(afterWordManipulation.split(" "));

    if (finalResult != null) {
      console.log(finalResult);
    }

    inputStream = [];
  }
});
