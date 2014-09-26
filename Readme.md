# mocha-jsdom

Simple [jsdom] integration with mocha.

NB: before you try this library, learn about jsdom first. In fact, you may be 
able to integrate jsdom into your tests *without* this library; this is mostly 
syntactic sugar and reasonable defaults.

## How to use

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

## Configuration

You can pass jsdom options:

```js
var jsdom = require('mocha-jsdom');

describe('mocha tests', function () {
  jsdom({
    src: fs.readFileSync('jquery.js', 'utf-8'),
    parsingMode: 'xml'
  });

  ...
});
```

## Special config

Other mocha-jsdom specific options:

 * `globalize` - propagates to values in `window` to `global`. defaults to true.

 * `console` - allows you to use `console.log` inside a jsdom script. defaults 
 to true.

[jsdom]: https://www.npmjs.org/package/jsdom
