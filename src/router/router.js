/**
 * @description 路由类
 * @author wansongtao
 * @date 2020-11
 */
class Router {

    constructor() { 
        const express = require('express');
        const path = require('path');
        const processing = require('../controller/processing');

        //路由实例
        this.myRouter = express.Router();

        //返回静态资源
        this.myRouter.use('/upload', express.static(path.join(__dirname, '../../src/upload')));

        //定义登录接口
        this.myRouter.post('/login', processing.login);

        //定义注册接口
        this.myRouter.post('/register', processing.register);

        //栏目接口，返回所有栏目
        this.myRouter.get('/category', processing.category);

        //新闻列表接口，返回对应栏目的新闻
        this.myRouter.get('/newslist', processing.getNewList);

        //用户详情接口
        this.myRouter.get('/userdetail', processing.getUserDetails);

        //用户信息编辑接口
        this.myRouter.post('/useredit', processing.editUserInfo);

        //修改密码接口
        this.myRouter.post('/updatepwd', processing.updatePwd);

        //上传文件接口
        this.myRouter.post('/uploadfile', processing.uploadImg);

        //热门新闻接口
        this.myRouter.get('/hotnews', processing.getHotNews);

        //搜索新闻接口
        this.myRouter.get('/searchnews', processing.searchNews);

        //新闻预查询接口
        this.myRouter.get('/beforesearch', processing.beforeSearch);

        //新闻详情接口
        this.myRouter.get('/getnewcontent', processing.getNewContent);

        //关注用户接口
        this.myRouter.get('/following', processing.following);

        //取消关注用户接口
        this.myRouter.get('/unfollow', processing.unfollow);

        //新闻点赞接口
        this.myRouter.get('/like', processing.like);

        //新闻取消点赞功能
        this.myRouter.get('/unlike', processing.unLike);

        //新闻评论接口
        this.myRouter.get('/newscomment', processing.getNewsComment);
    }

    /**
     * @description 返回路由实例
     */
    backRouter() {
        return this.myRouter;
    }
}

//实例化
const ROUTERS = new Router();

//导出路由实例
module.exports = ROUTERS.backRouter();