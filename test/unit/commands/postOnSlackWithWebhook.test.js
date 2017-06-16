/* eslint unused:0 */

const chai = require('chai')
const expect = chai.expect

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/commands/postOnSlackWithWebhookCommand').Service

app.get = (name) => {
  return {
    webhook: 'http://'
  }
}
app.use('command/postOnSlackWithWebhook', new Service())

describe('[unit] command postOnSlackWithWebhook', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because bad uri', (done) => {
    app.service('command/postOnSlackWithWebhook').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error.toString()).equal('RequestError: Error: Invalid URI "http:///"')
      done()
    })
  })
})
