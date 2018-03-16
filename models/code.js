'use strict';
module.exports = function(sequelize, DataTypes) {
  var code = sequelize.define('code', {
    markdown: DataTypes.TEXT,
    limit: DataTypes.INTEGER,
      title:DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: true,
    classMethods: {
      associate: function(models) {
        code.belongsTo(models['code_category']);//code 添加 code_category_id
        code.belongsToMany(models['tag'], { through: 'tagcode' })
      }
    }
  });
  return code;
};