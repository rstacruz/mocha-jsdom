> _Deprecation notice:_
> Consider [jsdom-global](https://github.com/rstacruz/jsdom-global) instead, a simpler alternative that also works outside of Mocha. `mocha-jsdom` still works, but `jsdom-global` is better supported.

---

# mocha-jsdom

> Test frontend libraries in the console using Node.js, [mocha] and [jsdom]. 

[![Status](https://travis-ci.org/rstacruz/mocha-jsdom.svg?branch=master)](https://travis-ci.org/rstacruz/mocha-jsdom "See test builds")

<br>

## Usage

```sh
$ npm i --save-dev mocha-jsdom
```

[![npm version](http://img.shields.io/npm/v/mocha-jsdom.svg?style=flat)](https://npmjs.org/package/mocha-jsdom "View this project on npm")

Use `jsdom()` inside your `describe(...)` block (or the global context). It will 
turn your Node.js environment into a mock browser environment supporting the 
full DOM and browser API. The variables `window`, `document`, `history` (and so 
on) will then be available for use.

```js
var jsdom = require('mocha-jsdom')
var expect = require('chai').expect

describe('mocha tests', function () {

  jsdom()

  it('has document', function () {
    var div = document.createElement('div')
    expect(div.nodeName).eql('DIV')
  })

})
```

See [examples/basic](examples/basic) for an example of a basic setup.

<br>

## Upgrading to v2.0.0

If you are coming from mocha-jsdom v1.x, remove `jsdom` if you're not using it before upgrading. `jsdom` is now a direct dependency of `mocha-jsdom`.

```bash
# using Yarn
yarn remove jsdom
yarn upgrade mocha-jsdom
```

```bash
# using npm
npm uninstall -S -D jsdom
npm upgrade mocha-jsdom
```

<br>

## Node and io.js information

As of jsdom 4.0.0, [jsdom now requires io.js](https://github.com/tmpvar/jsdom/blob/master/Changelog.md#400) and will not work with Node.js 0.12 or below.

<br>

## How it works

mocha-jsdom is a simple glue to integrate [jsdom] to mocha.

Invoking `jsdom()` will inject `before` and `after` handlers to the current 
mocha suite which will setup and teardown jsdom. Here's what it does:

* __Window__: `global.window` will be available as the jsdom.

* __Globals__: global variables like `document` and `history` are propagated, 
  and they're cleaned up after tests run.

* __Error handling__: jsdom errors are sanitized so that their stack traces are 
shortened.

__NB:__ Before you try this library, learn about jsdom first. In fact, you may be 
able to integrate jsdom into your tests *without* this library; this is mostly 
syntactic sugar and reasonable defaults.

<br>

## Using with a library

Perfect for testing small DOM-consuming utilities in the console. See 
[test/jquery.js](test/jquery.js) for an example.

```js
describe('mocha tests', function () {

  var $
  jsdom()

  before(function () {
    $ = require('jquery')
  })

  it('works', function () {
    document.body.innerHTML = '<div>hola</div>'
    expect($("div").html()).eql('hola')
  })

})
```

See [examples/basic](examples/basic) for an example of a basic setup.

<br>

## Using with a library, alternate

You can also pass the source code via `src`:

```js
describe('mocha tests', function () {
  jsdom({
    src: fs.readFileSync('jquery.js', 'utf-8')
  })

  ...
})
```

<br>

## Configuration

You can pass jsdom options:

```js
describe('mocha tests', function () {
  jsdom({
    parsingMode: 'xml'
  })

  ...
})
```

<br>

## Working with mocha --watch

When using with `--watch`, you my encounter strange errors from 3rd-party
libraries like jQuery not working properly.

In these cases, use `require('mocha-jsdom').rerequire` instead of `require()`.
This will ensure that the `require()` call will always happen.

```js
var $
var jsdom = require('mocha-jsdom')
var rerequire = jsdom.rerequire

jsdom()

before(function () {
  $ = rerequire('jquery')
})
```

<br>

## Special config

Other mocha-jsdom specific options:

 * `globalize` - propagates to values in `window` to `global`. defaults to true.

 * `console` - allows you to use `console.log` inside a jsdom script. defaults 
 to true.

 * `useEach` - bind to Mocha's `beforeEach`/`afterEach` rather than `before`/`after`.
 defaults to false.

 * `skipWindowCheck` - skips checking of `window` at startup. When false,
 mocha-jsdom will throw an error if `window` already exists. Defaults to false.

[jsdom]: https://www.npmjs.org/package/jsdom
[mocha]: https://www.npmjs.com/package/mocha

<br>

## Testling support

Yes, fully compatible with testling. A test suite using jsdom should be able to use testling.

See [examples/basic](examples/basic/) for a setup that allows for testing via iojs (jsdom), testling, and mocha via the browser.

<br>

## Thanks

> **mocha-jsdom** © 2014-2018 Rico Sta. Cruz. Released under the [MIT] License.<br>
> Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

[![](https://img.shields.io/github/followers/rstacruz.svg?style=social&label=@rstacruz)](https://github.com/rstacruz)
&nbsp;&nbsp;
[![](https://img.shields.io/twitter/follow/rstacruz.svg?style=social&label=@rstacruz)](https://twitter.com/rstacruz)
&nbsp;&nbsp;
**[ricostacruz.com](http://ricostacruz.com)**

[mit]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/mocha-jsdom/contributors
