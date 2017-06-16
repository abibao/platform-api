const auth = require('feathers-authentication')
const hooks = require('feathers-authentication-hooks')

exports.before = {
  all: [
    auth.hooks.authenticate('jwt'),
    hooks.restrictToAuthenticated(),
    hooks.restrictToRoles({
      roles: ['admin', 'reader'],
      fieldName: 'permissions',
      idField: 'id'
    })
  ],
  find: [],
  get: [],
  create: [],
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
