const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log("\nWelcome to Forth\n\nTo close the program type 'quit'\n\n");
rl.prompt();

const mathFunctions: { [key: string]: (x: number, y: number) => number } = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
};

// Dictionary for word definitions
let wordDefinitions: { [key: string]: Stack } = {};

function isWordDefinition(tokens: Stack): boolean {
  return tokens[0] === ":" && tokens[tokens.length - 1] === ";";
}
function isWordDefinitionCorrect(tokens: Stack): boolean {
  const word = tokens[1];
  const body = tokens.slice(2, -1);
  if (body.length < 1) {
    console.log("Invalid definition: Format: : name body ;");
    return false;
  } else if (word in wordDefinitions) {
    console.log("This word definition already exists");
    return false;
  } else {
    for (let ch of word) {
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

function addDefinition(tokens: Stack): void {
  const word = tokens[1];
  const body = tokens.slice(2, -1);
  wordDefinitions[word] = body;
}

type Stack = string[];

const StackOperations: {
  [key: string]: {
    validate: (stack: Stack) => boolean;
    execute: (stack: Stack) => void;
  };
} = {
  dup: {
    validate: (stack) => {
      return isLengthCorrect(stack, 1);
    },
    execute: (stack) => {
      const top = stack[stack.length - 1];
      if (top !== undefined) {
        stack.push(top);
      }
    },
  },
  swap: {
    validate: (stack) => {
      return isLengthCorrect(stack, 2);
    },
    execute: (stack) => {
      const second = stack.pop();
      const first = stack.pop();
      if (first !== undefined && second !== undefined) {
        stack.push(second, first);
      }
    },
  },
  drop: {
    validate: (stack) => {
      return isLengthCorrect(stack, 1);
    },
    execute: (stack) => {
      stack.pop();
    },
  },
  over: {
    validate: (stack) => {
      return isLengthCorrect(stack, 2);
    },
    execute: (stack) => {
      const secondLast = stack[stack.length - 2];
      if (secondLast !== undefined) {
        stack.push(secondLast);
      }
    },
  },
};

function isLengthCorrect(stack: Stack, size: number): boolean {
  if (stack.length < size) {
    console.log(`This operation needs ${size} operands`);
    return false;
  }
  return true;
}

// Lexer: convertInputToTokens
function lexer(input: string) {
  let tokens = input.trim();
  let stack = tokens.split(" ");
  return stack;
}
// Parser: isSyntaxOkay
function parser(tokens: Stack): boolean {
  const stack: Stack = [];
  for (const token of tokens) {
    if (
      !isNaN(Number(token)) ||
      (!(token in StackOperations) && !(token in mathFunctions))
    ) {
      stack.push(token);
    } else if (token in mathFunctions && isLengthCorrect(stack, 2)) {
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
    } else if (
      token in StackOperations &&
      StackOperations[token].validate(stack)
    ) {
      StackOperations[token].execute(stack);
    } else {
      console.log(`Unknown word: '${token}'`);
      return false;
    }
  }
  return true;
}

// Evaluator
function evaluator(tokens: Stack): string {
  const stack: Stack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (
      !isNaN(Number(token)) &&
      !(token in StackOperations) &&
      !(token in mathFunctions) &&
      !(token in wordDefinitions)
    ) {
      stack.push(token);
    } else if (token in mathFunctions) {
      const second = Number(stack.pop());
      const first = Number(stack.pop());
      const result = mathFunctions[token](first, second).toString();
      stack.push(result);
    } else if (token in StackOperations) {
      if (StackOperations[token].validate(stack)) {
        StackOperations[token].execute(stack);
      } else {
        return "Logical Errror";
      }
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

rl.on("line", (input: string) => {
  if (input === "quit") {
    rl.close();
    return;
  }
  const tokens = lexer(input);
  if (isWordDefinition(tokens)) {
    if (isWordDefinitionCorrect(tokens)) {
      addDefinition(tokens);
      console.log(`Defined new word: '${tokens[1]}'`);
    }
  } else if (parser(tokens)) {
    const result = evaluator(tokens);
    console.log(result);
  } else {
    console.log("Syntax check failed. Expression not evaluated.");
  }
  rl.prompt();
});
