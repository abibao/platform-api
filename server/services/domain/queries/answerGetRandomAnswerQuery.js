const Promise = require('bluebird')
const Sequelize = require('sequelize')
const eraro = require('eraro')({package: 'platform.abibao.com'})
const hooks = require('../hooks')

const AnswerModel = require('./../../data/answers/model')

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    if (!params.query.question) {
      return Promise.reject(eraro('ERROR_PARAMS_QUESTION_MANDATORY'))
    }
    if (!params.query.individual) {
      return Promise.reject(eraro('ERROR_PARAMS_INDIVIDUAL_MANDATORY'))
    }
    if (!params.query.campaign) {
      return Promise.reject(eraro('ERROR_PARAMS_CAMPAIGN_MANDATORY'))
    }
    const Answer = AnswerModel(app)
    return Answer.findAll({
      where: { 'campaign_id': params.query.campaign, question: params.query.question, individual: { $not: params.query.individual } },
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('question')), 'count']]
    }).then((result) => {
      let count = parseInt(result[0].dataValues.count)
      return count
    }).then((count) => {
      if (count === 0) {
        return {
          count,
          random: false
        }
      } else {
        let offset = getRandomInt(0, count - 1)
        return Answer.findAll({
          where: { 'campaign_id': params.query.campaign, question: params.query.question, individual: { $not: params.query.individual } },
          offset,
          limit: 1
        })
      }
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'query',
        name: 'answerGetRandomAnswer',
        params
      })
      if (result.length) {
        return Promise.resolve(result[0])
      }
      return Promise.resolve({})
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'query',
        name: 'answerGetRandomAnswer',
        error
      })
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('query/answerGetRandomAnswer', new Service())
  const service = app.service('query/answerGetRandomAnswer')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
