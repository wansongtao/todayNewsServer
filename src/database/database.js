/**
 * @description 数据库模块
 * @author wansongtao
 * @date 2020-11
 */

const DATABASE = {};

DATABASE.mysql = require('mysql');

/**
 * @description 创建数据库连接池
 */
DATABASE.createPool = DATABASE.mysql.createPool({
    connectionLimit: 88,
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'todaynews'
});

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
            DATABASE.createPool.getConnection((err, conn) => {
                if (err) {
                    console.error('DATABASEJS.query =>getConnection(): ', err.stack);
                    resolve(false);
                } else {
                    conn.query(queryStr, data, (err, result, field) => {
                        conn.release(); //查询完毕释放连接

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

/**
 * @description 向数据库中插入值
 * @param {string} queryStr 查询字符串 'insert into tablename set ?'
 * @param {object} data 要插入占位符中的值，{userName, userPwd}
 * @returns 返回一个期约对象，成功返回true，失败返回false
 */
DATABASE.insert = (queryStr, data = {}) => {
    return new Promise((resolve, reject) => {
        if (typeof queryStr !== 'string' || !(data instanceof Object)) {
            console.error('insert(): arguments type error');
            resolve(false);
        } else {
            DATABASE.createPool.getConnection((err, conn) => {
                if (err) {
                    console.error('insert() => getConnection(): ', err.stack);
                    resolve(false);
                } else {
                    conn.query(queryStr, data, (err, result, field) => {
                        conn.release(); //释放连接

                        if (err) {
                            console.error('DATABASEJS.insert =>conn.query(): ', err.stack);
                            resolve(false);
                        } else {
                            result.affectedRows > 0 ? resolve(true) : resolve(false);
                        }

                    });
                }
            });
        }
    });
};

/**
 * @description 修改表数据
 * @param {string} queryStr 查询字符串 'update tablename set columnName = ? where columnName = ?'
 * @param {Array} data 要插入占位符中的值，{userName, userId}
 * @returns 返回一个期约对象，成功返回true，失败返回false
 */
DATABASE.update = (queryStr, data = []) => {
    return new Promise((resolve, reject) => {
        if (typeof queryStr !== 'string' || !(data instanceof Array)) {
            console.error('update(): arguments type error');
            resolve(false);
            return;
        }

        DATABASE.createPool.getConnection((err, conn) => {
            if (err) {
                console.error('update() => getConnection(): ', err.stack);
                resolve(false);
                return;
            }

            conn.query(queryStr, data, (err, result, field) => {
                conn.release();

                if (err) {
                    console.error('update() => query(): ', err.stack);
                    resolve(false);
                    return;
                }
                
                if(result.affectedRows >= 1) {
                    resolve(true);
                }else {
                    resolve(false);
                }
            });
        });
    });
};

/**
 * @description 用户注册使用事务向两个表里插入数据
 * @param {string} queryStr 查询字符串 'insert into tablename set ?'
 * @param {object} data 要插入占位符中的值，{userName, userPwd}
 * @param {string} nickName 用户昵称
 * @returns 返回一个期约对象，成功返回true，失败返回false
 */
DATABASE.register = (queryStr, data = {}, nickName) => {
    return new Promise((resolve, reject) => {
        if (typeof queryStr !== 'string' || !(data instanceof Object) || typeof nickName !== 'string') {
            console.error('register(): arguments type error');
            resolve(false);
            return;
        }

        DATABASE.createPool.getConnection((err, conn) => {
            if (err) {
                console.error('register() => getConnection(): ', err.stack);
                resolve(false);
                return;
            }

            //事务开始
            conn.beginTransaction(err => {
                if (err) {
                    console.error('register() => beginTransaction(): ', err.stack);
                    resolve(false);
                    return;
                }

                //向用户账号表插入数据
                conn.query(queryStr, data, (err, result, field) => {
                    if (err) {
                        console.error('register() => conn.query(1): ', err.stack);
                        resolve(false);
                        return conn.rollback(); //事务回滚
                    }

                    let userId = result.insertId;

                    //向用户详情表插入数据
                    conn.query('insert into userdetails set ?', {userId, nickName}, (err, result, field) => {
                        if (err) {
                            console.error('register() => conn.query(2): ', err.stack);
                            resolve(false);
                            return conn.rollback(); //事务回滚
                        }

                        conn.commit(err => {
                            if (err) {
                                console.error('register() => conn.commit(): ', err.stack);
                                resolve(false);
                                return conn.rollback(); //事务回滚
                            }

                            resolve(true);
                        });
                    });
                });
            });
        });
    });
};

module.exports = DATABASE;