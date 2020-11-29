/**
 * @description 路由模块
 * @author wansongtao
 * @date 2020-11
 */
const ROUTER = {};

ROUTER.express = require('express');
ROUTER.path = require('path');
ROUTER.processing = require('../controller/processing');
ROUTER.formidable = require('formidable');

//创建路由实例
ROUTER.myRouter = ROUTER.express.Router();

// req.query
// req.body
// req.headers['Authorization']
//返回静态资源
ROUTER.myRouter.use('/upload', ROUTER.express.static(ROUTER.path.join(__dirname, '../../src/upload')));

//定义登录接口
ROUTER.myRouter.post('/login', ROUTER.processing.login);

//定义注册接口
ROUTER.myRouter.post('/register', ROUTER.processing.register);

//栏目接口，返回所有栏目
ROUTER.myRouter.get('/category', ROUTER.processing.category);

//新闻列表接口，返回对应栏目的新闻
ROUTER.myRouter.get('/newslist', ROUTER.processing.getNewList);

//用户详情接口
ROUTER.myRouter.get('/userdetail', ROUTER.processing.getUserDetails);

//用户信息编辑接口
ROUTER.myRouter.post('/useredit', ROUTER.processing.editUserInfo);

//修改密码接口
ROUTER.myRouter.post('/updatepwd', ROUTER.processing.updatePwd);

//上传文件接口
ROUTER.myRouter.post('/uploadfile', ROUTER.processing.uploadImg);

//热门新闻接口
ROUTER.myRouter.get('/hotnews', ROUTER.processing.getHotNews);

//导出路由实例
module.exports = ROUTER.myRouter;