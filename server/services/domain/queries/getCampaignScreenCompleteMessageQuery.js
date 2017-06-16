const Promise = require('bluebird')
const eraro = require('eraro')({package: 'platform.abibao.com'})
const hooks = require('../hooks')

const CampaignModel = require('./../../data/campaigns/model')

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    const Campaign = CampaignModel(app)
    return Campaign.findAll({where: {id: params.query.id}})
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'getCampaignScreenCompleteMessage',
          params
        })
        return Promise.resolve(result[0]['screen_complete'])
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'answerGetRandomAnswer',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('query/getCampaignScreenCompleteMessage', new Service())
  const service = app.service('query/getCampaignScreenCompleteMessage')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
