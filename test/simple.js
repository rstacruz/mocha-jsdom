var expect = require('chai').expect;

describe('simple', function () {
  require('../index')();

  it('has document', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('DIV');
  });

  it('has history', function () {
    window.history.pushState({}, null, '/a/b/c');
    expect(window.location.href).eql('file:///a/b/c');
  });
});

describe('src', function () {
  require('../index')({
    src: '}}'
  });
});
