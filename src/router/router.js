/**
 * @description 路由类
 * @author wansongtao
 * @date 2020-11
 */
class Router {
    express = require('express');
    path = require('path');
    processing = require('../controller/processing');

    //创建路由实例
    myRouter = this.express.Router();

    constructor() { 
        //返回静态资源
        this.myRouter.use('/upload', this.express.static(this.path.join(__dirname, '../../src/upload')));

        //定义登录接口
        this.myRouter.post('/login', this.processing.login);

        //定义注册接口
        this.myRouter.post('/register', this.processing.register);

        //栏目接口，返回所有栏目
        this.myRouter.get('/category', this.processing.category);

        //新闻列表接口，返回对应栏目的新闻
        this.myRouter.get('/newslist', this.processing.getNewList);

        //用户详情接口
        this.myRouter.get('/userdetail', this.processing.getUserDetails);

        //用户信息编辑接口
        this.myRouter.post('/useredit', this.processing.editUserInfo);

        //修改密码接口
        this.myRouter.post('/updatepwd', this.processing.updatePwd);

        //上传文件接口
        this.myRouter.post('/uploadfile', this.processing.uploadImg);

        //热门新闻接口
        this.myRouter.get('/hotnews', this.processing.getHotNews);

        //搜索新闻接口
        this.myRouter.get('/searchnews', this.processing.searchNews);

        //新闻预查询接口
        this.myRouter.get('/beforesearch', this.processing.beforeSearch);
    }
}

//实例化
const ROUTERS = new Router();

//导出路由实例
module.exports = ROUTERS.myRouter;