# mocha-jsdom

simple jsdom integration with mocha.

just require it inside your `describe()` block (or the global context). it will 
make `window`, `document`, `history` (and so on) available, essentially making 
your current node context feel like a browser.

```js
describe('mocha tests', function () {

  require('mocha-jsdom')();

  it('works', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('div'):
  });

});
```
