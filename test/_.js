if (process.env.COVERAGE) {
  require('blanket')({
    pattern: require('path').resolve('./index.js')
  })
}
