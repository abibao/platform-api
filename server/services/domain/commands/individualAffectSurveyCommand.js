const Promise = require('bluebird')
const hooks = require('../hooks')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const starttime = new Date()
    let campaign = {}
    let style = {
      id: 'none'
    }
    // mandatory
    if (!params.individual) {
      return Promise.reject(eraro('ERROR_PARAMS_INDIVIDUAL_MANDATORY'))
    }
    if (!params.campaign) {
      return Promise.reject(eraro('ERROR_PARAMS_CAMPAIGN_MANDATORY'))
    }
    let email = params.individual
    // logical traitment
    return app.service('api/campaigns').get(params.campaign)
      // check if campaign exists in database
      .then((result) => {
        campaign = result
        return true
      })
      // get the reader's style
      .then(() => {
        app.service('api/styles').find({query: {
          name: campaign.style
        }}).then((result) => {
          if (result.length === 1) {
            style = result[0]
          }
          return true
        }).catch(() => {
          return true
        })
      })
      // is individual already in our database if reader = abibao
      .then(() => {
        if (campaign.reader === 'abibao') {
          return app.service('api/individuals').find({query: {
            urn: params.individual
          }}).then((result) => {
            if (result.length === 0) {
              throw eraro('ERROR_INDIVIDUAL_CONTROL_SECURITY')
            } else {
              params.individual = result[0].urn
              return true
            }
          })
        } else {
          return true
        }
      })
      // already have affected survey and not complete for this individual ?
      .then(() => {
        if (campaign.reader === 'abibao') {
          return app.service('api/surveys').find({query: {
            individual: params.individual,
            campaign: campaign.id,
            company: campaign.company
          }}).then((result) => {
            if (result.length > 1) {
              throw eraro('ERROR_SURVEY_ABIBAO_AFFECT_MORE_THAN_ONCE')
            }
            if (result.length === 1 && result[0].complete === true) {
              throw eraro('ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE')
            }
            return result
          })
        }
        // else
        return app.service('api/surveys').find({query: {
          individual: params.individual,
          campaign: campaign.id,
          company: campaign.company,
          complete: false
        }})
      })
      // final, create or return
      .then((result) => {
        if (result.length === 0) {
          let data = {
            individual: params.individual,
            campaign: campaign.id,
            company: campaign.company,
            params: params.params,
            complete: false
          }
          if (params.createdAt) {
            data.createdAt = params.createdAt
          }
          if (campaign.reader !== 'close') {
            return app.service('api/surveys').create(data).then(() => {
              const message = {
                'username': 'individualCreateSurveyCommand',
                'text': '[' + new Date() + '] - [' + email + '] can access a new survey (' + campaign.name + ')'
              }
              if (params.silence) {
              } else {
                app.service('command/postOnSlackWithWebhook').create(message)
              }
              return true
            })
          } else {
            return true
          }
        } else {
          return true
        }
      })
      .then(() => {
        if (campaign.reader !== 'close') {
          return app.service('api/surveys').find({query: {
            individual: params.individual,
            campaign: campaign.id,
            company: campaign.company,
            complete: false
          }})
        } else {
          return [{}]
        }
      })
      .then((surveys) => {
        let survey = surveys[0]
        survey.campaign = campaign
        survey.style = style
        return survey
      })
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualAffectSurvey',
          params
        })
        return Promise.resolve(result)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualAffectSurvey',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualAffectSurvey', new Service())
  const service = app.service('command/individualAffectSurvey')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
