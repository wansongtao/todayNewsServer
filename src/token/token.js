/**
 * @description token类
 * @author wansongtao
 * @date 2020-11
 */
class Token {
    static jsonwebtoken = require('jsonwebtoken');

    /**
     * @description 生成key值
     * @returns 返回一个独一无二的key值
     */
    static key () {
        let num1 = Math.ceil(Math.random() * 10000 + 1000);
        let num2 = Math.floor(Math.random() * 1000 + 888);

        return 'wansongtao' + num1.toString() + num2.toString();
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
    
            //生成token并将用户id存入其中，过期时间4小时
            myToken = this.jsonwebtoken.sign({
                userId
            }, this.key(), {
                expiresIn: '4h'
            });
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
     * @return 验证成功返回用户id，失败返回false，如果是token错误返回0
     */
    static verifyToken(tokens) {
        let data = '';

        try {
            if (typeof tokens !== 'string') {
                throw {
                    message: 'arguments type error.'
                };
            }
    
            data = this.jsonwebtoken.verify(tokens, this.key());
            data = data.userId;  
        } catch (ex) {
            if (ex.message == 'invalid signature') {
                //invalid signature token错误
                data = 0;
            }
            else {
                //jwt expired token超时错误
                data = false;
            }
            
            console.error('Class Token => verifyToken(): ' + ex.message);
        } finally {
            return data;
        }
    }
}

module.exports = Token;