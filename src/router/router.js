/**
 * @description 路由模块
 * @author wansongtao
 * @date 2020-11
 */

const ROUTER = {};

ROUTER.express = require('express');
ROUTER.path = require('path');

//创建路由实例
ROUTER.myRouter = ROUTER.express.Router();

//返回静态资源
ROUTER.myRouter.use('/upload', ROUTER.express.static(ROUTER.path(__dirname, '../../src/upload')));

//定义登录接口
ROUTER.myRouter.post('/login', (res, req) => {

});

//定义注册接口
ROUTER.myRouter.post('register', (res, req) => {

});

//导出路由实例
module.exports = ROUTER.myRouter;