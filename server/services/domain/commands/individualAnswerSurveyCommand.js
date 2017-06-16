const Promise = require('bluebird')
const _ = require('lodash')
const hooks = require('../hooks')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const starttime = new Date()
    // mandatory
    if (!params.individual) {
      return Promise.reject(eraro('ERROR_PARAMS_INDIVIDUAL_MANDATORY'))
    }
    if (!params['campaign_id']) {
      return Promise.reject(eraro('ERROR_PARAMS_CAMPAIGN_ID_MANDATORY'))
    }
    if (!params['campaign_name']) {
      return Promise.reject(eraro('ERROR_PARAMS_CAMPAIGN_NAME_MANDATORY'))
    }
    if (!params['survey_id']) {
      return Promise.reject(eraro('ERROR_PARAMS_SURVEY_ID_MANDATORY'))
    }
    if (!params.question) {
      return Promise.reject(eraro('ERROR_PARAMS_QUESTION_MANDATORY'))
    }
    if (!params.answer || params.answer === null) {
      params.answer = ''
    }
    const answersToCreate = []
    return app.service('api/answers').remove(null, {query: {
      individual: params.individual,
      'survey_id': params['survey_id'],
      'campaign_id': params['campaign_id'],
      question: params.question
    }}).then(() => {
      if (_.isArray(params.answer)) {
        _.map(params.answer, (answer) => {
          let newParams = _.clone(params)
          newParams.answer = answer
          answersToCreate.push(newParams)
        })
      } else {
        answersToCreate.push(params)
      }
      return app.service('api/answers').create(answersToCreate)
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'individualAnswerSurvey',
        params
      })
      return Promise.resolve(result)
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'individualAnswerSurvey',
        error
      })
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualAnswerSurvey', new Service())
  const service = app.service('command/individualAnswerSurvey')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
