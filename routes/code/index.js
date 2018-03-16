/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var dbModels = require('../../models/index').sequelize.models;
var fs = require('fs')
var path = require('path')


exports.uploadMarkdownImage = function (req, res, next) {
    if (!req.file.filename) {
        return res.status(402).json({
            message: '没有图片'
        })
    }
    console.log(req.body)
    res.status(200).json({imageUrl:'/images/markdown/' + req.file.filename})
}


exports.getCode = function (req, res, next) {
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
            where: where,
            include: {model: dbModels.code_category}
        }
    }else{
        condition={
            order: [
                ['createdAt', 'DESC'],
            ],
            where: where,
            include: {model: dbModels.code_category},
            offset: 12 * (page - 1),// 跳过多少条
            limit: 12 // 每页多少条
        }
    }
    dbModels.code.findAndCountAll(
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


exports.addCode = function (req, res, next) {
    if (!req.body.markdown) {
        return res.status(402).json({
            message: 'markdown内容必填'
        })
    }
    if (!req.body.title) {
        return res.status(402).json({
            message: '标题必填'
        })
    }
    if (!req.body.type) {
        return res.status(402).json({
            message: '分类必填'
        })
    }
    dbModels.code.create({
        title:req.body.title,
        codeCategoryId:req.body.type,
        limit: 1,
        markdown: req.body.markdown
    }).then(function (code) {
        res.status(200).json(code)
    });
}
exports.deleteCode = function (req, res, next) {
    console.log(req.params.id)
    dbModels.code.findById(req.params.id).then(function (result) {
        if (result) {
            dbModels.code.destroy({
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