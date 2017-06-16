const memory = require('feathers-memory')
const hooks = require('../hooks')

module.exports = function () {
  const app = this
  app.use('users', memory())
  const service = app.service('users')
  service.before(hooks.before)
  service.after(hooks.after)
}
