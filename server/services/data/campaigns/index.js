const Service = require('feathers-sequelize')
const hooks = require('../hooks')

const CampaignModel = require('./../campaigns/model')

module.exports = function () {
  const app = this
  const Campaign = CampaignModel(app)
  app.use('api/campaigns', Service({
    Model: Campaign
  }))
  const service = app.service('api/campaigns')
  service.before(hooks.before)
  service.after(hooks.after)
}
