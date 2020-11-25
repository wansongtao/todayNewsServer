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

//返回静态资源
ROUTER.myRouter.use('/upload', ROUTER.express.static(ROUTER.path.join(__dirname, '../../src/upload')));

//定义登录接口
ROUTER.myRouter.post('/login', async (req, res) => {
    // req.query
    // req.body
    // req.headers['Authorization']
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.login(req.body);
    res.send(message);
});

//定义注册接口
ROUTER.myRouter.post('/register', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.register(req.body);
    res.send(message);
});

//栏目接口，返回所有栏目
ROUTER.myRouter.get('/category', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.category();
    res.send(message);
});

//新闻列表接口，返回对应栏目的新闻
ROUTER.myRouter.get('/newslist', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.getNewList(req.query);
    res.send(message);
});

//用户详情接口
ROUTER.myRouter.get('/userdetail', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.getUserDetails(req.headers);
    res.send(message);
});

//用户信息编辑接口
ROUTER.myRouter.post('/useredit', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.editUserInfo(req.headers, req.body);
    res.send(message);
});

//修改密码接口
ROUTER.myRouter.post('/updatepwd', async (req, res) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};
    message = await ROUTER.processing.updatePwd(req.headers, req.body);
    res.send(message);
});

//上传文件接口
ROUTER.myRouter.post('/uploadfile', async (req, res) => {
    let message = {statusCode: 308, message: '图片上传错误'};
    message = await ROUTER.processing.uploadImg(req);
    res.send(message);
});

//导出路由实例
module.exports = ROUTER.myRouter;