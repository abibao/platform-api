const Promise = require('bluebird')
const hooks = require('../hooks')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (data) {
    const app = this.app
    const starttime = new Date()
    if (!data.individual) {
      return Promise.reject(eraro('ERROR_PARAMS_INDIVIDUAL_MANDATORY'))
    }
    if (!data.params) {
      return Promise.reject(eraro('ERROR_PARAMS_OTHERS_MANDATORY'))
    }
    return app.service('api/campaigns').find({query: {
      position: 1,
      company: 'Abibao'
    }})
    // affect survey 1
    .then((result) => {
      return result[0]
    })
    .then((result) => {
      return app.service('command/individualAffectSurvey').create({
        individual: data.individual,
        campaign: result.id,
        params: data.params
      })
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlMinimum',
        data
      })
      if (result.campaign.complete === true) {
        return Promise.resolve()
      } else {
        return Promise.resolve(result)
      }
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlMinimum',
        error
      })
      if (error.code === 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE') {
        return Promise.resolve()
      }
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/surveyControlMinimum', new Service())
  const service = app.service('command/surveyControlMinimum')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
