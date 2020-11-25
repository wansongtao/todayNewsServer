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
 * @description 登录逻辑处理
 * @param {object} req.body 一个请求体参数对象
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.login = async ({
    userName,
    userPwd
}) => {
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
            //查询密码是否正确
            let queryStr = 'select userId from useraccount where userName = ? and userPwd = ?';

            let data = await PROCESS.database.query(queryStr, [userName, userPwd]);

            if (data === false) {
                message = {
                    statusCode: 401,
                    message: '服务器繁忙，请稍后再试'
                };
            } else if (data.length === 0) {
                message = {
                    statusCode: 302,
                    message: '密码错误'
                };
            } else {
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
            }
        }

    }

    return message;
};

/**
 * @description 注册逻辑处理
 * @param {object} req.body 请求体参数对象
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.register = async ({
    userName,
    userPwd,
    nickName
}) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    if (typeof userName !== 'string' || typeof userPwd !== 'string' || typeof nickName !== 'string') {
        message = {
            statusCode: 300,
            message: '请求参数错误'
        };
    } else {
        //验证参数格式
        let regExp = /^[a-zA-Z][a-zA-Z0-9]{2,5}$/;

        if (!regExp.test(userName)) {
            return {
                statusCode: 303,
                message: '用户名格式错误'
            };
        }

        regExp = /^[a-zA-Z][\w]{5,15}$/;
        if (!regExp.test(userPwd)) {
            return {
                statusCode: 304,
                message: '密码格式错误'
            };
        }

        regExp = /^[\u4e00-\u9fa5]{2,7}$/;
        if (!regExp.test(nickName)) {
            return {
                statusCode: 305,
                message: '昵称格式错误'
            };
        }

        //判断用户账号是否已注册
        message = await PROCESS.checkUserName(userName);

        if (message.statusCode != 301) {
            return message;
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

    return message;
};

/**
 * @description 获取所有栏目
 * @returns 返回{statusCode: 200, data: {category: [{ id: 1, name: "游戏" }]}, message: ''}
 */
PROCESS.category = async () => {
    let message = {};
    let queryStr = 'select categoryId, categoryName from category order by categoryHot desc';
    let data = await PROCESS.database.query(queryStr);

    if (data === false) {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    } else if (data.length === 0) {
        message = {
            statusCode: 404,
            message: '服务器繁忙，请稍后再试'
        };
    } else {
        message = {
            statusCode: 200,
            data: {
                category: data
            },
            message: '获取成功'
        };
    }

    return message;
};

/**
 * @description 获取新闻列表
 * @param {Object} param0 {categoryId, currentPage, pageSize} 栏目id、当前页码、每页新闻条数，可选参数
 * @returns 返回 {statusCode: 200, data: {newList: []}, message: '成功'}
 */
PROCESS.getNewList = async ({
    categoryId,
    currentPage,
    pageSize
}) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    let queryStr = '',
        queryParams = [];

    if (categoryId === undefined) {
        //获取所有新闻列表
        queryStr = 'SELECT newsId, newsTitle, newsCover, commentNums from newslists limit ? offset ?';
    } else {
        //获取对应栏目的新闻列表
        if (parseInt(categoryId) === NaN) {
            return {
                statusCode: '300',
                message: '请求参数错误'
            };
        }

        queryStr = `SELECT newsId, newsTitle, newsCover, commentNums from newslists where 
        newsId in (select newsId from news_category where categoryId = ?) limit ? offset ?`;
        queryParams.push(parseInt(categoryId));
    }

    if(pageSize === undefined || parseInt(pageSize) === NaN || parseInt(pageSize) < 0) {
        pageSize = 5;
        queryParams.push(5);  //默认五条
    } else {
        queryParams.push(parseInt(pageSize));
    }

    if(currentPage === undefined || parseInt(currentPage) === NaN || parseInt(currentPage) < 0) {
        queryParams.push(0);  //默认第一页
    } else {
        //页码减一 * 每页条数 = 开始位置
        currentPage = (parseInt(currentPage) - 1) * parseInt(pageSize);
        queryParams.push(currentPage);
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
    }else {
        message = {
            statusCode: '401',
            message: '服务器繁忙，请稍后再试'
        };
    }

    return message;
};

/**
 * @description 获取用户详情
 * @param {string} token 接收token字符串
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.getUserDetails = async ({
    authorization
}) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    if (typeof authorization !== 'string') {
        message = {
            statusCode: '300',
            data: {},
            message: '请求头错误'
        };
    } else {
        let userId = PROCESS.token.verifyToken(authorization);

        if (userId === false) {
            return {
                statusCode: '500',
                data: {},
                message: '用户身份过期，请重新登录'
            };
        }

        let queryStr = `select userName, nickName, head_img, gender from userdetails as ud, 
        useraccount as ua WHERE ud.userId = ua.userId and ud.userId = ?`;

        let data = await PROCESS.database.query(queryStr, [parseInt(userId)]);

        if (data !== false && data.length > 0) {
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
                data: {},
                message: '服务器繁忙，请稍后再试'
            };
        } else {
            message = {
                statusCode: '404',
                data: {},
                message: '服务器繁忙，请稍后再试'
            };
        }
    }

    return message;
};

/**
 * @description 修改用户信息
 * @param {Object} param0 请求头
 * @param {Object} param1 请求体
 * @returns 返回 {statusCode: 200, message: '成功'}
 */
