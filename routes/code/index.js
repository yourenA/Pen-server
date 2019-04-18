/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var sequelize = require('../../models/index').sequelize;
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
    res.status(200).json({imageUrl: '/images/markdown/' + req.file.filename})
}


exports.getCode = function (req, res, next) {
    var page = parseInt(req.query.page) || 1,
        query = req.query.query || '',
        returnType = req.query.return || 'page',
        category = req.query.category || null,
        start_at = req.query.start_at || null,
        end_at = req.query.end_at || null,
        per_page = 10

    var where = {};
    if (query) {
        where.markdown = {
            $like: "%" + query + "%"
        }
    }
    if (start_at && end_at) {
        where.createdAt = {
            '$between': [start_at, end_at]
        }
    }
    if (category) {
        where.codeCategoryId = category;
    }
    var condition = {}
    if (returnType === 'all') {
        condition = {
            order: [
                ['updatedAt', 'DESC'],
            ],
            where: where,
            include: [{model: dbModels.code_category}, {
                model: dbModels.tag,
                where: {id: req.query.tags && req.query.tags.length > 0 ? req.query.tags : []}
            }],
        }
    } else {
        condition = {
            order: [
                ['updatedAt', 'DESC'],
            ],
            where: where,
            include: req.query.tags && req.query.tags.length > 0 ? [{model: dbModels.code_category}, {
                model: dbModels.tag,
                where: {id: req.query.tags},
                required: true
            }] :
                [{model: dbModels.code_category}, {model: dbModels.tag}],
            offset: per_page * (page - 1),// 跳过多少条
            limit: per_page, // 每页多少条
            distinct: true
        }
    }


    dbModels.code.findAndCountAll(
        condition
    )
        .then(function (result) {
            res.status(200).json({
                rows: result.rows,
                meta: {
                    pagination: {
                        total: result.count,
                        per_page: returnType === 'all' ? result.count : per_page,
                        total_page: returnType === 'all' ? 1 : Math.ceil(result.count / per_page),
                        current_page: page
                    }
                }
            })
        });
}
exports.getOneCode = function (req, res, next) {
    var id = req.params.id;
    console.log(id)
    dbModels.code.findById(id, {include: [{model: dbModels.tag}, {model: dbModels.code_category}]})
        .then(function (result) {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(402).json({
                    message: '没有该记录'
                })
            }

        })
}

exports.addCode = function (req, res, next) {
    console.log('req.body', req.body)
    if (!req.body.type) {
        return res.status(402).json({
            message: '分类必填'
        })
    }
    if (!req.body.title) {
        return res.status(402).json({
            message: '标题必填'
        })
    }
    if (!req.body.markdown) {
        return res.status(402).json({
            message: 'markdown内容必填'
        })
    }

    // 先创建code , 找到tags , 最后利用自动生成的setTags()
    dbModels.code.create({
        title: req.body.title,
        codeCategoryId: req.body.type,
        limit: 1,
        markdown: req.body.markdown,
        pageImageUrl: req.body.pageImageUrl
    }).then(function (code) {
        dbModels.tag.findAll({where: {id: req.body.tags}}).then(function (tags) {
            code.setTags(tags)
            return res.status(200).json({
                message: '添加文章成功'
            })
        })
    }).catch(function () {
        return res.status(402).json({
            message: '服务器错误'
        })
    })
}
exports.editCode = function (req, res, next) {
    var id = req.params.id;

    if (!id) {
        return res.status(402).json({
            message: '缺少文章id'
        })
    }
    if (!req.body.type) {
        return res.status(402).json({
            message: '分类必填'
        })
    }
    if (!req.body.title) {
        return res.status(402).json({
            message: '标题必填'
        })
    }
    if (!req.body.markdown) {
        return res.status(402).json({
            message: 'markdown内容必填'
        })
    }


    dbModels.code.findById(id).then(function (code) {
        if (code) {
            dbModels.code.update(
                {
                    title: req.body.title,
                    codeCategoryId: req.body.type,
                    markdown: req.body.markdown,
                    pageImageUrl: req.body.pageImageUrl
                },
                {
                    where: {id: id}
                }
            ).then(function (updateResult) {
                dbModels.tag.findAll({where: {id: req.body.tags}}).then(function (tags) {
                    code.setTags(tags)
                    return res.status(200).json({
                        message: '跟新文章成功'
                    })
                })
            })
        } else {
            res.status(402).json({
                message: '没有该记录'
            })
        }
    }).catch(function () {
        return res.status(402).json({
            message: '服务器错误'
        })
    })
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

exports.addComment = function (req, res, next) {
    console.log('req.body', req.body)
    if (!req.body.from_name) {
        return res.status(402).json({
            message: '昵称必填'
        })
    }
    if (req.body.from_name>15) {
        return res.status(402).json({
            message: '昵称长度不能超过15'
        })
    }
    if (!req.body.comment) {
        return res.status(402).json({
            message: '评论内容必填'
        })
    }
    if (req.body.comment.length>300) {
        return res.status(402).json({
            message: '评论内容长度不能超过300'
        })
    }
    if (req.body.captcha.toLowerCase() !== req.session.captcha) {
        return res.status(402).json({
            message: '验证码错误'
        })
    }


    // 先创建code , 找到tags , 最后利用自动生成的setTags()
    dbModels.comment.create({
        to_name: req.body.to_name ? req.body.to_name : '',
        from_name: req.body.from_name,
        content: req.body.comment,
        codeId: req.body.post_id,
    }).then(function (code) {
        return res.status(200).json({
            message: '添加评论成功'
        })
    }).catch(function () {
        return res.status(402).json({
            message: '服务器错误'
        })
    })
}

exports.getComment = function (req, res, next) {
    var id = req.query.id;
    dbModels.comment.findAndCountAll(
        {
            where: {
                codeId: Number(id)
            },
            order: [
                ['createdAt', 'DESC'],
            ],

        }
    )
        .then(function (result) {
            res.status(200).json({
                rows: result.rows
            })
        });
}