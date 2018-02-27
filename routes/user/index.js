/**
 * Created by Administrator on 2017/12/27.
 */
var dbModels = require('../../models/index').sequelize.models;
var md5 = require('../../util/index').md5;
exports.login = function (req, res, next) {
    if(!req.body.username || !req.body.password){
        res.status(402).json({
            message: '用户名和密码不能为空'
        })
    }
    dbModels.user.findOne({
        where: {
            username: req.body.username,
            password: md5(req.body.password)
        }
    }).then(function (user) {
        if (user) {
            req.session.user = user.username;
            console.log('req.session.user',req.session.user)
            res.status(200).json({
                username: user.username
            })
        } else {
            res.status(403).json({
                message: '用户名或密码错误'
            })
        }
    });
};

exports.logout = function (req, res, next) {
    console.log('req.session.user',req.session.user)
    if (req.session.user) {
        req.session.user = null;
        res.status(200).json({
            message: '退出成功'
        })
    } else {
        res.status(401).json({
            message: '登录令牌无效或过期'
        })
    }
};