/**
 * @description token类
 * @author wansongtao
 * @date 2020-11
 */
class Token {
    static jsonwebtoken = require('jsonwebtoken');

    /**
     * @description 存储用户登录信息
     */
    static userInfoArr = [];

    static key = 'wansongtao8946513488';

    /**
     * @description 将用户id和用户标识码保存起来
     * @param {number} userId 用户id
     * @param {string} userKey 用户登录时，生成的唯一标识码
     */
    static userInfo(userId, userKey) {
        let userInfoArr = this.userInfoArr;

        if (userInfoArr.length > 0) {
            let isSame = false;

            userInfoArr.forEach(item => {
                // 如果该用户的信息已经存在了，则替换userKey的值
                if (item.userId === userId) {
                    item.userKey = userKey;
                    isSame = true;
                }
            });

            //如果不存在，则推入
            if (!isSame) {
                userInfoArr.push({userId, userKey});
            }
        } else {
            userInfoArr = [{
                userId,
                userKey
            }];
        }

        this.userInfoArr = userInfoArr;
    }

    /**
     * @description 验证用户的唯一标识码
     * @param {number} userId 
     * @param {string} userKey 
     * @returns 通过返回true，否则返回false
     */
    static verifyUserKey(userId, userKey) {
        return this.userInfoArr.some(item => {
            if (item.userId == userId && item.userKey == userKey) {
                return true;
            }

            return false;
        });
    }

    /**
     * @description 创建token
     * @param {number} userId 用户id
     * @returns 返回token字符串，生成失败返回false
     */
    static createToken(userId) {
        let myToken = '';

        try {
            if (typeof userId !== 'number') {
                throw {
                    message: 'arguments type error'
                };
            }

            //生成一个用户标识码
            let num1 = Math.ceil(Math.random() * 10000 + 1000);
            let num2 = Math.floor(Math.random() * 1000 + 888);
            let userKey = 'wansongtao' + num1.toString() + num2.toString();

            //生成token并将用户id和用户唯一标识码存入其中，过期时间4小时
            myToken = this.jsonwebtoken.sign({
                userId,
                userKey
            }, this.key, {
                expiresIn: '4h'
            });

            this.userInfo(userId, userKey);
        } catch (ex) {
            console.error('Class Token => createToken(): ' + ex.message);
            myToken = false;
        } finally {
            return myToken;
        }
    }

    /**
     * @description 验证token
     * @param {string} tokens 生成的token字符串
     * @return 验证成功返回用户id，失败返回false(一般是超时)，如果是token错误(用户的标识码变了)返回-1
     */
    static verifyToken(tokens) {
        let data = '';

        try {
            if (typeof tokens !== 'string') {
                throw {
                    message: 'arguments type error.'
                };
            }

            data = this.jsonwebtoken.verify(tokens, this.key);
            let userKey = data.userKey;
            let userId = data.userId;

            if (this.verifyUserKey(userId, userKey)) {
                data = userId;
            }
            else {
                data = -1;
            }
        } catch (ex) {
            // if (ex.message == 'invalid signature') {
            //     //invalid signature token错误
            //     data = -1;
            // } else {
            //     //jwt expired token超时错误
            //     data = false;
            // }
            data = false;
            console.error('Class Token => verifyToken(): ' + ex.message);
        } finally {
            return data;
        }
    }
}

module.exports = Token;