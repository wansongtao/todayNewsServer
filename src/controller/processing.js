/**
 * @description 逻辑处理模块
 * @author wansongtao
 * @date 2020-11
 */

const PROCESS = {};

PROCESS.database = require('../database/database');
PROCESS.token = require('../token/token');

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

        if(message.statusCode != 301) {
            return message;
        }

        let isSuccess = await PROCESS.database.register('insert into useraccount set ?', {userName, userPwd}, nickName);

        if(isSuccess) {
            message = {statusCode: 200, message: '注册成功'};
        } else {
            message = {statusCode: 403, message: '注册失败'};
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

    if(data === false) {
        message = {statusCode: 401, message: '服务器繁忙，请稍后再试'};
    } else if (data.length === 0) {
        message = {statusCode: 404, message: '服务器繁忙，请稍后再试'};
    } else {
        message = {statusCode: 200, data: {category: data}, message: '获取成功'};
    }

    return message;
};

/**
 * @description 获取新闻列表
 * @param {Object} param0 {categoryId} 栏目id，可选参数
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.getNewList = async ({categoryId}) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    let queryStr = '', data = [];
    if(categoryId === undefined) {
        //获取所有新闻列表
        queryStr = 'SELECT newsId, newsTitle, newsCover, commentNums from newslists';

        data = await PROCESS.database.query(queryStr);
    } else {
        //获取对应栏目的新闻列表
        if(parseInt(categoryId) === NaN) {
            return {
                statusCode: '300',
                data: {},
                message: '请求参数错误'
            };
        }
        
        queryStr = `SELECT newsId, newsTitle, newsCover, commentNums from newslists where 
        newsId in (select newsId from news_category where categoryId = ?)`;

        data = await PROCESS.database.query(queryStr, [categoryId]);
    }

    if(data === false) {
        message = {
            statusCode: '401',
            data: {},
            message: '服务器繁忙，请稍后再试'
        };
    } else if (data.length === 0) {
        message = {
            statusCode: '404',
            data: {},
            message: '服务器繁忙，请稍后再试'
        };
    } else {
        message = {
            statusCode: '200',
            data: {newList: data},
            message: '获取新闻列表成功'
        };
    }

    return message;
};

/**
 * @description 获取用户详情
 * @param {string} token 接收token字符串
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.getUserDetails = async ({authorization}) => {
    let message = {
        statusCode: '400',
        data: {},
        message: '服务器繁忙，请稍后再试'
    };

    if(typeof authorization !== 'string') {
        message = {
            statusCode: '300',
            data: {},
            message: '请求头错误'
        };
    }
    else {
        let userId = PROCESS.token.verifyToken(authorization);

        if(userId === false) {
            return {
                statusCode: '500',
                data: {},
                message: '用户身份过期，请重新登录'
            };
        }

        let queryStr = `select userName, nickName, head_img, gender from userdetails as ud, 
        useraccount as ua WHERE ud.userId = ua.userId and ud.userId = ?`;

        let data = await PROCESS.database.query(queryStr, [parseInt(userId)]);

        if(data !== false && data.length > 0) {
            message = {
                statusCode: '200',
                data: {userDetail: data[0]},
                message: '获取成功'
            };
        }
        else if (data === false) {
            message = {
                statusCode: '401',
                data: {},
                message: '服务器繁忙，请稍后再试'
            };
        }
        else {
            message = {
                statusCode: '404',
                data: {},
                message: '服务器繁忙，请稍后再试'
            };
        }
    }

    return message;
};

module.exports = PROCESS;