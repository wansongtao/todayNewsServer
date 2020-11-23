/**
 * @description 逻辑处理模块
 * @author wansongtao
 * @date 2020-11
 */

const PROCESS = {};

PROCESS.database = require('../database/database');
PROCESS.token = require('../token/token');

/**
 * @description 登录逻辑处理
 * @param {object} param0 一个请求体参数对象
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
            //查询密码是否正确
            queryStr = 'select userId from useraccount where userName = ? and userPwd = ?';

            data = await PROCESS.database.query(queryStr, [userName, userPwd]);

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

                if(token === false) {
                    message = {
                        statusCode: 402,
                        message: '服务器繁忙，请稍后再试'
                    };
                } else {
                    message = {
                        statusCode: 200,
                        data: {token},
                        message: '登录成功'
                    };
                }
            }
        }
    }

    return message;
};



module.exports = PROCESS;