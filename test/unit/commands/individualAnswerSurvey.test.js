/* eslint unused:false */

const Promise = require('bluebird')
const chai = require('chai')
const expect = chai.expect

const App = require('../../__mocks/feathers.mock')
const app = App()
const Service = require('../../../server/services/domain/commands/individualAnswerSurveyCommand').Service

app.use('command/individualAnswerSurvey', new Service())
app.use('api/answers', {
  create (data) {
    if (data[0].question === 'error') {
      return Promise.reject(new Error('BOOM'))
    }
    return Promise.resolve()
  },
  remove (id) {
    return Promise.resolve()
  }
})

describe('[unit] command individualAnswerSurvey', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because individual is mandatory', (done) => {
    app.service('command/individualAnswerSurvey').create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_INDIVIDUAL_MANDATORY')
      done()
    })
  })
  it('should fail because campaign_id is mandatory', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'urn:individual'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_CAMPAIGN_ID_MANDATORY')
      done()
    })
  })
  it('should fail because campaign_name is mandatory', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_CAMPAIGN_NAME_MANDATORY')
      done()
    })
  })
  it('should fail because survey_id is mandatory', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id', campaign_name: 'campaign_name'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_SURVEY_ID_MANDATORY')
      done()
    })
  })
  it('should fail because question is mandatory', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id', campaign_name: 'campaign_name', survey_id: 'survey_id'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_QUESTION_MANDATORY')
      done()
    })
  })
  it('should fail because something went wrong with database', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id', campaign_name: 'campaign_name', survey_id: 'survey_id', question: 'error'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch(() => {
      done()
    })
  })
  it('should success create a new answer from null', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id', campaign_name: 'campaign_name', survey_id: 'survey_id', question: 'question'}).then(() => {
      done()
    }).catch(done)
  })
  it('should success create a new answer from array', (done) => {
    app.service('command/individualAnswerSurvey').create({individual: 'individual', campaign_id: 'campaign_id', campaign_name: 'campaign_name', survey_id: 'survey_id', question: 'question', answer: ['1']}).then(() => {
      done()
    }).catch(done)
  })
})
