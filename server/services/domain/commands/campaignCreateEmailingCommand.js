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
    if (!data.email) {
      return Promise.reject(eraro('ERROR_PARAMS_EMAIL_MANDATORY'))
    }
    if (!data.template) {
      return Promise.reject(eraro('ERROR_PARAMS_TEMPLATE_MANDATORY'))
    }
    if (!data.url) {
      return Promise.reject(eraro('ERROR_PARAMS_URL_MANDATORY'))
    }
    return app.service('api/individuals').find({query: {
      email: data.email
    }})
    .then((individuals) => {
      if (individuals.length === 0) {
        throw eraro('ERROR_INDIVIDUAL_NOT_FOUND')
      }
      return individuals[0]
    })
    .then((individual) => {
      app.bus.send('BUS_EVENT_BATCH_EMAILING_SENDGRID', {
        email: data.email,
        template: data.template,
        body: {
          'personalizations': [
            { 'to': [{ 'email': data.email }],
              'subject': 'Une entreprise a besoin de vous.',
              'substitutions': {
                '%urn_survey%': data.url + '/reader/' + data.campaign + '?individual=' + individual.urn
              }
            }
          ],
          'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
          'content': [{ 'type': 'text/html', 'value': ' ' }],
          'categories': data.categories || [],
          'template_id': data.template
        }
      })
      return true
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'campaignCreateEmailing',
        data
      })
      return Promise.resolve(result)
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'campaignCreateEmailing',
        error
      })
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/campaignCreateEmailing', new Service())
  const service = app.service('command/campaignCreateEmailing')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
