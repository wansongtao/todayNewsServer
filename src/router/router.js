/**
 * @description 路由模块
 * @author wansongtao
 * @date 2020-11
 */

const ROUTER = {};

ROUTER.express = require('express');
ROUTER.path = require('path');
ROUTER.processing = require('../controller/processing');

//创建路由实例
ROUTER.myRouter = ROUTER.express.Router();

//返回静态资源
ROUTER.myRouter.use('/upload', ROUTER.express.static(ROUTER.path.join(__dirname, '../../src/upload')));

//定义登录接口
ROUTER.myRouter.post('/login', async (req, res) => {
    // req.query
    // req.body
    // req.headers['Authorization']
    let message = {};
    message = await ROUTER.processing.login(req.body);
    res.send(message);
});

//定义注册接口
ROUTER.myRouter.post('/register', async (req, res) => {
    let message = {};
    message = await ROUTER.processing.register(req.body);
    res.send(message);
});

//导出路由实例
module.exports = ROUTER.myRouter;