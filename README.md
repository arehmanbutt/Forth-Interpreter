## Forth Interpreter – TypeScript Implementation

This is a simple yet extensible interpreter for a subset of the [Forth programming language](https://en.wikipedia.org/wiki/Forth_%28programming_language%29) built in **TypeScript**. It supports arithmetic operations, stack manipulation, and user-defined words.

> 📚 This project is built as part of the [CarbonTeq DevPortal – Build Your Own X](https://dev-portal.carbonteq.com/build-your-own-x/general/forth_interpreter) series.

---

### Features

- ✅ Arithmetic operations: `+`, `-`, `*`, `/`
- ✅ Stack manipulation: `dup`, `drop`, `swap`, `over`
- ✅ Word definitions: `: square dup * ;`
- ✅ Modular design with command registry for easy extensibility (OCP)
- ✅ Syntax validation and helpful error messages

---

### 🛠️ Setup

1. **Clone the repo** (or create a new `.ts` file with the provided code):

   ```bash
   git clone https://github.com/arehmanbutt/Forth-Interpreter
   cd forth-interpreter
   ```

2. **Install dependencies** (if using TypeScript compiler):

   ```bash
   npm init -y
   npm install typescript @types/node --save-dev
   npm install tsx
   ```

3. **Create `tsconfig.json`** (if needed):

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true
     }
   }
   ```

4. **Run the interpreter**:

   ```bash
   tsx forth.ts
   ```

---

### 🚀 Example Usage

```forth
> 2 3 +
5

> 4 dup *
16

> : square dup * ;
Defined new word: 'square'

> : quad square square ;
Defined new word: 'quad'

> 5 square
25

> 2 quad
16

> 1 2 swap
2 1

> 1 drop
(empty output)
```

---

### 📦 Supported Words

| Word            | Description                               |
| --------------- | ----------------------------------------- |
| `+`             | Add top two numbers                       |
| `-`             | Subtract top from second                  |
| `*`             | Multiply top two numbers                  |
| `/`             | Divide second by top                      |
| `dup`           | Duplicate the top value                   |
| `drop`          | Remove the top value                      |
| `swap`          | Swap the top two values                   |
| `over`          | Push a copy of the second item to the top |
| `: name body ;` | Define new word (e.g. `: square dup * ;`) |

---

### ⚙️ Open-Closed Principle Design

The stack operations (`dup`, `drop`, `swap`, `over`) are registered in a centralized object:

```ts
const StackOperations: {
  [key: string]: {
    validate: (stack: Stack) => boolean;
    execute: (stack: Stack) => void;
  };
};
```

This makes it easy to add new operations like `rot`, `nip`, or `pick` without touching the parser or evaluator logic.

---

### 🧪 Sample Tests

You can try:

```forth
> : double 2 * ;
> 5 double
10

> 3 4 over +
7 3
```

---

### 🧠 Learning Outcome

- Understand how interpreters work.
- Learn how to tokenize, parse, and evaluate expressions.
- Implement software design principles like **Open-Closed Principle** and **Single Responsibility Principle**.
- Get hands-on with TypeScript’s types and function signatures.

---

### 📁 File Structure

```
forth.ts          # Main interpreter file
README.md         # You're reading it!
```

---

### 🤝 Contribution

Feel free to fork this and add support for further features in Forth Programming Language:

### 📚 Resources

- [CarbonTeq DevPortal – Forth Interpreter](http://dev-portal.carbonteq.com/build-your-own-x/general/forth_interpreter)
- [Forth Programming Language Wiki](https://en.wikipedia.org/wiki/Forth_%28programming_language%29)

---

### 🧑‍💻 Author

**Abdul Rehman**
Software Engineering Intern at CarbonTeq
