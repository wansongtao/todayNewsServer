/**
 * @description 数据库类
 * @author wansongtao
 * @date 2020-11
 */
class Database {
    static mysql = require('mysql');

    /**
     * @description 连接池对象
     */
    static pool = this.mysql.createPool({
        connectionLimit: 88,
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'todaynews'
    });

    /**
     * @description 验证参数
     * @param {*} resolve 期约对象的解决状态
     * @param {*} reject 期约对象的拒绝状态
     * @param {string} queryStr 要验证的sql语句
     * @param {Array} data 要验证的参数 Array type
     */
    static _verifyParamsArr_(resolve, reject, queryStr, data) {
        if (typeof queryStr !== 'string' || !(data instanceof Array)) {
            //参数错误期约转换为拒绝状态，直接运行catch()方法返回拒绝理由
            reject('arguments type error');
        }

        //参数初步正确，运行then方法
        resolve();
    }

    /**
     * @description 验证参数
     * @param {*} resolve 期约对象的解决状态
     * @param {*} reject 期约对象的拒绝状态
     * @param {string} queryStr 要验证的sql语句
     * @param {object} data 要验证的参数 object
     */
    static _verifyParamsObj_(resolve, reject, queryStr, data) {
        if (typeof queryStr !== 'string' || !(data instanceof Object)) {
            //参数错误期约转换为拒绝状态，直接运行catch()方法返回拒绝理由
            reject('arguments type error');
        }

        //参数初步正确，运行then方法
        resolve();
    }

