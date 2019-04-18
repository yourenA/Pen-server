/**
 * Created by Administrator on 2017/12/27.
 */
var crypto = require('crypto');
var svgCaptcha = require('svg-captcha');
exports.md5 = function(str){
    if(!str){
        return null;
    }
    return crypto.createHash('md5').update(str).digest('hex');
};

exports.checkLogin=function (req,res,next) {
    console.log('session------------------------',req.session.user)
    if (!req.session.user){
        console.log('没登陆');
        return res.status(401).json({
            message:'没登陆'
        });
    }
    next();//如果有登陆，则将控制权交给下一个中间件
};

exports.getCaptcha=function (req,res,next) {
    var captcha = svgCaptcha.create({background:'#cc9966'});
    console.log(' captcha.text', captcha.text)
    req.session.captcha = captcha.text.toLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
};