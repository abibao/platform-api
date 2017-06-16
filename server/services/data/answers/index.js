const Service = require('feathers-sequelize')
const hooks = require('../hooks')

const AnswerModel = require('./../answers/model')

module.exports = function () {
  const app = this
  const Answer = AnswerModel(app)
  app.use('api/answers', Service({
    Model: Answer
  }))
  const service = app.service('api/answers')
  service.before(hooks.before)
  service.after(hooks.after)
}
