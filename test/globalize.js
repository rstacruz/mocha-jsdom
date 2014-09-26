/* jshint expr: true */
var expect = require('chai').expect;
var jsdom = require('../index');

describe('globalize', function () {

  jsdom({ globalize: false });

  it('does not globalize', function () {
    expect(global.document).be.undefined;
  });

});
