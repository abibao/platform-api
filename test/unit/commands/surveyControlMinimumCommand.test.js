/* eslint unused:false */

const chai = require('chai')
const expect = chai.expect
const eraro = require('eraro')({package: 'platform.abibao.com'})

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/commands/surveyControlMinimumCommand').Service

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

app.use('command/surveyControlMinimum', new Service())
app.use('api/campaigns', {
  find (data) {
    return Promise.resolve([{id: '0000000000000000000000000000000'}])
  }
})
app.use('command/individualAffectSurvey', {
  create (data) {
    if (data.individual === 'urn:individual:complete') {
      const error = new Error('ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE')
      return Promise.reject(eraro(error))
    }
    if (data.individual === 'urn:individual:error') {
      const error = new Error('ERROR_TEST_UNIT')
      return Promise.reject((error))
    }
    return Promise.resolve({campaign: {complete: data.params.complete}})
  }
})

describe('[unit] command surveyControlMinimum', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because individual is mandatory', (done) => {
    app.service('command/surveyControlMinimum').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_INDIVIDUAL_MANDATORY')
      done()
    })
  })
  it('should fail because params is mandatory', (done) => {
    app.service('command/surveyControlMinimum').create({individual: 'urn:individual:test'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_OTHERS_MANDATORY')
      done()
    })
  })
  it('should fail because an error occured', (done) => {
    app.service('command/surveyControlMinimum').create({individual: 'urn:individual:error', params: {}}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_TEST_UNIT')
      done()
    })
  })
  it('should success because survey abibao 1 already complete', (done) => {
    app.service('command/surveyControlMinimum').create({individual: 'urn:individual:complete', params: {}}).then(() => {
      done()
    }).catch(done)
  })
  it('should success with complete = true', (done) => {
    app.service('command/surveyControlMinimum').create({individual: 'urn:individual:test', params: {complete: true}}).then((result) => {
      expect(result).to.equal(undefined)
      done()
    }).catch(done)
  })
  it('should success with complete = false', (done) => {
    app.service('command/surveyControlMinimum').create({individual: 'urn:individual:test', params: {complete: false}}).then((result) => {
      expect(result).to.have.property('campaign')
      done()
    }).catch(done)
  })
})
