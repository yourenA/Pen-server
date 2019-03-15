'use strict';
module.exports = function (sequelize, DataTypes) {
    var tag = sequelize.define('tag', {
        name: DataTypes.STRING,
        r: {type:DataTypes.INTEGER,defaultValue:1},
        g: {type:DataTypes.INTEGER,defaultValue:1},
        b: {type:DataTypes.INTEGER,defaultValue:1},
        a: {type:DataTypes.FLOAT,defaultValue:1}
    }, {
        timestamps: true,
        paranoid: true,
        classMethods: {
            associate: function (models) {
                tag.belongsToMany(models['code'], {through: 'tagcode'})
            }
        }
    });
    return tag;
};