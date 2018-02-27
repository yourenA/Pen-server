'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    timestamps: true,

    // 不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间
    // paranoid 属性只在启用 timestamps 时适用
    paranoid: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },

    }
  });
  return user;
};