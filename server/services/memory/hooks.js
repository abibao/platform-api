const auth = require('feathers-authentication')
const local = require('feathers-authentication-local')
const hooks = require('feathers-authentication-hooks')

exports.before = {
  all: [
    auth.hooks.authenticate('jwt'),
    hooks.restrictToAuthenticated(),
    hooks.restrictToRoles({
      roles: ['admin'],
      fieldName: 'permissions',
      idField: 'id'
    })
  ],
  find: [],
  get: [],
  create: [
    local.hooks.hashPassword({ passwordField: 'password' })
  ],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
