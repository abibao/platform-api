const feathers = require('feathers')

module.exports = () => {
  let app = feathers()
  app.bus = {
    send () {
    }
  }
  app.error = () => {
  }
  app.info = () => {
  }
  return app
}