    /**
     * @description 从连接池里获取连接
     * @returns 返回一个期约对象，失败 reject(false)，成功 resolve(connection)
     * 即失败转换为拒绝状态并返回false，成功转换为解决状态并返回一个连接
     */
    static _getPool_() {
        return new Promise((resolve, reject) => {
            //从连接池里获取连接
            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error('Class Database => _getPool()_: ', err.stack);

                    //获取连接失败，直接转换为拒绝状态并返回false值
                    reject(false);
                }

                //获取连接成功，转换为解决状态，继续运行下一个then方法
                resolve(conn);
            });
        });
    }

    /**
     * @description 使用数据库连接执行查询操作
     * @param {object} conn 数据库连接
     * @param {*} queryStr 查询字符串
     * @param {*} data 要插入查询字符串中的值
     * @returns 返回一个期约对象，查询成功返回结果 resolve(result)，失败返回false reject(false)
     */
    static _selectData_(conn, queryStr, data) {
        return new Promise((resolve, reject) => {
            conn.query(queryStr, data, (err, result, field) => {
                conn.release(); //查询完毕释放连接

                if (err) {
                    console.error('Class Database => _selectData_(): ', err.stack);

                    //查询错误，转换为拒绝状态并返回false
                    reject(false);
                }

                //查询成功，转换为解决状态并返回结果
                resolve(result);
            });
        });
    }

    /**
     * @description 使用数据库连接执行修改/删除/插入操作
     * @param {object} conn 数据库连接
     * @param {*} queryStr sql语句
     * @param {*} data 要插入sql语句中的值
     * @returns 返回一个期约对象，操作成功返回结果 resolve(true)，失败返回 reject(false)
     */
    static _changeData_(conn, queryStr, data) {
        return new Promise((resolve, reject) => {
            conn.query(queryStr, data, (err, result, field) => {
                conn.release(); //释放连接

                if (err) {
                    console.error('Class Database => _changeData_(): ', err.stack);
                    reject(false);
                }

                //判断表是否发送了变化
                result.affectedRows > 0 ? resolve(true) : reject(false);
            });
        });
    }

    /**
     * @description 在数据库中查询数据
     * @param {string} queryStr sql语句，例如：'select * from useraccount where userName = ?'
     * @param {Array} data 要替代占位符(?)的值， [userName]
     * @returns 返回一个期约对象，查询成功返回结果，否则返回false
     */
    static async query(queryStr, data = []) {
        return new Promise((resolve, reject) => {
                //如果转换为拒绝状态，将直接执行catch方法
                this._verifyParamsArr_(resolve, reject, queryStr, data);
            })
            .then(() => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
                return this._getPool_();
            })
            .then((conn) => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
                return this._selectData_(conn, queryStr, data);
            })
            .catch((err) => {
                //参数错误，返回false
                console.error(`Class Database => query(): ${err}`);
                return false;
            });
    }

    /**
     * @description 向数据库中插入值
     * @param {string} queryStr sql语句，例如：'insert into tablename set ?'
     * @param {object} data 要替代占位符(?)的值，{userName, userPwd}
     * mysql模块会自动转换 => insert into table (userName, userPwd) values(userName, userPwd)
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static async insert(queryStr, data = {}) {
        return new Promise((resolve, reject) => {
                //如果转换为拒绝状态，将直接执行catch方法
                this._verifyParamsObj_(resolve, reject, queryStr, data);
            })
            .then(() => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
                return this._getPool_();
            })
            .then((conn) => {
                return this._changeData_(conn, queryStr, data);
            })
            .catch((err) => {
                console.error(`Class Database => insert(): ${err}`);
                return false;
            });
    }

    /**
     * @description 修改数据
     * @param {string} queryStr sql语句，例如：'update tablename set columnName = ? where columnName = ?'
     * @param {Array} data 要替代占位符(?)的值，[userName, userId]
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static async update(queryStr, data = []) {
        return new Promise((resolve, reject) => {
                this._verifyParamsArr_(resolve, reject, queryStr, data);
            })
            .then(() => {
                return this._getPool_();
            })
            .then((conn) => {
                return this._changeData_(conn, queryStr, data);
            })
            .catch((err) => {
                console.error(`Class Database => update(): ${err}`);
                return false;
            });
    }

    /**
     * @description 删除数据
     * @param {string} queryStr sql语句，例如：'delete form tablename where columnname = ?'
     * @param {Array} data 要替代占位符(?)的值，[1001]
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static async delete(queryStr, data = []) {
        return new Promise((resolve, reject) => {
                this._verifyParamsArr_(resolve, reject, queryStr, data);
            })
            .then(() => {
                return this._getPool_();
            })
            .then(conn => {
                return this._changeData_(conn, queryStr, data);
            })
            .catch(err => {
                console.error(`Class Database => delete(): ${err}`);
                return false;
            });
    }

    /**
     * @description 用户注册使用事务向两个表里插入数据
     * @param {string} queryStr sql语句，例如：'insert into tablename set ?'
     * @param {object} data 要插入占位符中的值，{userName, userPwd}
     * @param {string} nickName 用户昵称
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static async register(queryStr, data = {}, nickName) {
        return new Promise((resolve, reject) => {
                if (typeof queryStr !== 'string' || !(data instanceof Object) || typeof nickName !== 'string') {
                    reject('arguments type error');
                }
                resolve();
            })
            .then(() => {
                return this._getPool_();
            })
            .then(conn => {
                return new Promise((resolve, reject) => {
                    //开始事务
                    conn.beginTransaction(err => {
                        if (err) {
                            console.error('Class Database => register() => beginTransaction(): ', err.stack);
                            reject(false);
                            return;
                        }

                        //向用户账号表插入数据
                        conn.query(queryStr, data, (err, result, field) => {
                            if (err) {
                                console.error('Class Database => register() => conn.query(1): ', err.stack);
                                reject(false);
                                return conn.rollback(); //事务回滚
                            }

                            //插入成功后会返回插入行的id
                            let userId = result.insertId;

                            //向用户详情表插入数据
                            conn.query('insert into userdetails set ?', {
                                userId,
                                nickName
                            }, (err, result, field) => {
                                if (err) {
                                    console.error('Class Database => register() => conn.query(2): ', err.stack);
                                    reject(false);
                                    return conn.rollback(); //事务回滚
                                }

                                conn.commit(err => {
                                    if (err) {
                                        console.error('Class Database => register() => conn.commit(): ', err.stack);
                                        reject(false);
                                        return conn.rollback(); //事务回滚
                                    }

                                    resolve(true);
                                });
                            });
                        });
                    });
                });
            })
            .catch(err => {
                console.error(`Class Database => register(): ${err}`);
                return false;
            });
    }
}

module.exports = Database;