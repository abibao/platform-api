const Sequelize = require('sequelize')

module.exports = function (app) {
  const Campaign = app.sequelize.define('Campaign', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    screen_complete: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false
    },
    reader: {
      type: Sequelize.STRING,
      allowNull: false
    },
    style: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ''
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'campaigns'
  })
  Campaign.sync({force: app.get('postgres').force})
  return Campaign
}
