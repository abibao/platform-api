const Sequelize = require('sequelize')

module.exports = function (app) {
  const Answer = app.sequelize.define('Answer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    individual: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    survey_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    campaign_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    campaign_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    question: {
      type: Sequelize.STRING,
      allowNull: false
    },
    answer: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'answers'
  })
  Answer.sync({force: app.get('postgres').force})
  return Answer
}
