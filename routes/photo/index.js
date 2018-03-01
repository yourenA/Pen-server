/**
 * Created by Administrator on 2017/12/27.
 */
var moment = require('moment')
var dbModels = require('../../models/index').sequelize.models;
var fs = require('fs')
var path = require('path')
var images = require("images");
exports.getPhotos = function (req, res, next) {
    var page = req.query.page || 1,
        start_at = req.query.start_at || '',
        end_at = req.query.end_at || '';

    var where = {};
    if (start_at && end_at) {
        where.createdAt = {
            '$between': [start_at, end_at]
        }
    }
    var limit=30;
    dbModels.photo.findAndCountAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        where: where,
        offset: limit * (page - 1),// 跳过多少条
        limit: limit // 每页多少条
    })
        .then(function (result) {
            res.status(200).json({
                count: result.count,
                lastPage: Math.ceil(result.count / limit),
                rows: result.rows

            })
        });
}


exports.addPhotos = function (req, res, next) {
    console.log(req.files)
    if (!req.files.length) {
        return res.status(402).json({
            message: '必须有图片'
        })
    }
    console.log(req.body.imageW)
    console.log(req.body.imageH);
    var addArr=[];
    if(req.files.length>1){
        for(var i=0;i<req.files.length;i++){
            var scale=req.body.imageW[i]/req.body.imageH[i]
            images(process.cwd()+'/assets/images/photo/' + req.files[i].filename)                     //Load image from file
            //加载图像文件
                .size(req.body.imageW[i]>150?150*scale:req.body.imageW[i])                          //Geometric scaling the image to 400 pixels width
                //等比缩放图像
                .save(process.cwd()+'/assets/images/photo/small-' + req.files[i].filename, {               //Save the image to a file, with the quality of 50
                    quality : 100                    //保存图片到文件,图片质量为50
                });
            addArr.push({
                imageW: req.body.imageW[i],
                imageH: req.body.imageH[i],
                image: '/images/photo/' + req.files[i].filename,
                smallImage: '/images/photo/small-' + req.files[i].filename
            });
        }
        dbModels.photo.bulkCreate(addArr).then(function (result) {
            res.status(200).json(result)
        });
    }else{
        var scale=req.body.imageW/req.body.imageH
        images(process.cwd()+'/assets/images/photo/' + req.files[0].filename)                     //Load image from file
        //加载图像文件
            .size(req.body.imageW>150?150*scale:req.body.imageW)                          //Geometric scaling the image to 400 pixels width
            //等比缩放图像
            .save(process.cwd()+'/assets/images/photo/small-' + req.files[0].filename, {               //Save the image to a file, with the quality of 50
                quality : 100                    //保存图片到文件,图片质量为50
            });
        addArr.push({
            imageW: req.body.imageW,
            imageH: req.body.imageH,
            image: '/images/photo/' + req.files[0].filename,
            smallImage: '/images/photo/small-' + req.files[0].filename
        });
        dbModels.photo.bulkCreate(addArr).then(function (result) {
            res.status(200).json(result)
        });
    }


}


exports.deletePhoto = function (req, res, next) {
    console.log(req.params.id)
    dbModels.photo.findById(req.params.id).then(function (result) {
        if (result) {
            dbModels.photo.destroy({
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

