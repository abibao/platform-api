const standard = require('mocha-standard')

describe('[standard] code', function () {
  it('should be conforms to standard', standard.files([
    'config/*.js', 'server/**/*.js', 'test/**/*.js'
  ]))
})
