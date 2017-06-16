/* jshint unused:false */

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect
const eraro = require('eraro')({package: 'platform.abibao.com'})

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/commands/individualAffectSurveyCommand').Service

let surveys = []

app.use('command/individualAffectSurvey', new Service())
app.use('command/postOnSlackWithWebhook', {
  create (data) {
  }
})
app.use('api/styles', {
  find (params) {
    return Promise.resolve([])
  }
})
app.use('api/campaigns', {
  get (id) {
    if (id === 'abibao') {
      return Promise.resolve({reader: 'abibao', id: 'urn:campaign', company: 'urn:company'})
    }
    if (id === 'another') {
      return Promise.resolve({reader: 'another', id: 'urn:campaign', company: 'urn:company'})
    }
    return Promise.reject(eraro({}))
  }
})
app.use('api/individuals', {
  find (params) {
    if (params.query.urn === 'urn:individual:test') {
      return Promise.resolve([{urn: 'urn:individual:test'}])
    }
    if (params.query.urn === 'urn:individual:twice') {
      return Promise.resolve([{urn: 'urn:individual:twice'}])
    }
    if (params.query.urn === 'urn:individual:complete') {
      return Promise.resolve([{urn: 'urn:individual:complete'}])
    }
    if (params.query.urn === 'urn:individual:complete:false') {
      return Promise.resolve([{urn: 'urn:individual:complete:false'}])
    }
    if (params.query.urn === 'urn:individual:complete:none') {
      return Promise.resolve([{urn: 'urn:individual:complete:none'}])
    }
    return Promise.resolve([])
  }
})
app.use('api/surveys', {
  create (data) {
    surveys.push({id: 'urn:campaign', complete: false})
    return Promise.resolve()
  },
  find (params) {
    if (params.query.individual === 'urn:individual:twice') {
      return Promise.resolve([{}, {}])
    }
    if (params.query.individual === 'urn:individual:complete') {
      return Promise.resolve([{complete: true}])
    }
    if (params.query.individual === 'urn:individual:complete:false') {
      return Promise.resolve([{campaign: params.query.campaign}])
    }
    if (params.query.individual === 'urn:individual:complete:none') {
      return Promise.resolve(surveys)
    }
    return Promise.resolve([])
  }
})

describe('[unit] command individualAffectSurvey', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because individual is mandatory', (done) => {
    app.service('command/individualAffectSurvey').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_INDIVIDUAL_MANDATORY')
      done()
    })
  })
  it('should fail because campaign is mandatory', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:test'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_CAMPAIGN_MANDATORY')
      done()
    })
  })
  it('should fail because campaign not found', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:test', campaign: 'not good'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      done()
    })
  })
  it('should fail for abibao reader because security control is needed', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'not:in:database', campaign: 'abibao'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_INDIVIDUAL_CONTROL_SECURITY')
      done()
    })
  })
  it('should fail for abibao reader, because too many affections (big error)', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:twice', campaign: 'abibao'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_SURVEY_ABIBAO_AFFECT_MORE_THAN_ONCE')
      done()
    })
  })
  it('should fail for abibao reader, because survey already complete', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:complete', campaign: 'abibao'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE')
      done()
    })
  })
  it('should success for abibao reader and return a survey already affected', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:complete:false', campaign: 'abibao'}).then((survey) => {
      expect(survey).to.have.property('campaign')
      expect(survey.campaign).to.have.property('id').and.equal('urn:campaign')
      done()
    }).catch(done)
  })
  it('should success for another reader and return a survey already affected', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:complete:false', campaign: 'another'}).then((survey) => {
      expect(survey).to.have.property('campaign')
      expect(survey.campaign).to.have.property('id').and.equal('urn:campaign')
      done()
    }).catch(done)
  })
  it('should success for abibao reader and return a survey by created a new affectation', (done) => {
    app.service('command/individualAffectSurvey').create({individual: 'urn:individual:complete:none', campaign: 'abibao', createdAt: new Date()}).then((survey) => {
      expect(survey).to.have.property('campaign')
      expect(survey.campaign).to.have.property('id').and.equal('urn:campaign')
      done()
    }).catch(done)
  })
})
