const Service = require('feathers-sequelize')
const hooks = require('../hooks')

const SurveyModel = require('./../surveys/model')

module.exports = function () {
  const app = this
  const Survey = SurveyModel(app)
  app.use('api/surveys', Service({
    Model: Survey
  }))
  const service = app.service('api/surveys')
  service.before(hooks.before)
  service.after(hooks.after)
}
