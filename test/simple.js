var expect = require('chai').expect;

describe('simple', function () {
  require('../index')();

  it('works', function () {
    var div = document.createElement('div');
    expect(div.nodeName).eql('DIV');
  });
});

describe('src', function () {
  require('../index')({
    src: '}}'
  });
});
