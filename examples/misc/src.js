/* global describe, it, expect */

/*
 * run `mocha src.js` to see this fail.
 */

describe('src', function () {
  require('../../index')({
    src: '}}'
  })

  it('works', function () {
    expect(window.lol()).eql('DIV')
  })
})
