'use strict';
module.exports = function(sequelize, DataTypes) {
  var tag = sequelize.define('tag', {
    name: DataTypes.STRING,
    r: DataTypes.INTEGER,
    g: DataTypes.INTEGER,
    b: DataTypes.INTEGER,
    a: DataTypes.FLOAT
  }, {
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        tag.belongsToMany(models['code'], { through: 'tagcode' })
      }
    }
  });
  return tag;
};