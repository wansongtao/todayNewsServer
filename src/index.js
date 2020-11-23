/**
 * @description 主程序文件
 * @author wansongtao
 * @date 2020-11
 */

const INDEX = {};

//1.引入express框架
INDEX.express = require('express');

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
INDEX.webApp.use(INDEX.bodyParser.urlencoded({
    extended: false
}));

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

//设置跨域
INDEX.webApp.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});