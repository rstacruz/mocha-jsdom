# mocha-jsdom

Simple [jsdom] integration with mocha.

NB: before you try this library, learn about jsdom first. In fact, you may be 
able to integrate jsdom into your tests *without* this library; this is mostly 
syntactic sugar and reasonable defaults.

[![Status](http://img.shields.io/travis/rstacruz/mocha-jsdom/master.svg?style=flat)](https://travis-ci.org/rstacruz/mocha-jsdom "See test builds")

<br>

## How to use

```sh
$ npm i --save-dev mocha-jsdom
```

[![npm version](http://img.shields.io/npm/v/mocha-jsdom.svg?style=flat)](https://npmjs.org/package/mocha-jsdom "View this project on npm")

Just use `jsdom()` inside your `describe(...)` block (or the global context). it 
will make `window`, `document`, `history` (and so on) available, essentially 
making your current node context feel like a browser.

```js
var jsdom = require('mocha-jsdom');

describe('mocha tests', function () {

  jsdom();

  it('has document', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('div'):
  });

});
```

<br>

## Using with a library

Load your library. See [test/jquery.js](test/jquery.js) for an example.

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

Pass it via `src`:

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

<br>

## Thanks

**mocha-jsdom** © 2014+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/nprogress/contributors
