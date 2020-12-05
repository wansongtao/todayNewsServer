const {
    update,
    query
} = require('../database/database');

/**
 * @description 逻辑处理类
 * @author wansongtao
 * @date 2020-11
 */
class Processing {
    //异步函数中没有this
    static database = require('../database/database');
    static token = require('../token/token');
    static path = require('path');
    static formidable = require('formidable');

    /**
     * @description 验证参数类型是否正确
     * @param {Array} params 要验证的参数数组,格式：[{param: value, type: 'String'}]
     *  数据类型大写，例如：String、Array、Number、Object（仅支持验证这四种类型）
     * @returns 所有参数验证类型正确后返回true，错误返回false
     */
    static _verifyParams_(paramArr = []) {
        try {
            let typeArr = ['String', 'Array', 'Object', 'Number'];

            return paramArr.every(val => {
                //val: {param: value, type: 'String'} 判断类型是否在范围内
                if (typeArr.indexOf(val.type) === -1) {
                    console.error('Class Processing => _verifyParams_(): type out of range');
                    return false;
                }

                //通过构造函数验证类型
                return val.param.constructor.toString().indexOf(val.type) != -1;
            });
        } catch (ex) {
            console.error('Class Processing => _verifyParams_(): ', ex.message);
            return false;
        }
    }

    /**
     * @description 检查账号是否注册了
     * @param {string} userName 用户账号
     * @returns 返回具体信息 401数据库错误，301没注册，306已注册    
     *  message = {statusCode: 301,message: '用户不存在'};
     */
    static checkUserName = async (userName) => {
        //查询账号是否注册了
        let message = {};
        let queryStr = 'select userId from useraccount where userName = ?';

        let data = await Processing.database.query(queryStr, [userName]);

        if (data[0] && data[0].userId) {
            message = {
                statusCode: 306,
                message: '用户已存在'
            };
        } else if (data.length === 0) {
            message = {
                statusCode: 301,
                message: '用户不存在'
            };
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        return message;
    }

    /**
     * @description 创建token
     * @param {Number} userId 用户id
     * @returns 创建成功返回 {statusCode: 200, data: {token}, message: '登录成功'}
     */
    static _createToken_(userId) {
        let message = {};

        if (typeof userId !== 'number') {
            return {
                statusCode: 402,
                message: '服务器繁忙，请稍后再试'
            };
        }

        const token = Processing.token.createToken(userId);

        if (token !== false) {
            message = {
                statusCode: 200,
                data: {
                    token
                },
                message: '登录成功'
            };

        } else {
            message = {
                statusCode: 402,
                message: '服务器繁忙，请稍后再试'
            };
        }

        return message;
    }

    /**
     * @description 正则验证
     * @param {array} paramArr [{value: val, rule: /^[a-zA-Z][a-zA-Z0-9]{2,5}$/, msg: '错误信息'}]
     * @returns 通过验证返回true，失败返回 {statusCode: 303, message: msg}
     */
    static _regExpVerify_(paramArr = []) {
        try {
            return paramArr.every(item => {
                //{value: val, rule: /^[a-zA-Z][a-zA-Z0-9]{2,5}$/, msg: '错误信息'}
                if (!item.rule.test(item.value)) {
                    throw {
                        message: {
                            statusCode: 303,
                            message: item.msg
                        }
                    };
                }

                return true;
            });
        } catch (ex) {
            console.error('Class Processing => _regExpVerify_(): ', ex.message);
            return ex.message;
        }
    }

    /**
     * @description 分页相关操作
     * @param {array} queryParams 要放入sql语句中的参数数组
     * @param {*} pageSize 每页大小
     * @param {*} currentPage 页码
     * @param {number} defSize 默认每页条数
     * @param {number} defPage 默认页码
     * @returns 返回一个放入了每页大小和页码的数组
     */
    static _paging_(queryParams, pageSize, currentPage, defSize, defPage) {
        try {
            if (!isNaN(parseInt(pageSize))) {
                pageSize = Math.abs(parseInt(pageSize));
                queryParams.push(pageSize);
            } else {
                pageSize = defSize;
                queryParams.push(pageSize); //默认五条
            }

            if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
                //页码减一 * 每页条数 = 开始位置
                currentPage = Math.abs((parseInt(currentPage) - 1)) * pageSize;
                queryParams.push(currentPage);

            } else {
                queryParams.push(defPage); //默认第一页
            }

            return queryParams;
        } catch (ex) {
            console.error('Class Processing => _paging_(): ', ex.message);
            return [10, 0];
        }
    }

