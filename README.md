# mocha-jsdom

Test frontend libraries in the console using Node.js, [mocha] and [jsdom].  

[![Status](http://img.shields.io/travis/rstacruz/mocha-jsdom/master.svg?style=flat)](https://travis-ci.org/rstacruz/mocha-jsdom "See test builds")

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
var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

describe('mocha tests', function () {

  jsdom();

  it('has document', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('DIV');
  });

});
```

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

  var $;
  jsdom();

  before(function () {
    $ = require('jquery');
  });

  it('works', function () {
    document.body.innerHTML = "<div>hola</div>";
    expect($("div").html()).eql("hola");
  });

});
```

<br>

## Using with a library, alternate

You can also pass the source code via `src`:

```js
describe('mocha tests', function () {
  jsdom({
    src: fs.readFileSync('jquery.js', 'utf-8')
  })

  ...
});
```

<br>

## Configuration

You can pass jsdom options:

```js
describe('mocha tests', function () {
  jsdom({
    parsingMode: 'xml'
  });

  ...
});
```

<br>

## Special config

Other mocha-jsdom specific options:

 * `globalize` - propagates to values in `window` to `global`. defaults to true.

 * `console` - allows you to use `console.log` inside a jsdom script. defaults 
 to true.

[jsdom]: https://www.npmjs.org/package/jsdom
[mocha]: https://www.npmjs.com/package/mocha

<br>

## Thanks

**mocha-jsdom** © 2014+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/mocha-jsdom/contributors
