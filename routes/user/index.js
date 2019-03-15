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
exports.changePassword = function (req, res, next) {
    if(!req.body.old_password){
        res.status(402).json({
            message: '请输入旧密码'
        })
    }
    if(!req.body.new_password ){
        res.status(402).json({
            message: '请输入新密码'
        })
    }
    if(req.body.new_password !== req.body.new_password_confirmation){
        res.status(402).json({
            message: '两次输入的密码不相同'
        })
    }
    dbModels.user.update(
        {
            password: md5(req.body.new_password)
        },
        {
            where: {username: username}
        }
    ).then(function () {
        res.status(200).json({
            message: '修改密码成功'
        })
    })

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