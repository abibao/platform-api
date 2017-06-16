/* jshint unused:false */

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/commands/campaignCreateEmailingCommand').Service

app.use('command/campaignCreateEmailing', new Service())
app.use('api/individuals', {
  find (params) {
    if (params.query.email === 'test@abibao.com') {
      return Promise.resolve([{email: params.query.email, urn: 'urn:individual:test'}])
    } else {
      return Promise.resolve([])
    }
  }
})

describe('[unit] command campaignCreateEmailing', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because email is mandatory', (done) => {
    app.service('command/campaignCreateEmailing').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_EMAIL_MANDATORY')
      done()
    })
  })
  it('should fail because template is mandatory', (done) => {
    app.service('command/campaignCreateEmailing').create({email: 'not@abibao.com'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_TEMPLATE_MANDATORY')
      done()
    })
  })
  it('should fail because template is mandatory', (done) => {
    app.service('command/campaignCreateEmailing').create({email: 'not@abibao.com', template: 'template'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_URL_MANDATORY')
      done()
    })
  })
  it('should fail because email is not in database', (done) => {
    app.service('command/campaignCreateEmailing').create({email: 'not@abibao.com', template: 'template', url: 'http://test.abibao.com'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_INDIVIDUAL_NOT_FOUND')
      done()
    })
  })
  it('should success', (done) => {
    app.service('command/campaignCreateEmailing').create({email: 'test@abibao.com', template: 'template', url: 'http://test.abibao.com'}).then((result) => {
      expect(result).equal(true)
      done()
    }).catch(done)
  })
})
