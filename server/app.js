const path = require('path')
const Sequelize = require('sequelize')
const Cradle = require('cradle')
const serveStatic = require('feathers').static
const compress = require('compression')

const feathers = require('feathers')
const socketio = require('feathers-socketio')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const logger = require('feathers-logger')

const cors = require('cors')
const bodyParser = require('body-parser')

const middlewares = require('./middlewares')
const services = require('./services')

const dirpathUpload = path.resolve(__dirname, 'uploads')
const blobService = require('feathers-blob')
const fs = require('fs-blob-store')
const blobStorage = fs(dirpathUpload)

const authentication = require('./authentication')
const app = feathers()

// streams of loggers
let streams = []
streams.push(require('./streams/logstash'))
const bunyan = require('bunyan').createLogger({
  name: 'abiao-surveys-editor',
  streams
})

app.configure(configuration(path.join(__dirname, '..')))

app.cradle = new (Cradle.Connection)('http://' + app.get('couchdb').host, app.get('couchdb').port, {
  auth: {
    username: app.get('couchdb').user,
    password: app.get('couchdb').pass
  },
  cache: true
})

app.sequelize = new Sequelize(app.get('postgres').database, app.get('postgres').username, app.get('postgres').password, {
  dialect: 'postgres',
  host: app.get('postgres').host,
  port: app.get('postgres').port,
  logging: false
})

const whitelist = app.get('corsWhitelist')
const corsOptions = {
  origin (origin, callback) {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  }
}

app.use(compress())
  .use('/', serveStatic(app.get('public')))
  .use('/wp_content', serveStatic(dirpathUpload))
  .use('/oauth2/google/callback', serveStatic(app.get('public')))
  .use('/admin/styles', serveStatic(app.get('public')))
  .use('/admin/mailings', serveStatic(app.get('public')))
  .use('/admin/campaigns', serveStatic(app.get('public')))
  .use('/admin/campaigns/:id/editor', serveStatic(app.get('public')))
  .use('/admin/login', serveStatic(app.get('public')))
  .use('/admin/logout', serveStatic(app.get('public')))
  .use('/reader/:id', serveStatic(app.get('public')))
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(logger(bunyan))
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .use('/uploads', blobService({Model: blobStorage}))
  // Configure services
  .configure(authentication)
  .configure(services)
  .configure(middlewares)

// create super user
app.service('users').create({
  email: app.get('accounts').users.super.email,
  password: app.get('accounts').users.super.password,
  permissions: app.get('accounts').users.super.permissions
}).then(user => {
}).catch(console.error)

// create reader user
app.service('users').create({
  email: app.get('accounts').users.reader.email,
  password: app.get('accounts').users.reader.password,
  permissions: app.get('accounts').users.reader.permissions
}).then(user => {
}).catch(console.error)

module.exports = app
