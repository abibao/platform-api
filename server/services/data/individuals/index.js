const Service = require('feathers-sequelize')
const hooks = require('../hooks')
const _ = require('lodash')
const urn = require('../../globalHooks').urn

const IndividualModel = require('./../individuals/model')

module.exports = function () {
  const app = this
  const Individual = IndividualModel(app)
  app.use('api/individuals', Service({
    Model: Individual
  }))
  const service = app.service('api/individuals')
  let _hooks = _.clone(hooks)
  _hooks.before.create.push(urn())
  service.before(hooks.before)
  service.after(hooks.after)
}
