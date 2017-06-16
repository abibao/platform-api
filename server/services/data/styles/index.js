const Service = require('feathers-sequelize')
const hooks = require('../hooks')

const AnswerModel = require('./../styles/model')

module.exports = function () {
  const app = this
  const Answer = AnswerModel(app)
  app.use('api/styles', Service({
    Model: Answer
  }))
  const service = app.service('api/styles')
  service.before(hooks.before)
  service.after(hooks.after)
}
