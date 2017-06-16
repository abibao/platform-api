const Promise = require('bluebird')
const feathers = require('feathers')

const Service = require('../../../server/services/domain/queries/getCampaignScreenCompleteMessageQuery').Service

const app = feathers()

app.bus = {
  send (chanel, message) { }
}
app.error = (message) => {
}
app.info = (message) => {
}
app.get = (param) => {
  switch (param) {
    case 'postgres':
      return {
        force: false
      }
    default:
      return {}
  }
}
app.sequelize = {
  define: (name) => {
    return {
      sync: () => {},
      findAll: (params) => {
        return new Promise((resolve, reject) => {
          resolve([{
            screen_complete: ''
          }])
        })
      }
    }
  }
}
app.use('query/getCampaignScreenCompleteMessage', new Service())

describe('[unit] query getCampaignScreenCompleteMessage', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should success', (done) => {
    app.service('query/getCampaignScreenCompleteMessage').find({query: {}}).then(() => {
      done()
    }).catch(done)
  })
})
