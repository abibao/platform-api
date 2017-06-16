const auth = require('feathers-authentication')
const jwt = require('feathers-authentication-jwt')
const local = require('feathers-authentication-local')
const oauth2 = require('feathers-authentication-oauth2')

module.exports = function () {
  const app = this
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(auth(config))
  app.configure(jwt())
  app.configure(oauth2(config.oauth2))
  app.configure(local(config.local))

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        auth.hooks.authenticate(config.strategies)
      ],
      remove: [
        auth.hooks.authenticate('jwt')
      ]
    }
  })
}
