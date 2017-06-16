const feathers = require('feathers')
const chai = require('chai')
const expect = chai.expect

const Service = require('../../../server/services/domain/commands/sendgridRefreshAllTemplatesCommand').Service

const app = feathers()

app.bus = {
  send (chanel, message) { }
}
app.error = (message) => {
}
app.info = (message) => {
}
app.get = (param) => {
  switch (param) {
    case 'sendgrid':
      return {
        key: 'sengrid'
      }
    default:
      return {}
  }
}

app.use('command/sendgridRefreshAllTemplates', new Service())

describe('[unit] command sendgridRefreshAllTemplates', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because sendgrid key not good', (done) => {
    app.service('command/sendgridRefreshAllTemplates').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('name').and.equal('SendGridError')
      done()
    })
  })
})
