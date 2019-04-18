var express = require('express');
var router = express.Router();
var  multer=require('multer');
var path=require('path')
var wordStorage = multer.diskStorage({
    /* destination
     参数可以传递一个函数也可以传递一个字符串，传递函数时，你要自己建立上传文件夹，multer不会给你创建的；
     如果传递字符串参数，multer会给你自动创建一个文件夹的。
     */
    destination:path.resolve(__dirname,'../assets/images/word'),
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now()+ '-' + file.originalname);
    }
});
//添加配置文件到muler对象。
var wordUpload = multer({
    storage: wordStorage
});


var photoStorage = multer.diskStorage({
    /* destination
     参数可以传递一个函数也可以传递一个字符串，传递函数时，你要自己建立上传文件夹，multer不会给你创建的；
     如果传递字符串参数，multer会给你自动创建一个文件夹的。
     */
    destination:path.resolve(__dirname,'../assets/images/photo'),
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now()+ '-' + file.originalname);
    }
});
//添加配置文件到muler对象。
var photoUpload = multer({
    storage: photoStorage
});

var markdownStorage = multer.diskStorage({
    /* destination
     参数可以传递一个函数也可以传递一个字符串，传递函数时，你要自己建立上传文件夹，multer不会给你创建的；
     如果传递字符串参数，multer会给你自动创建一个文件夹的。
     */
    destination:path.resolve(__dirname,'../assets/images/markdown'),
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ '-' + file.originalname.replace(/\s+/g, ""));
    }
});
//添加配置文件到muler对象。
var markdownUpload = multer({
    storage: markdownStorage
});

var user=require('./user/index')
var word=require('./word/index')
var photo=require('./photo/index')
var code=require('./code/index')
var tags=require('./tags/index')
var category=require('./category/index')
var getCaptcha=require('./../util/index').getCaptcha
var checkLogin=require('./../util/index').checkLogin;

router.post('/login',user.login );
router.post('/password',user.changePassword );
router.post('/logout',user.logout );

router.get('/words',word.getWords );
router.post('/words',checkLogin,wordUpload.single('image'),word.addWords );
router.delete('/words/:id',checkLogin,word.deleteWords );
router.put('/words/:id/status',checkLogin,word.editWordsStatus );
router.post('/words/:id',wordUpload.single('image'),word.editWords );

router.get('/photos',photo.getPhotos );
router.post('/photos',photoUpload.array('photos',10),photo.addPhotos );
router.delete('/photos/:id',photo.deletePhoto );

router.get('/tags',tags.getTags );
router.post('/tags',tags.addTags );
router.put('/tags/:id',tags.editTags );

router.get('/category',category.getCategory );
router.post('/category',category.addCategory );
router.put('/category/:id',category.editCategory );
router.delete('/category/:id',category.deleteCategory );

router.post('/markdown/upload',markdownUpload.single('image'),code.uploadMarkdownImage );
router.get('/code',code.getCode );
router.get('/code/:id',code.getOneCode );
router.post('/code',checkLogin,code.addCode );
router.put('/code/:id',checkLogin,code.editCode );
router.delete('/code/:id',checkLogin,code.deleteCode );
router.post('/comment',code.addComment );
router.get('/comments',code.getComment );

router.get('/captcha',getCaptcha );
module.exports = router;
