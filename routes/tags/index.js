/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var dbModels = require('../../models/index').sequelize.models;
var fs = require('fs')
var path = require('path')
exports.getTags = function (req, res, next) {

    dbModels.tag.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
    })
        .then(function (result) {
            res.status(200).json({
                rows: result
            })
        });
}


exports.addTags = function (req, res, next) {
    if (!req.body.name ) {
        return res.status(402).json({
            message: '所有内容必填'
        })
    }
    dbModels.tag.create({
        name: req.body.name,
        r: req.body.r,
        g: req.body.g,
        b: req.body.b,
        a: req.body.a
    }).then(function (result) {
        res.status(200).json(result)
    });
}



exports.editTags = function (req, res, next) {
    if (!req.body.name || !req.body.r|| !req.body.g|| !req.body.b|| !req.body.a) {
        return res.status(402).json({
            message: '所有内容必填'
        })
    }
    var id = req.params.id;
    dbModels.tag.findById(id).then(function (result) {
        if (result) {
            var update = {
                name: req.body.name,
                r: req.body.r,
                g: req.body.g,
                b: req.body.b,
                a: req.body.a
            };
            dbModels.tag.update(
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
