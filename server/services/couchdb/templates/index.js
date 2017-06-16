const Service = require('feathers-couchdb')
const hooks = require('../hooks')

module.exports = function () {
  const app = this
  app.use('api/templates', Service({
    connection: app.cradle,
    Model: 'templates'
  }))
  const service = app.service('api/templates')
  service.before(hooks.before)
  service.after(hooks.after)
}
