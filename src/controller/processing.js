/**
 * @description 逻辑处理模块
 * @author wansongtao
 * @date 2020-11
 */

const PROCESS = {};

PROCESS.database = require('../database/database');

/**
 * @description 登录逻辑处理
 * @param {object} param0 一个请求体参数对象
 * @returns 返回 {statusCode: 200, data: {}, message: '成功'}
 */
PROCESS.login = async ({userName, userPwd}) => {
    let message = {};
    if(typeof userName !== 'string' || typeof userPwd !== 'string') {
        message = {statusCode: 300, message: '请求参数错误'};
    } else {
        let queryStr = 'select userId from useraccount where userName = ?';

        let data = await PROCESS.database.query(queryStr, [userName]);

        if(data === false) {
            message = {statusCode: 401, message: '服务器繁忙，请稍后再试'};
        }
        else if (data.length === 0) {
            message = {statusCode: 301, message: '用户不存在'};
        }
        else {
            queryStr = 'select userId from useraccount where userName = ? and userPwd = ?';

            data = await PROCESS.database.query(queryStr, [userName, userPwd]);

            if(data === false) {
                message = {statusCode: 401, message: '服务器繁忙，请稍后再试'};
            }
            else if (data.length === 0) {
                message = {statusCode: 302, message: '密码错误'};
            }
            else {
                
            }
        }
    }

    return message;
};



module.exports = PROCESS;