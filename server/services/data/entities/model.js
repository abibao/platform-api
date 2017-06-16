const Sequelize = require('sequelize')

module.exports = function (app) {
  const Entity = app.sequelize.define('Entity', {
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
    contact: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        isUrl: true
      }
    },
    type: {
      type: Sequelize.ENUM('abibao', 'charity', 'company'),
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hangs: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    usages: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'entities'
  })
  Entity.sync({force: app.get('postgres').force})
  return Entity
}
