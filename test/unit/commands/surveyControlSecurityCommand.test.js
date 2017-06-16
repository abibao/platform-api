const feathers = require('feathers')
const chai = require('chai')
const expect = chai.expect
const eraro = require('eraro')({package: 'platform.abibao.com'})

const Service = require('../../../server/services/domain/commands/surveyControlSecurityCommand').Service

const app = feathers()

app.bus = {
  send (chanel, message) {
    console.assert(chanel, message)
  }
}
app.error = (message) => {
  console.assert(message)
}
app.info = (message) => {
  console.assert(message)
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

app.use('command/surveyControlSecurity', new Service())
app.use('api/individuals', {
  create (params) {
    if (params.email === 'test@abibao.com') {
      return Promise.resolve({urn: 'urn:individual:test'})
    } else {
      const error = new Error('ERROR_TEST_UNIT')
      return Promise.reject(eraro(error))
    }
  },
  find (params) {
    return Promise.resolve([])
  }
})
app.use('api/campaigns', {
  find (params) {
    return Promise.resolve([{urn: 'urn:campaign:test'}])
  }
})

describe('[unit] command surveyControlSecurity', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because email is mandatory', (done) => {
    app.service('command/surveyControlSecurity').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_EMAIL_MANDATORY')
      done()
    })
  })
  it('should fail because email is mandatory', (done) => {
    app.service('command/surveyControlSecurity').create({email: 'nope@abibao.com'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_CAMPAIGN_MANDATORY')
      done()
    })
  })
  it('should fail because an error occured', (done) => {
    app.service('command/surveyControlSecurity').create({email: 'nope@abibao.com', campaign: 'campaign'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_TEST_UNIT')
      done()
    })
  })
  it('should sucesss with email not in database', (done) => {
    app.service('command/surveyControlSecurity').create({email: 'test@abibao.com', campaign: 'campaign'}).then((result) => {
      expect(result).to.have.property('connected').and.equal(false)
      expect(result).to.have.property('urn').and.equal('urn:individual:test')
      done()
    }).catch(done)
  })
})