    /**
     * @description 处理用户上传的文件
     * @param {*} req 请求对象
     * @returns 返回一个期约对象，解决状态返回{statusCode: 200,message: '图片上传成功'}
     */
    static formidableImg(req) {
        return new Promise(resolve => {
            //创建formidable对象，需要引入formidable模块
            let form = new Processing.formidable();

            //设置表单域的编码
            form.encoding = 'utf-8';

            //设置上传文件存放的文件夹路径
            form.uploadDir = Processing.path.join(__dirname, '../upload/img');

            //保留上传文件的后缀名
            form.keepExtensions = true;

            //设置字段的大小
            form.maxFieldsSize = 0.5 * 1024 * 1024;

            //设置上传文件的大小，500kb，默认2M
            form.maxFileSize = 0.5 * 1024 * 1024;

            form.onPart = (part) => {
                //必须要调用form.parse(req, callback)方法 form.parse(req) => form.onPart() => form.parse()的回调callback
                //只允许上传照片
                if (part.mime.indexOf('image') !== -1) {
                    //调用这个方法才可以将文件存入磁盘
                    form.handlePart(part);
                } else {
                    resolve({
                        statusCode: 309,
                        message: '只能上传照片'
                    });
                }
            };

            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Class Process => formidableImg() => form.parse(): ', err);
                    resolve({
                        statusCode: 308,
                        message: '图片上传错误'
                    });
                } else {
                    //如果用户上传的不是照片，files为空对象 => {}
                    if (files.file !== undefined) {
                        const pathName = '/upload/img/' + Processing.path.basename(files.file.path);

                        resolve({
                            statusCode: 200,
                            data: {
                                imgUrl: pathName
                            },
                            message: '上传成功'
                        });
                    }
                }
            });
        });
    }

    /**
     * @description 登录逻辑处理
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async login(req, res) {
        let message = {
            statusCode: '400',
            message: '服务器繁忙，请稍后再试'
        };

        let {
            userName,
            userPwd
        } = req.body;

        //验证参数类型
        let isVerify = Processing._verifyParams_([{
            param: userName,
            type: 'String'
        }, {
            param: userPwd,
            type: 'String'
        }]);

        if (isVerify === false) {
            message = {
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            };
            res.send(message);
            return;
        }

        //查询账号是否注册了
        message = await Processing.checkUserName(userName);

        //已注册，验证密码是否正确
        if (message.statusCode == 306) {

            let queryStr = 'select userId from useraccount where userName = ? and userPwd = ?';

            let data = await Processing.database.query(queryStr, [userName, userPwd]);

            if (data[0] !== undefined && data[0].userId) {
                //生成token
                message = Processing._createToken_(data[0].userId);

            } else if (data.length === 0) {
                message = {
                    statusCode: 302,
                    message: '密码错误'
                };
            } else {
                message = {
                    statusCode: 401,
                    message: '服务器繁忙，请稍后再试'
                };
            }
        }

        res.send(message);
    }

    /**
     * @description 注册逻辑处理
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async register(req, res) {
        let message = {
            statusCode: '400',
            message: '服务器繁忙，请稍后再试'
        };

        let {
            userName,
            userPwd,
            nickName
        } = req.body;

        //验证参数类型
        let isVerify = Processing._verifyParams_([{
            param: userName,
            type: 'String'
        }, {
            param: userPwd,
            type: 'String'
        }, {
            param: nickName,
            type: 'String'
        }]);

        if (isVerify === false) {
            message = {
                statusCode: 300,
                message: '服务器错误，请稍后再试'
            };
            res.send(message);
            return;
        }

        //验证参数格式
        isVerify = Processing._regExpVerify_([{
            value: userName,
            rule: /^[a-zA-Z][a-zA-Z0-9]{2,5}$/,
            msg: '请输入3-6位字母/数字组合且以字母开头的用户名'
        }, {
            value: userPwd,
            rule: /^[a-zA-Z][\w]{5,15}$/,
            msg: '请输入6-16位字母、数字、下划线组合且以字母开头的密码'
        }, {
            value: nickName,
            rule: /^[\u4e00-\u9fa5]{2,7}$/,
            msg: '请输入2-7位中文昵称'
        }]);

        if (isVerify !== true) {
            res.send(isVerify);
            return;
        }

        //判断用户账号是否已注册
        message = await Processing.checkUserName(userName);

        if (message.statusCode != 301) {
            res.send(message);
            return;
        }

        let isSuccess = await Processing.database.register('insert into useraccount set ?', {
            userName,
            userPwd
        }, nickName);

        if (isSuccess) {
            message = {
                statusCode: 200,
                message: '注册成功'
            };
        } else {
            message = {
                statusCode: 403,
                message: '注册失败'
            };
        }

        res.send(message);
    }

    /**
     * @description 获取所有栏目
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async category(req, res) {
        let message = {};
        let queryStr = 'select categoryId, categoryName from category order by categoryHot desc';
        let data = await Processing.database.query(queryStr);

        if (data[0] !== undefined) {
            message = {
                statusCode: 200,
                data: {
                    category: data
                },
                message: '获取成功'
            };
        } else if (data.length === 0) {
            message = {
                statusCode: 404,
                message: '服务器繁忙，请稍后再试'
            };
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 获取新闻列表
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getNewList(req, res) {
        let message = {
            statusCode: '400',
            message: '服务器繁忙，请稍后再试'
        };

        let {
            categoryId,
            currentPage,
            pageSize
        } = req.query;

        let queryStr = '',
            queryParams = [];

        if (categoryId === undefined) {
            //获取所有新闻列表的sql语句
            queryStr = 'SELECT newsId, nickName, newsTitle, newsCover, commentNums from newlists limit ? offset ?';
        } else {
            //获取对应栏目的新闻列表的sql语句
            if (parseInt(categoryId) === NaN) {
                res.send({
                    statusCode: '300',
                    message: '服务器繁忙，请稍后再试'
                });
                return;
            }

            queryStr = `SELECT newsId, nickName, newsTitle, newsCover, commentNums from newlists where 
            newsId in (select newsId from news_category where categoryId = ?) limit ? offset ?`;
            queryParams.push(parseInt(categoryId));
        }

        queryParams = Processing._paging_(queryParams, pageSize, currentPage);

        let data = await Processing.database.query(queryStr, queryParams);

        if (data.length >= 0) {
            message = {
                statusCode: '200',
                data: {
                    newList: data
                },
                message: '获取新闻列表成功'
            };
        } else {
            message = {
                statusCode: '401',
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 获取用户详情
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getUserDetails(req, res) {
        let message = {
            statusCode: '400',
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            message = {
                statusCode: '300',
                message: '服务器繁忙，请稍后再试'
            };
            res.send(message);
            return;
        }

        let userId = Processing.token.verifyToken(authorization);

        if (userId === false) {
            res.send({
                statusCode: '500',
                message: '用户身份过期，请重新登录'
            });
            return;
        }

        let queryStr = `select userName, nickName, head_img, gender from userdetails as ud, 
            useraccount as ua WHERE ud.userId = ua.userId and ud.userId = ?`;

        let data = await Processing.database.query(queryStr, [parseInt(userId)]);

        if (data[0] !== undefined) {
            message = {
                statusCode: '200',
                data: {
                    userDetail: data[0]
                },
                message: '获取成功'
            };
        } else if (data.length == 0) {

            message = {
                statusCode: '404',
                message: '服务器繁忙，请稍后再试'
            };
        } else {
            message = {
                statusCode: '401',
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 修改用户信息
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async editUserInfo(req, res) {
        let message = {
            statusCode: '400',
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;


        if (typeof authorization !== 'string') {
            res.send({
                statusCode: '300',
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        //验证token并获取用户id
        let userId = Processing.token.verifyToken(authorization);

        if (userId === false) {
            res.send({
                statusCode: '500',
                message: '用户身份过期，请重新登录'
            });
            return;
        }

        let {
            nickName,
            head_img,
            gender
        } = req.body;

        let data = false;
        if (typeof nickName === 'string') {
            //修改昵称
            let regExp = /^[\u4e00-\u9fa5]{2,7}$/;

            if (!regExp.test(nickName)) {
                res.send({
                    statusCode: '303',
                    message: '请输入2-7位中文昵称'
                });
                return;
            }

            let queryStr = 'update userdetails set nickName = ? where userId = ?;'

            data = await Processing.database.update(queryStr, [nickName, userId]);
        } else if (typeof gender === 'number') {
            //修改性别
            let regExp = /^[01]{1}$/;

            if (!regExp.test(gender)) {
                res.send({
                    statusCode: '303',
                    message: '性别错误'
                });
                return;
            }

            let queryStr = 'update userdetails set gender = ? where userId = ?;'

            data = await Processing.database.update(queryStr, [gender.toString(), userId]);
        } else if (typeof head_img === 'string') {
            // 修改头像路径
            let queryStr = 'update userdetails set head_img = ? where userId = ?;'

            data = await Processing.database.update(queryStr, [head_img, userId]);
        } else {
            res.send({
                statusCode: '300',
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        if (data === true) {
            message = {
                statusCode: '200',
                message: '修改成功'
            };
        } else {
            message = {
                statusCode: '401',
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 修改密码
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async updatePwd(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers, {
            oldPwd,
            newPwd
        } = req.body;

        //请求参数验证
        let isVerify = Processing._verifyParams_([{
            param: authorization,
            type: 'String'
        }, {
            param: oldPwd,
            type: 'String'
        }, {
            param: newPwd,
            type: 'String'
        }]);

        if (!isVerify) {
            res.send({
                statusCode: 300,
                message: '请求参数错误'
            });
            return;
        }

        //验证token
        let userId = Processing.token.verifyToken(authorization);

        if (userId === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录'
            });
            return;
        }

        //验证新密码的格式是否正确
        isVerify = Processing._regExpVerify_([{
            value: newPwd,
            rule: /^[a-zA-Z][\w]{5,15}$/,
            msg: '请输入6-16位字母、数字、下划线组合且以字母开头的密码'
        }]);

        if (isVerify !== true) {
            res.send(isVerify);
            return;
        }

        //判断用户原密码是否正确
        let queryStr = 'select userName from useraccount where userId = ? and userPwd = ?';

        let data = await Processing.database.query(queryStr, [userId, oldPwd]);

        if (data[0] !== undefined) {
            //原密码正确
            queryStr = 'update useraccount set userPwd = ? where userId = ?';

            data = await Processing.database.update(queryStr, [newPwd, userId]);

            if (data === true) {
                message = {
                    statusCode: 200,
                    message: '修改成功'
                };
            } else {
                message = {
                    statusCode: 401,
                    message: '修改失败'
                };
            }
        } else if (data.length == 0) {
            //原密码错误
            message = {
                statusCode: 302,
                message: '原密码错误'
            };
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 上传图片
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async uploadImg(req, res) {
        let message = {
            statusCode: 308,
            message: '图片上传错误'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            res.send({
                statusCode: 300,
                message: '服务器错误，请稍后再试'
            });
            return;
        }

        if (Processing.token.verifyToken(authorization) === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录'
            });
            return;
        }

        message = await Processing.formidableImg(req);

        res.send(message);
    }

    /**
     * @description 获取热门新闻列表
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getHotNews(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            currentPage,
            pageSize
        } = req.query;

        let queryParams = [];

        if (!isNaN(parseInt(pageSize))) {
            queryParams.push(Math.abs(parseInt(pageSize)));
        } else {
            queryParams.push(6); //默认一页6条
        }

        if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
            //页码减一 * 每页条数 = 开始位置
            let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[0];

            queryParams.push(beginPosi);
        } else {
            queryParams.push(0); //默认第一页
        }

        let queryStr = 'SELECT newsTitle FROM newsdetail ORDER BY newsHot DESC LIMIT ? OFFSET ?';

        let data = await Processing.database.query(queryStr, queryParams);

        if (data[0] !== undefined) {
            message = {
                statusCode: 200,
                data: {
                    hotNews: data
                },
                message: '获取热门新闻列表成功'
            }
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 根据关键字搜索相似内容，支持分页
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async beforeSearch(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            keyword,
            currentPage,
            pageSize
        } = req.query;

        if (typeof keyword !== 'string') {
            message = {
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            };

            res.send(message);
            return;
        }

        let queryStr = `SELECT newsTitle from newsdetail WHERE newsTitle LIKE ? limit ? offset ?`;
        keyword = "%" + keyword + "%";

        let queryParams = [keyword];

        queryParams = Processing._paging_(queryParams, pageSize, currentPage, 10, 0);

        // if (!isNaN(parseInt(pageSize))) {
        //     queryParams.push(Math.abs(parseInt(pageSize)));
        // } else {
        //     queryParams.push(10); //默认一页十条
        // }

        // if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //     //页码减一 * 每页条数 = 开始位置
        //     let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[1];

        //     queryParams.push(beginPosi);
        // } else {
        //     queryParams.push(0); //默认第一页
        // }

        let data = await Processing.database.query(queryStr, queryParams);

        if (data[0]) {
            message = {
                statusCode: 200,
                data: {
                    maybeNews: data
                },
                message: '搜索成功'
            };
        } else if (data.length === 0) {
            message = {
                statusCode: 201,
                message: '未查找到任何相关内容'
            };
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 根据关键字搜索新闻，支持分页
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async searchNews(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            keyword,
            currentPage,
            pageSize
        } = req.query;

        if (typeof keyword !== 'string') {
            message = {
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            };

            res.send(message);
            return;
        }

        let queryStr = `SELECT newsId, nickName, newsTitle, newsCover, commentNums 
        from newlists WHERE newsTitle LIKE ? limit ? offset ?`;
        keyword = "%" + keyword + "%";

        let queryParams = [keyword];

        queryParams = Processing._paging_(queryParams, pageSize, currentPage, 10, 0);

        // if (!isNaN(parseInt(pageSize))) {
        //     queryParams.push(Math.abs(parseInt(pageSize)));
        // } else {
        //     queryParams.push(10); //默认一页十条
        // }

        // if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //     //页码减一 * 每页条数 = 开始位置
        //     let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[1];

        //     queryParams.push(beginPosi);
        // } else {
        //     queryParams.push(0); //默认第一页
        // }

        let data = await Processing.database.query(queryStr, queryParams);

        if (data[0]) {
            message = {
                statusCode: 200,
                data: {
                    newsList: data
                },
                message: '搜索成功'
            };
        } else if (data.length === 0) {
            message = {
                statusCode: 404,
                message: '未查找到任何相关内容'
            };
        } else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 根据新闻id查询新闻详细内容
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getNewContent(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            newsId
        } = req.query;

        if (isNaN(parseInt(newsId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let queryStr = 'SELECT newsId, userId, nickName, newsTitle, newsContent, newsHot, newsDate, commentNums from newlists WHERE newsId = ?';

        let data = await Processing.database.query(queryStr, [parseInt(newsId)]);

        if (data[0]) {
            let {
                authorization
            } = req.headers, isFollow = false, isLike = false;
            let userId = Processing.token.verifyToken(authorization);

            if (userId === false) {
                res.send({
                    statusCode: 200,
                    data: {
                        newDetails: data[0],
                        isFollow,
                        isLike
                    },
                    message: '获取新闻详情成功'
                });
                return;
            }


            // if (userId === false) {
            //     res.send({
            //         statusCode: 200,
            //         data: {
            //             newDetails: data[0],
            //             isFollow,
            //             isLike
            //         },
            //         message: '获取新闻详情成功'
            //     });
            //     return;
            // }

            //查询用户是否关注了该新闻
            queryStr = `SELECT userId from user_follow where userId = ? 
            and followUserId in (SELECT userId from newlists where newsId = ?)`;

            let followData = await Processing.database.query(queryStr, [userId, newsId]);
            followData[0] ? isFollow = true : isFollow = false;

            //查询用户是否赞了该新闻
            queryStr = 'SELECT userId from user_like where userId = ? and newsId = ?';
            let likeData = await Processing.database.query(queryStr, [userId, newsId]);
            likeData[0] ? isLike = true : isLike = false;

            message = {
                statusCode: 200,
                data: {
                    newDetails: data[0],
                    isFollow,
                    isLike
                },
                message: '获取新闻详情成功'
            };
        } else {
            message = {
                statusCode: 404,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }

    /**
     * @description 关注用户
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async following(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            res.send({
                statusCode: 310,
                message: '请先登录！'
            });
            return;
        }

        let userId = Processing.token.verifyToken(authorization);
        if (userId === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录！'
            });
            return;
        }

        let {
            followUserId
        } = req.query;

        if (isNaN(parseInt(followUserId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let followDate = new Date();
        followDate = followDate.toISOString().substr(0, 10);

        let queryStr = 'INSERT INTO user_follow set ?';
        let data = await Processing.database.insert(queryStr, {
            userId,
            followUserId,
            followDate
        });

        if (data) {
            message = {
                statusCode: 200,
                message: '关注成功'
            };
        } else {
            message = {
                statusCode: 401,
                message: '关注失败'
            };
        }

        res.send(message);
    }

    /**
     * @description 取消关注用户
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async unfollow(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let userId = Processing.token.verifyToken(authorization);
        if (userId === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录！'
            });
            return;
        }

        let {
            followUserId
        } = req.query;
        if (isNaN(parseInt(followUserId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let queryStr = 'delete from user_follow where userId = ? and followUserId = ?';
        let data = await Processing.database.delete(queryStr, [userId, followUserId]);

        if (data) {
            message = {
                statusCode: 200,
                message: '取消关注成功'
            };
        } else {
            message = {
                statusCode: 401,
                message: '取消关注失败'
            };
        }

        res.send(message);
    }

    /**
     * @description 新闻点赞
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async like(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            res.send({
                statusCode: 310,
                message: '请先登录！'
            });
            return;
        }

        let userId = Processing.token.verifyToken(authorization);
        if (userId === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录！'
            });
            return;
        }

        let {
            newsId
        } = req.query;

        if (isNaN(parseInt(newsId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let queryStr = 'insert into user_like set ?';
        let likeDate = new Date();
        likeDate = likeDate.toISOString().substr(0, 10);

        let data = await Processing.database.insert(queryStr, {
            userId,
            newsId,
            likeDate
        });

        if (data) {
            message = {
                statusCode: 200,
                message: '点赞成功'
            };
        } else {
            message = {
                statusCode: 401,
                message: '点赞失败'
            };
        }

        res.send(message);
    }

    /**
     * @description 新闻取消点赞
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async unLike(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            authorization
        } = req.headers;

        if (typeof authorization !== 'string') {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let userId = Processing.token.verifyToken(authorization);
        if (userId === false) {
            res.send({
                statusCode: 500,
                message: '用户身份过期，请重新登录！'
            });
            return;
        }

        let {
            newsId
        } = req.query;

        if (isNaN(parseInt(newsId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        let queryStr = 'delete from user_like where userId = ? and newsId = ?';
        let data = await Processing.database.delete(queryStr, [userId, newsId]);

        if (data) {
            message = {
                statusCode: 200,
                message: '取消点赞成功'
            };
        } else {
            message = {
                statusCode: 401,
                message: '取消失败'
            };
        }

        res.send(message);
    }

    /**
     * @description 新闻评论列表
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getNewsComment(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            newsId
        } = req.query;

        if (isNaN(parseInt(newsId))) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        //获取所有主评论
        let queryStr = `SELECT commentId as parentCommentId, nickName, head_img, commentContent, commentDate 
         from commentlists where commentId IN 
        (SELECT parentCommentId as commentId FROM news_comment WHERE newsId = ?)`;

        let data = await Processing.database.query(queryStr, [newsId]);

        if (data === false) {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
            res.send(message);
            return;
        } else if (data.length === 0) {
            message = {
                statusCode: 201,
                message: '暂无评论'
            };
            res.send(message);
            return;
        }

        //添加子评论字段
        data = data.map(item => {
            return {
                ...item,
                childComment: []
            }
        });

        //获取这篇新闻下的所有主评论下的三条子评论
        queryStr = `SELECT commentId as childCommentId, nickName, commentContent, parentId, replyUserName 
        from childcommentlist as c WHERE newsId = ? and commentId IN (SELECT commentId from 
        (SELECT commentId FROM childcommentlist as x WHERE x.newsId = c.newsId and x.parentId = c.parentId LIMIT ?)
         as y)`;

        let childData = await Processing.database.query(queryStr, [newsId, 3]);

        if (childData === false) {
            message = {
                statusCode: 200,
                data: {
                    commentList: data
                },
                message: '获取子评论错误'
            };
            res.send(message);
            return;
        } else if (childData.length === 0) {
            message = {
                statusCode: 200,
                data: {
                    commentList: data
                },
                message: '无子评论'
            };
            res.send(message);
            return;
        }

        //将子评论添加入对应的主评论下
        data.forEach((item, index) => {
            childData.forEach(value => {
                if (value.parentId == item.parentCommentId) {
                    // //主评论下最多添加三条子评论
                    // if (data[index].childComment.length < 3) {
                    //     data[index].childComment.push(value);
                    // }
                    data[index].childComment.push(value);
                }
            });
        });

        message = {
            statusCode: 200,
            data: {
                commentList: data
            },
            message: '获取评论列表成功'
        };

        res.send(message);
    }

    /**
     * @description 获取更多子评论
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     */
    static async getMoreChildComment(req, res) {
        let message = {
            statusCode: 400,
            message: '服务器繁忙，请稍后再试'
        };

        let {
            newsId,
            parentId
        } = req.query;

        let isVerify = Processing._verifyParams_([{
            param: parseInt(newsId),
            type: 'Number'
        }, {
            param: parseInt(parentId),
            type: 'Number'
        }]);

        if (!isVerify) {
            res.send({
                statusCode: 300,
                message: '服务器繁忙，请稍后再试'
            });
            return;
        }

        //查询这条主评论下的除前三条子评论外的所有子评论
        let queryStr = `SELECT commentId as childCommentId, nickName, commentContent, parentId, replyUserName from 
        childcommentlist as c WHERE newsId = ? and parentId = ? AND commentId not IN (SELECT commentId from 
        (SELECT commentId FROM childcommentlist as x WHERE x.newsId = c.newsId and x.parentId = c.parentId LIMIT ?) as y)`;

        let data = await Processing.database.query(queryStr, [newsId, parentId, 3]);

        if (data[0]) {
            message = {
                statusCode: 200,
                data: {childComment: data},
                message: '获取更多子评论成功'
            };
        }
        else if (data[0].length === 0) {
            message = {
                statusCode: 201,
                message: '没有更多评论了'
            };
        }
        else {
            message = {
                statusCode: 401,
                message: '服务器繁忙，请稍后再试'
            };
        }

        res.send(message);
    }
}

module.exports = Processing;