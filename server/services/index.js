const glob = require('glob-promise')
const path = require('path')
const _ = require('lodash')

// internal services
const users = require('./memory/users')

module.exports = function () {
  const app = this

  app.configure(users)

  const patterns = [
    path.resolve(__dirname, 'couchdb/**/index.js'),
    path.resolve(__dirname, 'data/**/index.js'),
    path.resolve(__dirname, 'domain/commands/**/*.js'),
    path.resolve(__dirname, 'domain/queries/**/*.js')
  ]
  _.map(patterns, (pattern) => {
    let services = glob.sync(pattern)
    _.map(services, (service) => {
      app.configure(require(service))
    })
  })
}
