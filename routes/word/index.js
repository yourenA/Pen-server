/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var dbModels = require('../../models/index').sequelize.models;
var fs = require('fs')
var path = require('path')
exports.getWords = function (req, res, next) {
    var page = req.query.page || 1,
        query = req.query.query || '',
        start_at = req.query.start_at || '',
        end_at = req.query.end_at || '';

    var where = {};
    if (query) {
        where.content = {
            $like: "%" + query + "%"
        }
    }
    if (start_at && end_at) {
        where.createdAt = {
            '$between': [start_at, end_at]
        }
    }
    dbModels.word.findAndCountAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        where: where,
        offset: 12 * (page - 1),// 跳过多少条
        limit: 12 // 每页多少条
    })
        .then(function (result) {
            res.status(200).json({
                count: result.count,
                lastPage: Math.ceil(result.count / 12),
                rows: result.rows

            })
        });
}


exports.addWords = function (req, res, next) {
    if (!req.body.content || !req.file.filename) {
        return res.status(402).json({
            message: '内容与图片必填'
        })
    }
    console.log(req.body)
    dbModels.word.create({
        limit: 1,
        content: req.body.content,
        imageW: req.body.imageW,
        imageH: req.body.imageH,
        image: '/images/word/' + req.file.filename
    }).then(function (user) {
        res.status(200).json(user)
    });
}


exports.deleteWords = function (req, res, next) {
    console.log(req.params.id)
    dbModels.word.findById(req.params.id).then(function (result) {
        if (result) {
            dbModels.word.destroy({
                'where': {'id': req.params.id}
            }).then(function (destroyResult) {
                res.status(200).json(destroyResult)
            });
        } else {
            res.status(402).json({
                message: '没有该记录'
            })
        }
    })

}

exports.editWords = function (req, res, next) {
    if (!req.body.content) {
        return res.status(402).json({
            message: '内容必填'
        })
    }
    var id = req.params.id;
    dbModels.word.findById(id).then(function (result) {
        if (result) {
            var update = {};
            update.content = req.body.content;
            console.log(result.image)
            if (req.file) {
                fs.exists(path.resolve(__dirname, '../../assets' + result.image), function (exists) {
                    console.log(exists)
                    exists ? fs.unlinkSync(path.resolve(__dirname, '../../assets' + result.image)) : console.log('文件不存在')
                })
                update.imageW = req.body.imageW;
                update.imageH = req.body.imageH;
                update.image = '/images/word/' + req.file.filename;
            }
            dbModels.word.update(
                update,
                {
                    where: {id: id}
                }
            ).then(function (updateResult) {
                dbModels.word.findById(id).then(function (findResult) {
                    res.status(200).json(findResult)
                })
            })
        } else {
            res.status(402).json({
                message: '没有该记录'
            })
        }
    })
}

exports.editWordsStatus = function (req, res, next) {
    var id = req.params.id;
    var limit = req.body.status;
    dbModels.word.findById(id).then(function (result) {
        if (result) {
            dbModels.word.update(
                {
                    limit: limit
                },
                {
                    where: {id: id}
                }
            ).then(function (updateResult) {
                dbModels.word.findById(id).then(function (findResult) {
                    res.status(200).json(findResult)
                })
            })
        } else {
            res.status(402).json({
                message: '没有该记录'
            })
        }
    })
}