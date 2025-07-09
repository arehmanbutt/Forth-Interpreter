const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log("Welcome to Forth\n\nTo close the program type 'quit'\n\n");
rl.prompt();

const mathFunctions: { [key: string]: (x: number, y: number) => number } = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};

// Global dictionary for word definitions
let wordDefinitions: { [key: string]: string[] } = {};

function isWordDefinition(tokens: string[]): boolean {
  return tokens[0] === ":" && tokens[tokens.length - 1] === ";";
}
function isWordDefinitionCorrect(tokens: string[]): boolean {
  if (tokens.length < 2) {
    console.log("Invalid definition: too short. Format: : name body ;");
    return false;
  } else {
    return true;
  }
}

function addDefinition(tokens: string[]): void {
  const word = tokens[1];
  const body = tokens.slice(2, -1);
  wordDefinitions[word] = body;
}

function convertInputToTokens(input: string) {
  let tokens = input.trim();
  let stack = tokens.split(" ");
  return stack;
}

function isSyntaxOkay(tokens: string[]): boolean {
  const stack: string[] = [];
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(token);
    } else if (token in mathFunctions) {
      if (stack.length < 2) {
        console.log(`Syntax error: '${token}' needs two operands`);
        return false;
      }
      const b = stack.pop();
      const a = stack.pop();
      if (
        b === undefined ||
        a === undefined ||
        isNaN(Number(a)) ||
        isNaN(Number(b))
      ) {
        console.log(`Type error: '${token}' needs two numeric operands`);
        return false;
      }
      stack.push("0");
    } else if (token === "dup") {
      const top = stack[stack.length - 1];
      if (top === undefined) {
        console.log(`Syntax error: 'dup' needs one item`);
        return false;
      }
      stack.push(top);
    } else if (token === "swap") {
      if (stack.length < 2) {
        console.log(`Syntax error: 'swap' needs two items`);
        return false;
      }
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return false;
      stack.push(b, a);
    } else if (token === "drop") {
      if (stack.length < 1) {
        console.log(`Syntax error: 'drop' needs one item`);
        return false;
      }
      stack.pop();
    } else if (token === "over") {
      if (stack.length < 2) {
        console.log(`Syntax error: 'over' needs two items`);
        return false;
      }
      const secondLast = stack[stack.length - 2];
      if (secondLast === undefined) return false;
      stack.push(secondLast);
    } else {
      console.log(`Unknown word: '${token}'`);
      return false;
    }
  }

  return true;
}
function evaluate(tokens: string[]): string {
  const stack: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!isNaN(Number(token))) {
      stack.push(token);
    } else if (token in mathFunctions) {
      const second = stack.pop();
      const first = stack.pop();

      if (first === undefined || second === undefined) continue;

      const a = Number(first);
      const b = Number(second);
      const result = mathFunctions[token](a, b);
      stack.push(result.toString());
    } else if (token === "dup") {
      const top = stack[stack.length - 1];
      if (top !== undefined) stack.push(top);
    } else if (token === "swap") {
      const second = stack.pop();
      const first = stack.pop();
      if (first !== undefined && second !== undefined) {
        stack.push(second, first);
      }
    } else if (token === "drop") {
      stack.pop();
    } else if (token === "over") {
      const secondLast = stack[stack.length - 2];
      if (secondLast !== undefined) stack.push(secondLast);
    } else if (token in wordDefinitions) {
      const definitionTokens = wordDefinitions[token];
      if (definitionTokens) {
        tokens.splice(i, 1, ...definitionTokens);
        i--;
      }
    } else {
      stack.push(token); // push literal or unknown token
    }
  }

  return stack.join(" ");
}

rl.on("line", (input: string) => {
  if (input === "quit") {
    rl.close();
    return;
  }
  const tokens = convertInputToTokens(input);
  if (isWordDefinition(tokens)) {
    const word = tokens[1];
    const body = tokens.slice(2, -1);
    console.log("Body is: ", body);
    if (isWordDefinitionCorrect(tokens)) {
      addDefinition(tokens);
      console.log(`Defined new word: '${word}'`);
    } else {
      console.log("Invalid word definition. Format: : name body ;");
    }
  } else if (isSyntaxOkay(tokens)) {
    const result = evaluate(tokens);
    console.log(result);
  } else {
    console.log("Syntax check failed. Expression not evaluated.");
  }

  rl.prompt();
});
