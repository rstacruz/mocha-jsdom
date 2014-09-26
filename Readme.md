# mocha-jsdom

simple [jsdom] integration with mocha.

Just use this inside your `describe()` block (or the global context). it will 
make `window`, `document`, `history` (and so on) available, essentially making 
your current node context feel like a browser.

```js
var jsdom = require('mocha-jsdom');

describe('mocha tests', function () {

  jsdom();

  it('works', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('div'):
  });

});
```

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

Other mocha-jsdom specific options:

 * `globalize` - propagates to values in `window` to `global`. defaults to true.

 * `console` - allows you to use `console.log` inside a jsdom script. defaults 
 to true.

[jsdom]: https://www.npmjs.org/package/jsdom
