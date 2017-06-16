const Promise = require('bluebird')
const feathers = require('feathers')
const chai = require('chai')
const expect = chai.expect

const Service = require('../../../server/services/domain/queries/answerGetRandomAnswerQuery').Service

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
    case 'postgres':
      return {
        force: false
      }
    default:
      return {}
  }
}
app.sequelize = {
  define: (name) => {
    return {
      sync: () => {},
      findAll: (params) => {
        return new Promise((resolve, reject) => {
          if (params.where.campaign_id === 'urn:individual:error') {
            return reject(new Error('ERROR_TEST_UNIT'))
          }
          if (params.where.campaign_id === '000000') {
            return resolve([{dataValues: {count: 0}}])
          }
          if (params.where.campaign_id === '111111') {
            return resolve([{dataValues: {count: 4}}])
          }
          return reject(new Error('ERROR_TEST_UNIT'))
        })
      }
    }
  }
}
app.use('query/answerGetRandomAnswer', new Service())

describe('[unit] query answerGetRandomAnswer', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because question is mandatory', (done) => {
    app.service('query/answerGetRandomAnswer').find({query: {}}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_QUESTION_MANDATORY')
      done()
    })
  })
  it('should fail because individual is mandatory', (done) => {
    app.service('query/answerGetRandomAnswer').find({query: {question: 'QUESTION'}}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_INDIVIDUAL_MANDATORY')
      done()
    })
  })
  it('should fail because an error occured', (done) => {
    app.service('query/answerGetRandomAnswer').find({query: {question: 'QUESTION', campaign: 'campaign', individual: 'urn:individual:error'}}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_TEST_UNIT')
      done()
    })
  })
  it('should return an empty object', (done) => {
    app.service('query/answerGetRandomAnswer').find({query: {question: 'QUESTION', individual: 'urn:individual:test', campaign: '000000'}}).then((result) => {
      expect(result).not.equal(null)
      done()
    }).catch(done)
  })
  it('should return an aswer random', (done) => {
    app.service('query/answerGetRandomAnswer').find({query: {question: 'QUESTION', individual: 'urn:individual:test', campaign: '111111'}}).then((result) => {
      done()
    }).catch(done)
  })
})
