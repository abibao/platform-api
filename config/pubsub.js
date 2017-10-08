const config = require('./default')

module.exports = {
  BUS_EVENT_IS_ALIVE: 'BUS_EVENT_IS_ALIVE__' + config.env,
  BUS_EVENT_BATCH_EMAILING_SENDGRID: 'BUS_EVENT_BATCH_EMAILING_SENDGRID__' + config.env
}
