/**
 * @description 主程序文件
 * @author wansongtao
 * @date 2020-11
 */

const INDEX = {};

//1.引入express框架
INDEX.express = require('express');

//引入路由模块
INDEX.router = require('./router/router');

//引入中间件模块，用来处理post请求体
INDEX.bodyParser = require('body-parser');

//2.创建服务器实例
INDEX.webApp = INDEX.express();

//3.监听端口
INDEX.webApp.listen(5050, err => {
    if (err) {
        console.error('listen(): ', err);
    }
});

//注册中间件
// parse application/x-www-form-urlencoded，接收表单格式数据
INDEX.webApp.use(INDEX.bodyParser.urlencoded({ extended: false }));
// parse application/json，接收json格式数据
INDEX.webApp.use(INDEX.bodyParser.json());

//设置请求头
INDEX.webApp.all('*', (req, res, next) => {
    //允许跨域
    res.header('Access-Control-Allow-Origin', '*');
    //前端发送了什么样的请求头，后端要设置接住
    res.header("Access-Control-Allow-Headers","content-type, Authorization"); 
    next();
});

// 注册路由实例，处理请求
INDEX.webApp.use(INDEX.router);

//4.服务器错误处理
INDEX.webApp.use((err, req, res, next) => {
    console.error('server error: ', err);
    res.status(500).send({
        statusCode: 500,
        message: '服务器错误'
    });
});

//5.资源路径错误处理
INDEX.webApp.use((req, res) => {
    res.status(404).send({
        statusCode: 404,
        message: '找不到该资源'
    });
});

