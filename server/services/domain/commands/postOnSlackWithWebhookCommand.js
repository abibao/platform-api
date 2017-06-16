const Promise = require('bluebird')
const rp = require('request-promise')
const hooks = require('../hooks')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const opts = {
      method: 'POST',
      uri: app.get('slack').webhook,
      body: params,
      json: true
    }
    return rp(opts).then(Promise.resolve).catch((error) => {
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/postOnSlackWithWebhook', new Service())
  const service = app.service('command/postOnSlackWithWebhook')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
