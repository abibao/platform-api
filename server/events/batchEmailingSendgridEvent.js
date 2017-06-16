const config = require('../../config/default')
const eraro = require('eraro')({package: 'platform.abibao.com'})
const uuid = require('uuid')

module.exports = function (message) {
  console.log('BUS_EVENT_BATCH_EMAILING_SENDGRID', message)
  // couchdb
  const NodeCouchDb = require('node-couchdb')
  const couch = new NodeCouchDb({
    host: config.couchdb.host,
    post: config.couchdb.port,
    auth: {
      user: config.couchdb.user,
      pass: config.couchdb.pass
    }
  })
  couch.createDatabase('mailing')
  .then(() => {
    return true
  })
  .catch((error) => {
    if (error.code === 'EDBEXISTS') {
      return true
    }
    throw eraro('ERROR_COUCHDB', error)
  })
  .then(() => {
    // insert document
    return couch.insert('mailing', {
      _id: uuid.v4(),
      response: false,
      error: false,
      email: message.email,
      template: message.template,
      created: new Date(),
      body: message.body
    }).then(({data, headers, status}) => {
      return couch.get('mailing', data.id, {})
    })
  })
  .then(({data, headers, status}) => {
    if (status === 200) {
      const sendgrid = require('sendgrid')(config.sendgrid.key)
      const request = sendgrid.emptyRequest()
      request.method = 'POST'
      request.path = '/v3/mail/send'
      request.body = message.body
      sendgrid.API(request)
        .then((response) => {
          // update document
          data.response = response
          data.updated = new Date()
          return couch.update('mailing', data)
        })
        .catch((error) => {
          // update document
          data.error = error
          data.updated = new Date()
          return couch.update('mailing', data)
        })
    }
  })
  .catch((error) => {
    console.log(error)
  })
}
