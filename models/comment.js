'use strict';
module.exports = function (sequelize, DataTypes) {
    var comment = sequelize.define('comment', {
        content: DataTypes.TEXT,
        from_name: DataTypes.STRING,
        to_name: DataTypes.STRING,
    }, {
        timestamps: true,
        paranoid: true,
        classMethods: {
            associate: function (models) {
                comment.belongsTo(models['code']);
            }
        }
    });
    return comment;
};