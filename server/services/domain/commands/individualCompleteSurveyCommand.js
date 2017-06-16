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
    data.complete = true
    data.campaign = data.campaign.id
    return app.service('api/surveys').patch(data.id, data)
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualCompleteSurvey',
          params: data
        })
        return Promise.resolve(result)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualCompleteSurvey',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualCompleteSurvey', new Service())
  const service = app.service('command/individualCompleteSurvey')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
