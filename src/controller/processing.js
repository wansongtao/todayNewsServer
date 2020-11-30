/**
 * @description 逻辑处理模块
 * @author wansongtao
 * @date 2020-11
 */
const PROCESS = {};

PROCESS.database = require('../database/database');
PROCESS.token = require('../token/token');
PROCESS.path = require('path');
PROCESS.formidable = require('formidable');

/**
 * @description 检查账号是否注册了
 * @param {string} userName 用户账号
 * @returns 返回具体信息 401数据库错误，301没注册，306已注册
 *  message = {statusCode: 301,message: '用户不存在'};
 */
PROCESS.checkUserName = async (userName) => {
    //查询账号是否注册了
    let message = {};
    let queryStr = 'select userId from useraccount where userName = ?';

    let data = await PROCESS.database.query(queryStr, [userName]);

    if (data === false) {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    } else if (data.length === 0) {
        message = {
            statusCode: 301,
            message: '用户不存在'
        };
    } else {
        message = {
            statusCode: 306,
            message: '用户已存在'
        };
    }

    return message;
};

/**
 * @description 处理用户上传的文件
 * @param {*} req 请求对象
 * @returns 返回一个期约对象，解决状态返回{statusCode: 200,message: '图片上传成功'}
 */
PROCESS.formidableImg = (req) => {
    return new Promise((resolve, reject) => {
        //创建formidable对象，需要引入formidable模块
        let form = new PROCESS.formidable();

        //设置表单域的编码
        form.encoding = 'utf-8';

        //设置上传文件存放的文件夹路径
        form.uploadDir = PROCESS.path.join(__dirname, '../upload/img');

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
                console.error('PROCESS.formidableImg() => form.parse(): ', err);
                resolve({
                    statusCode: 308,
                    message: '图片上传错误'
                });
            } else {
                //如果用户上传的不是照片，files为空对象 => {}
                if (files.file !== undefined) {
                    const pathName = '/upload/img/' + PROCESS.path.basename(files.file.path);

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
};

/**
 * @description 登录逻辑处理
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.login = async (req, res) => {
    let {
        userName,
        userPwd
    } = req.body;
    let message = {};

    if (typeof userName !== 'string' || typeof userPwd !== 'string') {
        message = {
            statusCode: 300,
            message: '请求参数错误'
        };
    } else {
        //查询账号是否注册了
        message = await PROCESS.checkUserName(userName);

        if (message.statusCode == 306) {
            //已注册，验证密码是否正确
            let queryStr = 'select userId from useraccount where userName = ? and userPwd = ?';

            let data = await PROCESS.database.query(queryStr, [userName, userPwd]);

            if (data[0] !== undefined) {
                //生成token
                const token = PROCESS.token.createToken(data[0].userId);

                if (token === false) {
                    message = {
                        statusCode: 402,
                        message: '服务器繁忙，请稍后再试'
                    };
                } else {
                    message = {
                        statusCode: 200,
                        data: {
                            token
                        },
                        message: '登录成功'
                    };
                }

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

    }

    res.send(message);
};

/**
 * @description 注册逻辑处理
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.register = async (req, res) => {
    let message = {
        statusCode: '400',
        message: '服务器繁忙，请稍后再试'
    };

    let {
        userName,
        userPwd,
        nickName
    } = req.body;

    if (typeof userName !== 'string' || typeof userPwd !== 'string' || typeof nickName !== 'string') {
        message = {
            statusCode: 300,
            message: '请求参数错误'
        };
    } else {
        //验证参数格式
        let regExp = /^[a-zA-Z][a-zA-Z0-9]{2,5}$/;

        if (!regExp.test(userName)) {
            res.send({
                statusCode: 303,
                message: '请输入3-6位字母/数字组合且以字母开头的用户名'
            });
            return;
        }

        regExp = /^[a-zA-Z][\w]{5,15}$/;
        if (!regExp.test(userPwd)) {
            res.send({
                statusCode: 304,
                message: '请输入6-16位字母、数字、下划线组合且以字母开头的密码'
            });
            return;
        }

        regExp = /^[\u4e00-\u9fa5]{2,7}$/;
        if (!regExp.test(nickName)) {
            res.send({
                statusCode: 305,
                message: '请输入2-7位中文昵称'
            });
            return;
        }

        //判断用户账号是否已注册
        message = await PROCESS.checkUserName(userName);

        if (message.statusCode != 301) {
            res.send(message);
            return;
        }

        let isSuccess = await PROCESS.database.register('insert into useraccount set ?', {
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
    }

    res.send(message);
};

/**
 * @description 获取所有栏目
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.category = async (req, res) => {
    let message = {};
    let queryStr = 'select categoryId, categoryName from category order by categoryHot desc';
    let data = await PROCESS.database.query(queryStr);

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
};

/**
 * @description 获取新闻列表
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.getNewList = async (req, res) => {
    let message = {
        statusCode: '400',
        data: {},
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
        //获取所有新闻列表
        queryStr = 'SELECT newsId, nickName, newsTitle, newsCover, commentNums from newlists limit ? offset ?';
    } else {
        //获取对应栏目的新闻列表
        if (parseInt(categoryId) === NaN) {
            res.send({
                statusCode: '300',
                message: '请求参数错误'
            });
            return;
        }

        queryStr = `SELECT newsId, nickName, newsTitle, newsCover, commentNums from newlists where 
        newsId in (select newsId from news_category where categoryId = ?) limit ? offset ?`;
        queryParams.push(parseInt(categoryId));
    }

    if (!isNaN(parseInt(pageSize))) {
        pageSize = Math.abs(parseInt(pageSize));
        queryParams.push(pageSize);
    } else {
        pageSize = 5;
        queryParams.push(5); //默认五条
    }

    if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //页码减一 * 每页条数 = 开始位置
        currentPage = Math.abs((parseInt(currentPage) - 1)) * pageSize;
        queryParams.push(currentPage);
        
    } else {
        queryParams.push(0); //默认第一页
    }

    let data = await PROCESS.database.query(queryStr, queryParams);

    if (data !== false) {
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
};

/**
 * @description 获取用户详情
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.getUserDetails = async (req, res) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    let {
        authorization
    } = req.headers;

    if (typeof authorization !== 'string') {
        message = {
            statusCode: '300',
            message: '请求头错误'
        };
    } else {
        let userId = PROCESS.token.verifyToken(authorization);

        if (userId === false) {
            res.send({
                statusCode: '500',
                message: '用户身份过期，请重新登录'
            });
            return;
        }

        let queryStr = `select userName, nickName, head_img, gender from userdetails as ud, 
        useraccount as ua WHERE ud.userId = ua.userId and ud.userId = ?`;

        let data = await PROCESS.database.query(queryStr, [parseInt(userId)]);

        if (data[0] !== undefined) {
            message = {
                statusCode: '200',
                data: {
                    userDetail: data[0]
                },
                message: '获取成功'
            };
        } else if (data === false) {
            message = {
                statusCode: '401',
                message: '服务器繁忙，请稍后再试'
            };
        } else {
            message = {
                statusCode: '404',
                message: '服务器繁忙，请稍后再试'
            };
        }
    }

    res.send(message);
};

/**
 * @description 修改用户信息
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.editUserInfo = async (req, res) => {
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
            message: '请求头错误'
        });
        return;
    }

    //验证token并获取用户id
    let userId = PROCESS.token.verifyToken(authorization);

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
                statusCode: '305',
                message: '请输入2-7位中文昵称'
            });
            return;
        }

        let queryStr = 'update userdetails set nickName = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [nickName, userId]);
    } else if (typeof gender === 'number') {
        //修改性别
        let regExp = /^[01]{1}$/;

        if (!regExp.test(gender)) {
            res.send({
                statusCode: '307',
                message: '性别错误'
            });
            return;
        }

        let queryStr = 'update userdetails set gender = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [gender.toString(), userId]);
    } else if (typeof head_img === 'string') {
        // 修改头像路径
        let queryStr = 'update userdetails set head_img = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [head_img, userId]);
    } else {
        res.send({
            statusCode: '300',
            message: '参数错误'
        });
        return;
    }

    if (data !== false) {
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
};

/**
 * @description 修改密码
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.updatePwd = async (req, res) => {
    let message = {
        statusCode: 400,
        message: '服务器繁忙，请稍后再试'
    };

    let {authorization} = req.headers,
    {
        oldPwd,
        newPwd
    } = req.body;

    if (typeof authorization !== 'string' || typeof oldPwd !== 'string' || typeof newPwd !== 'string') {
        res.send({
            statusCode: 300,
            message: '请求参数错误'
        });
        return;
    }

    let userId = PROCESS.token.verifyToken(authorization);

    if (userId === false) {
        res.send({
            statusCode: 500,
            message: '用户身份过期，请重新登录'
        });
        return;
    }

    //判断用户原密码是否正确
    let queryStr = 'select userName from useraccount where userId = ? and userPwd = ?';

    let data = await PROCESS.database.query(queryStr, [userId, oldPwd]);

    if (data[0] !== undefined) {
        //原密码正确
        queryStr = 'update useraccount set userPwd = ? where userId = ?';

        data = await PROCESS.database.update(queryStr, [newPwd, userId]);

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
};

/**
 * @description 上传图片
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.uploadImg = async (req, res) => {
    let message = {
        statusCode: 308,
        message: '图片上传错误'
    };

    let {
        authorization
    } = req.headers;

    if (!authorization) {
        res.send({
            statusCode: 300,
            message: '请求参数错误'
        });
        return;
    }

    if (PROCESS.token.verifyToken(authorization) === false) {
        res.send({
            statusCode: 500,
            message: '用户身份过期，请重新登录'
        });
        return;
    }

    message = await PROCESS.formidableImg(req);

    res.send(message);
};

/**
 * @description 获取热门新闻列表
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.getHotNews = async (req, res) => {
    let message = {
        statusCode: 400,
        message: '服务器繁忙，请稍后再试'
    };

    let {currentPage, pageSize} = req.query;

    let queryParams = [];

    if (!isNaN(parseInt(pageSize))) {
        queryParams.push(Math.abs(parseInt(pageSize)));
    }else {
        queryParams.push(6); //默认一页十条
    }

    if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //页码减一 * 每页条数 = 开始位置
        let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[0];

        queryParams.push(beginPosi);
    }else {
        queryParams.push(0);  //默认第一页
    }

    let queryStr = 'SELECT newsTitle FROM newsdetail ORDER BY newsHot DESC LIMIT ? OFFSET ?';

    let data = await PROCESS.database.query(queryStr, queryParams);

    if(data[0] !== undefined) {
        message = {
            statusCode: 200,
            data: {hotNews: data},
            message: '获取热门新闻列表成功'
        }
    }else {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    }

    res.send(message);
};

/**
 * @description 根据关键字搜索相似内容，支持分页
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.beforeSearch = async (req, res) => {
    let message = {
        statusCode: 400,
        message: '服务器繁忙，请稍后再试'
    };

    let {keyword, currentPage, pageSize} = req.query;

    if(typeof keyword !== 'string') {
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

    if (!isNaN(parseInt(pageSize))) {
        queryParams.push(Math.abs(parseInt(pageSize)));
    }else {
        queryParams.push(10); //默认一页十条
    }

    if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //页码减一 * 每页条数 = 开始位置
        let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[1];

        queryParams.push(beginPosi);
    }else {
        queryParams.push(0);  //默认第一页
    }

    let data = await PROCESS.database.query(queryStr, queryParams);

    if(data[0]) {
        message = {
            statusCode: 200,
            data: {
                maybeNews: data
            },
            message: '搜索成功'
        };
    }
    else if(data.length === 0) {
        message = {
            statusCode: 201,
            message: '未查找到任何相关内容'
        };
    }
    else {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    }

    res.send(message);
};

/**
 * @description 根据关键字搜索新闻，支持分页
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 */
PROCESS.searchNews = async (req, res) => {
    let message = {
        statusCode: 400,
        message: '服务器繁忙，请稍后再试'
    };

    let {keyword, currentPage, pageSize} = req.query;

    if(typeof keyword !== 'string') {
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

    if (!isNaN(parseInt(pageSize))) {
        queryParams.push(Math.abs(parseInt(pageSize)));
    }else {
        queryParams.push(10); //默认一页十条
    }

    if (!isNaN(parseInt(currentPage)) && Math.abs(parseInt(currentPage)) > 0) {
        //页码减一 * 每页条数 = 开始位置
        let beginPosi = Math.abs((parseInt(currentPage) - 1)) * queryParams[1];

        queryParams.push(beginPosi);
    }else {
        queryParams.push(0);  //默认第一页
    }

    let data = await PROCESS.database.query(queryStr, queryParams);

    if(data[0]) {
        message = {
            statusCode: 200,
            data: {
                newsList: data
            },
            message: '搜索成功'
        };
    }
    else if(data.length === 0) {
        message = {
            statusCode: 404,
            message: '未查找到任何相关内容'
        };
    }
    else {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    }

    res.send(message);
};

module.exports = PROCESS;