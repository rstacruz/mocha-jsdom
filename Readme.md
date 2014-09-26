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

## Special config

Other mocha-jsdom specific options:

 * `globalize` - propagates to values in `window` to `global`. defaults to true.

 * `console` - allows you to use `console.log` inside a jsdom script. defaults 
 to true.

[jsdom]: https://www.npmjs.org/package/jsdom
