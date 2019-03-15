'use strict';
module.exports = function (sequelize, DataTypes) {
    var code = sequelize.define('code', {
        markdown: DataTypes.TEXT,
        limit: DataTypes.INTEGER,
        title: DataTypes.STRING,
        pageImageUrl:  { type: DataTypes.STRING,  defaultValue: 'https://photo.tuchong.com/1608305/f/602998431.jpg'}
    }, {
        timestamps: true,
        paranoid: true,
        classMethods: {
            associate: function (models) {
                code.belongsTo(models['code_category']);
                code.belongsToMany(models['tag'], {through: 'tagcode'})
            }
        }
    });
    return code;
};