PROCESS.editUserInfo = async ({
    authorization
}, {
    nickName,
    head_img,
    gender
}) => {
    let message = {
        statusCode: '400',
        message: '服务器繁忙，请稍后再试'
    };

    if (typeof authorization !== 'string') {
        return {
            statusCode: '300',
            message: '请求头错误'
        };
    }

    //验证token并获取用户id
    let userId = PROCESS.token.verifyToken(authorization);

    if (userId === false) {
        return {
            statusCode: '500',
            message: '用户身份过期，请重新登录'
        };
    }

    let data = false;
    if (typeof nickName === 'string') {
        //修改昵称
        let regExp = /^[\u4e00-\u9fa5]{2,7}$/;

        if (!regExp.test(nickName)) {
            return {
                statusCode: '305',
                message: '昵称格式错误'
            };
        }

        let queryStr = 'update userdetails set nickName = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [nickName, userId]);
    } else if (typeof gender === 'number') {
        //修改性别
        let regExp = /^[01]{1}$/;

        if (!regExp.test(gender)) {
            return {
                statusCode: '307',
                message: '性别错误'
            };
        }

        let queryStr = 'update userdetails set gender = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [gender.toString(), userId]);
    }else if (typeof head_img === 'string') {
        // 修改头像路径
        let queryStr = 'update userdetails set head_img = ? where userId = ?;'

        data = await PROCESS.database.update(queryStr, [head_img, userId]);
    } else {
        return {
            statusCode: '300',
            message: '参数错误'
        };
    }

    if(data === false) {
        message = {
            statusCode: '401',
            message: '服务器繁忙，请稍后再试'
        };
    } else {
        message = {
            statusCode: '200',
            message: '修改成功'
        };
    }

    return message;
};

/**
 * @description 修改密码
 * @param {Object} param0 请求头对象，应该包含{authorization}这一个参数
 * @param {Object} param1 请求体对象，应该包含{oldPwd, newPwd}这两个参数
 * @returns 返回 {statusCode: 200, message: '成功'}
 */
PROCESS.updatePwd = async ({authorization}, {oldPwd, newPwd}) => {
    let message = {statusCode: 400, message: '服务器繁忙，请稍后再试'};

    if(typeof authorization !== 'string' || typeof oldPwd !== 'string' || typeof newPwd !== 'string') {
        return {
            statusCode: 300,
            message: '请求参数错误'
        };
    }

    let userId = PROCESS.token.verifyToken(authorization);

    if (userId === false) {
        return {
            statusCode: 500,
            message: '用户身份过期，请重新登录'
        };
    }

    //判断用户原密码是否正确
    let queryStr = 'select userName from useraccount where userId = ? and userPwd = ?';

    let data = await PROCESS.database.query(queryStr, [userId, oldPwd]);

    if(data !== false && data.length > 0) {
        //原密码正确
        queryStr = 'update useraccount set userPwd = ? where userId = ?';

        data = await PROCESS.database.update(queryStr, [newPwd, userId]);

        if (data === true) {
            message = {
                statusCode: 200,
                message: '修改成功'
            };
        }else {
            message = {
                statusCode: 401,
                message: '修改失败'
            };
        }
    }
    else if (data.length == 0) {
        //原密码错误
        message = {
            statusCode: 302,
            message: '原密码错误'
        };
    }
    else {
        message = {
            statusCode: 401,
            message: '服务器繁忙，请稍后再试'
        };
    }

    return message;
};

/**
 * @description 上传图片
 * @param {Object} req 请求对象
 * @returns 返回{statusCode: 200, data: {imgUrl: pathName}, message: '上传成功'}
 */
PROCESS.uploadImg = async (req) => {
    let message = {statusCode: 308, message: '图片上传错误'};

    if(!(req instanceof Object)) {
        console.error('uploadImg(): arguments type error.');
        return message;
    }

    let {authorization} = req.headers;

    if(!authorization) {
        return {
            statusCode: 300,
            message: '请求参数错误'
        };
    }

    if(PROCESS.token.verifyToken(authorization) === false) {
        return {
            statusCode: 500,
            message: '用户身份过期，请重新登录'
        };
    }

    //创建formidable.IncomingForm()对象，需要引入formidable模块
    let form = new PROCESS.formidable.IncomingForm();

    //设置表单域的编码
    form.encoding = 'utf-8';

    //设置上传文件存放的文件夹路径
    form.uploadDir = PROCESS.path.join(__dirname, '../upload/img');

    //保留上传文件的后缀名
    form.keepExtensions = true;

    //设置上传文件的大小，500kb，默认2M
    form.maxFieldsSize = 0.5 * 1024 * 1024;

    message = await function getImgPath() {
        return new Promise((resolve, reject) => {
            //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
            form.parse(req, (err, fields, files) => {
                if(err) {
                    resolve({statusCode: 308, message: '图片上传错误'});
                }
                else {
                    const pathName = '/upload/img/' + PROCESS.path.basename(files.file.path);
        
                    resolve({statusCode: 200, data: {imgUrl: pathName}, message: '上传成功'});
                }
            });

        });
    }();

    return message;
};

module.exports = PROCESS;