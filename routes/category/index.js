/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var dbModels = require('../../models/index').sequelize.models;
var fs = require('fs')
var path = require('path')
exports.getCategory = function (req, res, next) {
    var page = parseInt(req.query.page) || 1,
        query = req.query.query || '',
        returnType=req.query.return||'page'

    var where = {};
    if (query) {
        where.name = {
            $like: "%" + query + "%"
        }
    }
    var condition={}
    if(returnType==='all'){
        condition={
            order: [
                ['createdAt', 'DESC'],
            ],
            where: where
        }
    }else{
        condition={
            order: [
                ['createdAt', 'DESC'],
            ],
                where: where,
            offset: 12 * (page - 1),// 跳过多少条
            limit: 12 // 每页多少条
        }
    }
    dbModels.code_category.findAndCountAll(
        condition
    )
        .then(function (result) {
            res.status(200).json({
                rows: result.rows,
                meta:{
                    pagination:{
                        total: result.count,
                        per_page: returnType==='all'?result.count:12,
                        current_page:page
                    }
                }
            })
        });
}


exports.addCategory = function (req, res, next) {
    if (!req.body.name) {
        return res.status(402).json({
            message: '所有字段必填'
        })
    }
    dbModels.code_category.create({
        name: req.body.name,
    }).then(function (user) {
        res.status(200).json(user)
    });
}


exports.deleteCategory = function (req, res, next) {
    console.log(req.params.id)
    dbModels.code_category.findById(req.params.id).then(function (result) {
        if (result) {
            dbModels.code_category.destroy({
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

exports.editCategory = function (req, res, next) {
    if (!req.body.name) {
        return res.status(402).json({
            message: '内容必填'
        })
    }
    var id = req.params.id;
    dbModels.code_category.findById(id).then(function (result) {
        if (result) {
            var update = {};
            update.name = req.body.name;
            dbModels.code_category.update(
                update,
                {
                    where: {id: id}
                }
            ).then(function (updateResult) {
                dbModels.code_category.findById(id).then(function (findResult) {
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
