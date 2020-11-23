/**
 * @description token模块
 * @author wansongtao
 * @date 2020-11
 */

const TOKEN = {};

TOKEN.jsonwebtoken = require('jsonwebtoken');

//密钥
TOKEN.key = 'wansongtao';

/**
 * @description 创建token
 * @param {number} userId 用户id
 * @returns 返回token字符串，生成失败返回false
 */
TOKEN.createToken = (userId) => {
    let myToken = '';

    try {
        if (typeof userId !== 'number') {
            throw {
                message: 'arguments type error'
            };
        }

        //生成token并将用户id存入其中，过期时间4小时
        myToken = TOKEN.jsonwebtoken.sign({
            userId
        }, TOKEN.key, {
            expiresIn: '4h'
        });
    } catch (ex) {
        console.error('createToken(): ' + ex.message);
        myToken = false;
    } finally {
        return myToken;
    }
};

/**
 * @description 验证token
 * @param {string} token 生成的token字符串
 * @returns 返回用户id，验证失败或过期了返回false
 */
TOKEN.verifyToken = (token) => {
    let data = '';

    try {
        if (typeof token !== 'string') {
            throw {message: 'arguments type error.'};
        }

        data = TOKEN.jsonwebtoken.verify(token, TOKEN.key);
        data = data.userId;
    }
    catch(ex) {
        data = false;
        console.error('verifyToken(): ' + ex.message);
    }
    finally {
        return data;
    }
};

module.exports = TOKEN;