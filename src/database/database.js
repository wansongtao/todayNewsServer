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
     * @description 验证参数类型是否正确
     * @param {Array} params 要验证的参数数组,格式：[{param: value, type: 'String'}]
     *  数据类型大写，例如：String、Array、Number、Object（仅支持验证这四种类型）
     * @returns 所有参数验证类型正确后返回true，错误返回false
     */
    static _verifyParams_(paramArr = []) {
        try {
            let typeArr = ['String', 'Array', 'Object', 'Number'];

            return paramArr.every(val => {
                //val: {param: value, type: 'String'} 判断类型是否在范围内
                if (typeArr.indexOf(val.type) === -1) {
                    console.error('Class Database => _verifyParams_(): type out of range');
                    return false;
                }

                //通过构造函数验证类型
                return val.param.constructor.toString().indexOf(val.type) != -1;
            });
        } catch (ex) {
            console.error('Class Database => _verifyParams_(): ', ex.message);
            return false;
        }
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
            try {
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
            } catch (ex) {
                //可能的错误，参数conn不是一个数据库连接
                console.error('Class Database => _selectData_(): ', ex.message);
                reject(false);
            }
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
            try {
                conn.query(queryStr, data, (err, result, field) => {
                    conn.release(); //释放连接

                    if (err) {
                        console.error('Class Database => _changeData_(): ', err.stack);
                        reject(false);
                    }

                    //判断表是否发送了变化
                    result.affectedRows > 0 ? resolve(true) : reject(false);
                });
            } catch (ex) {
                //可能的错误，参数conn不是一个数据库连接
                console.error('Class Database => _changeData_(): ', ex.message);
                reject(false);
            }
        });
    }

    /**
     * @description 使用事务模式对数据库执行增删改
     * @param {*} conn 开始了事务的数据库连接
     * @param {*} queryStr sql语句
     * @param {*} data 要插入sql语句中的值
     * @returns 返回一个期约对象，操作成功返回结果 resolve(result)，失败返回 reject(false)并回滚事务
     */
    static _transactionChangeData_(conn, queryStr, data) {
        return new Promise((resolve, reject) => {
            try {
                conn.query(queryStr, data, (err, result, field) => {
                    if (err) {
                        console.error('Class Database => _transactionChangeData_() => query(): ', err.stack);
                        reject(false);
                        conn.rollback(); //事务回滚
                    }

                    resolve(result);
                });
            } catch (ex) {
                console.error('Class Database => _transactionChangeData_(): ', ex.message);
                reject(false);
            }
        });
    }

    /**
     * @description 提交事务
     * @param {*} conn 一个开始了事务的数据库连接
     * @returns 返回一个期约对象，操作成功返回结果 resolve(true))，失败返回 reject(false)并回滚事务
     */
    static _commit_(conn) {
        return new Promise((resolve, reject) => {
            try {
                conn.commit(err => {
                    if (err) {
                        console.error('Class Database => _commit_() => conn.commit(): ', err.stack);
                        reject(false);
                        conn.rollback(); //事务回滚
                    }

                    resolve(true);
                });
            } catch (ex) {
                console.error('Class Database => _commit_(): ', ex.message);
                reject(false);
            }
        });
    }

    /**
     * @description 开始一个事务
     * @param {*} conn 数据库连接
     * @returns 返回一个期约对象，操作成功返回一个开始了事务的数据库连接 resolve(conn)，
     * 失败返回 reject(false)
     */
    static async _transaction_(conn) {
        return new Promise((resolve, reject) => {
            try {
                conn.beginTransaction(err => {
                    if (err) {
                        //开始一个事务失败，期约转换为拒绝状态
                        console.error('Class Database => _transaction_(): ', err.stack);
                        reject(false);
                    }

                    resolve(conn);
                });
            } catch (ex) {
                console.error('Class Database => _transaction_(): ', ex.message);
                reject(false);
            }
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
                let paramArr = [{
                    param: queryStr,
                    type: 'String'
                }, {
                    param: data,
                    type: 'Array'
                }];

                //如果转换为拒绝状态，将直接执行catch方法
                //参数验证正确后，转换为解决状态执行then方法；错误，转换为拒绝状态执行catch方法
                this._verifyParams_(paramArr) === true ? resolve() : reject('arguments type error');
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
                let paramArr = [{
                    param: queryStr,
                    type: 'String'
                }, {
                    param: data,
                    type: 'Object'
                }];

                //参数验证正确后，转换为解决状态执行then方法；错误，转换为拒绝状态执行catch方法
                this._verifyParams_(paramArr) === true ? resolve() : reject('argument type error');
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
                let paramArr = [{
                    param: queryStr,
                    type: 'String'
                }, {
                    param: data,
                    type: 'Array'
                }];

                //参数验证正确后，转换为解决状态执行then方法；错误，转换为拒绝状态执行catch方法
                this._verifyParams_(paramArr) === true ? resolve() : reject('arguments type error');
            })
            .then(() => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
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
                let paramArr = [{
                    param: queryStr,
                    type: 'String'
                }, {
                    param: data,
                    type: 'Array'
                }];

                //参数验证正确后，转换为解决状态执行then方法；错误，转换为拒绝状态执行catch方法
                this._verifyParams_(paramArr) === true ? resolve() : reject('arguments type error');
            })
            .then(() => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
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
        /**
         * @description 保存数据库连接
         */
        let connection = {};

        return new Promise((resolve, reject) => {
                let paramArr = [{
                    param: queryStr,
                    type: 'String'
                }, {
                    param: data,
                    type: 'Object'
                }, {
                    param: nickName,
                    type: 'String'
                }];

                //参数验证正确后，转换为解决状态执行then方法；错误，转换为拒绝状态执行catch方法
                this._verifyParams_(paramArr) === true ? resolve() : reject('arguments type error');
            })
            .then(() => {
                //如果返回的期约为拒绝状态，将不会执行后面的then方法而是直接返回值
                return this._getPool_();
            })
            .then(conn => {
                //开始一个事务
                connection = conn;
                return this._transaction_(connection);
            })
            .then(connection => {
                //向用户账号表插入数据
                return this._transactionChangeData_(connection, queryStr, data);
            })
            .then((result) => {
                //插入成功后会返回插入行的id
                let userId = result.insertId;

                //向用户详情表插入数据
                return this._transactionChangeData_(connection, 'insert into userdetails set ?', {
                    userId,
                    nickName
                });
            })
            .then(() => {
                //提交事务
                return this._commit_(connection);
            })
            .catch(err => {
                console.error(`Class Database => register(): ${err}`);
                return false;
            });
    }

}

module.exports = Database;