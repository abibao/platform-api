/* eslint unused:false */

const chai = require('chai')
const expect = chai.expect

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/queries/getRemoteConfigurationQuery').Service

app.get = (param) => {
  switch (param) {
    case 'postgres':
      return {
        force: false
      }
    default:
      return {}
  }
}
app.use('query/getRemoteConfiguration', new Service())

describe('[unit] query getRemoteConfiguration', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should success', (done) => {
    app.service('query/getRemoteConfiguration').find({}).then((result) => {
      expect(result).to.have.property('env')
      expect(result).to.have.property('analytics')
      done()
    }).catch(done)
  })
})
