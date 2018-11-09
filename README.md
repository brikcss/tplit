# Tplit

A simple, small, fast, all-purpose templating engine using the power and flexibility of native JavaScript template literals.

<!-- Shields. -->
<p>
    <!-- NPM version. -->
    <a href="https://www.npmjs.com/package/@brikcss/tplit"><img alt="NPM version" src="https://img.shields.io/npm/v/@brikcss/tplit.svg?style=flat-square"></a>
    <!-- NPM downloads/month. -->
    <a href="https://www.npmjs.com/package/@brikcss/tplit"><img alt="NPM downloads per month" src="https://img.shields.io/npm/dm/@brikcss/tplit.svg?style=flat-square"></a>
    <!-- Travis branch. -->
    <a href="https://github.com/brikcss/tplit/tree/master"><img alt="Travis branch" src="https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master"></a>
    <!-- Codacy. -->
    <a href="https://www.codacy.com/app/thezimmee/tplit"><img alt="NPM version" src="https://img.shields.io/codacy/grade/ac90d04f29fb42b0840ef2a5d199bcfa/master.svg?style=flat-square"></a>
    <!-- Coveralls -->
    <a href='https://coveralls.io/github/brikcss/tplit?branch=master'><img src='https://img.shields.io/coveralls/github/brikcss/tplit/master.svg?style=flat-square' alt='Coverage Status' /></a>
    <!-- JS Standard style. -->
    <a href="https://standardjs.com"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square"></a>
    <!-- Prettier code style. -->
    <a href="https://prettier.io/"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a>
    <!-- Semantic release. -->
    <a href="https://github.com/semantic-release/semantic-release"><img alt="semantic release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square"></a>
    <!-- Commitizen friendly. -->
    <a href="http://commitizen.github.io/cz-cli/"><img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square"></a>
    <!-- MIT License. -->
    <a href="https://choosealicense.com/licenses/mit/"><img alt="License" src="https://img.shields.io/npm/l/express.svg?style=flat-square"></a>
</p>

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

1. Pass a string with `tplit()`:

   _Pros_: Most flexible, most configuration options.<br>
   _Cons_: Can not use outside scope / context (though you can pass your own context data object).

   _Syntax_:

   ```js
   tplit((template = ""), (options = {}))((context = {}));
   ```

   _Example_:

   ```js
   import tplit from "@brikcss/tplit";
   const compiled = tplit("Hello ${this.name}")({ name: "World" });
   const compiledWithOptions = tplit("Hello ${this.name}", {
     prop: "props",
     map: value => value.toUpperCase()
   })({ name: "World" });
   // console.log(compiled) => 'Hello World'
   // console.log(compiledWithOptions) => 'Hello WORLD'
   ```

2. Call with template literal function with `tplitReduce()`:

   _Pros_: Can use outside scope / context.<br>
   _Cons_: Fewer configuration options.

   _Syntax_:

   ```js
   tplitReduce((map = arg => arg))`My template string`;
   ```

   _Example_:

   ```js
   import { tplitReduce } from "@brikcss/tplit";
   const name = "World";
   const compiled = tplitReduce(
     (map = arg => arg.toUpperCase())
   )`Hello ${name}`;
   // console.log(compiled) => 'Hello WORLD'
   ```

## Options

- `prop` {`String`} (`this`): Property to use for context Object. _Note: Not available with default `tplit()` method._
- `split` {`Boolean`} (`false`): Set true to split the template and return an Array of `[chunks, ...values]`. This would allow you to pass to other functions and further manipulate the template as desired. _Note: Not available with default `tplit()` method._
- `map` {`Function`} (`(value, key, context) => value`): Function to manipulate template values. This would allow you to, for example, sanitize HTML or otherwise manipulate context values.

## Examples

For more examples, see the [tests](./src/tplit.test.js).

<!-- ## References

- https://github.com/drulac/template-literal
- https://github.com/tunnckoCore/gana-compile
- https://github.com/tunnckoCore/es6-template
- https://github.com/bredele/intertag
- https://github.com/bredele/tag-reduce
- https://github.com/steelbrain/tagged-template-literals -->
