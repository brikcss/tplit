# Tplit

A simple, small, fast, all-purpose templating engine using the power and flexibility of native JavaScript template literals.

---

## Environment and browser support

| Node | ES Module | Browser | UMD | CLI |
| :--: | :-------: | :-----: | :-: | :-: |
|  ✓   |     ✓     |    x    |  ✓  |  x  |

## Install

```sh
npm i -D @brikcss/tplit
```

## Usage

There are two ways to use tplit, each has their pros and cons:

1. Pass a string (most flexible):

   ```js
   import tplit from "@brikcss/tplit";
   // Syntax: tplit(template = '', options = {})(context = {})
   tplit("Hello ${this.name}")({ name: "World" });
   // console.log(compiled) => 'Hello World'
   ```

2. Call with template literal function (least flexible but allows outside context):

   ```js
   import { tplitReduce } from "@brikcss/tplit";
   const name = "World";
   // Syntax: tplitReduce((map = arg => arg))`Hello ${name}`;
   const compiled = tplitReduce(
     (map = arg => arg.toUpperCase())
   )`Hello ${name}`;
   // console.log(compiled) => 'Hello WORLD'
   ```

## Options

- `prop` {`String`} (`this`): Property to use for context Object. _Note: Not available when calling tplit as a template literal._
- `split` {`Boolean`} (`false`): Whether to split the template and return an Array of `[chunks, ...values]`. This would allow you to further manipulate the template as desired. _Note: Not available when calling tplit as a template literal._
- `map` {`Function`} (`(value, key, context) => value`): Function to manipulate template values. This would allow you to, for example, sanitize HTML or otherwise manipulate context values.

## Examples

For examples, see the [tests](tplit.test.js).
