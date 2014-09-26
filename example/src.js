/* jshint expr: true */
var expect = require('chai').expect;
var jsdom = require('../index');

describe('src', function () {

  jsdom({
    src: "(function () { throw new Error('ffff'); })()"
  });

  it('fails', function () {
    expect(global.document).be.undefined;
  });

});
