'use strict';
module.exports = function(sequelize, DataTypes) {
  var code_category = sequelize.define('code_category', {
    name: DataTypes.STRING,
    r: DataTypes.INTEGER,
    g: DataTypes.INTEGER,
    b: DataTypes.INTEGER,
    a: DataTypes.FLOAT
  }, {
    timestamps: true,
    // 不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间
    // paranoid 属性只在启用 timestamps 时适用
    paranoid: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        code_category.hasMany(models['code'])
      }
    }
  });
  return code_category;
};