const Sequelize = require('sequelize')

module.exports = function (app) {
  const Style = app.sequelize.define('Style', {
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
    picture: {
      type: Sequelize.STRING,
      allowNull: false
    },
    css: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'styles'
  })
  Style.sync({force: app.get('postgres').force})
  return Style
}
