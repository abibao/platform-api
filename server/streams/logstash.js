var config = require('../../config/default')

module.exports = {
  level: 'info',
  type: 'raw',
  stream: require('bunyan-logstash-tcp').createStream({
    host: config.logstash.host,
    port: config.logstash.port
  })
}
