/**
 * @description 数据库模块
 * @author wansongtao
 * @date 2020-11
 */

const DATABASE = {};

DATABASE.mysql = require('mysql');

/**
 * @description 创建数据库连接池
 * @returns 返回数据库连接池对象
 */
DATABASE.createPool = () => {
    return DATABASE.mysql.createPool({
        connectionLimit: 5,
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'todaynews'
    });
};

/**
 * @description 在数据库中查询数据
 * @param {string} queryStr 查询字符串
 * @param {Array} data 要插入查询字符串中的值
 * @returns 返回一个期约对象，查询成功返回结果，否则返回false
 */
DATABASE.query = (queryStr, data = []) => {
    return new Promise((resolve, reject) => {
        if (typeof queryStr !== 'string' || !(data instanceof Array)) {
            console.error('query(): arguments type error');
            resolve(false);
        } else {
            DATABASE.createPool().getConnection((err, conn) => {
                if (err) {
                    console.error('DATABASEJS.query =>getConnection(): ', err.stack);
                    resolve(false);
                } else {
                    conn.query(queryStr, data, (err, result, field) => {
                        conn.release();  //查询完毕释放连接

                        if (err) {
                            console.error('DATABASEJS.query =>conn.query(): ', err.stack);
                            result = false;
                        }
                        
                        resolve(result);
                    });
                }
            });
        }
    });
};

module.exports = DATABASE;