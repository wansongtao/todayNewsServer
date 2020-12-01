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
     * @description 在数据库中查询数据
     * @param {string} queryStr 查询字符串
     * @param {Array} data 要插入查询字符串中的值
     * @returns 返回一个期约对象，查询成功返回结果，否则返回false
     */
    static query(queryStr, data = []) {
        return new Promise(resolve => {
            if (typeof queryStr !== 'string' || !(data instanceof Array)) {
                console.error('Class Database => query(): arguments type error');
                resolve(false);
            } else {
                //从连接池里获取连接
                this.pool.getConnection((err, conn) => {
                    if (err) {
                        console.error('Class Database => query() => getConnection(): ', err.stack);
                        resolve(false);
                        return;
                    }

                    conn.query(queryStr, data, (err, result, field) => {
                        conn.release(); //查询完毕释放连接

                        if (err) {
                            console.error('Class Database => query() =>conn.query(): ', err.stack);
                            result = false;
                        }
                        
                        resolve(result);
                    });
                });
            }
        });
    }

    /**
     * @description 向数据库中插入值
     * @param {string} queryStr 查询字符串 'insert into tablename set ?'
     * @param {object} data 要插入占位符中的值，{userName, userPwd}
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static insert(queryStr, data = {}) {
        return new Promise(resolve => {
            if (typeof queryStr !== 'string' || !(data instanceof Object)) {
                console.error('insert(): arguments type error');
                resolve(false);
            } else {
                this.pool.getConnection((err, conn) => {
                    if (err) {
                        console.error('Class Database => insert() => getConnection(): ', err.stack);
                        resolve(false);
                    } else {
                        conn.query(queryStr, data, (err, result, field) => {
                            conn.release(); //释放连接

                            if (err) {
                                console.error('Class Database => insert() =>conn.query(): ', err.stack);
                                resolve(false);
                            } else {
                                //判断是否插入了数据
                                result.affectedRows > 0 ? resolve(true) : resolve(false);
                            }

                        });
                    }
                });
            }
        });
    }

    /**
     * @description 修改表数据
     * @param {string} queryStr 查询字符串 'update tablename set columnName = ? where columnName = ?'
     * @param {Array} data 要插入占位符中的值，{userName, userId}
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static update(queryStr, data = []) {
        return new Promise(resolve => {
            if (typeof queryStr !== 'string' || !(data instanceof Array)) {
                console.error('Class Database => update(): arguments type error');
                resolve(false);
                return;
            }

            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error('Class Database => update() => getConnection(): ', err.stack);
                    resolve(false);
                    return;
                }

                conn.query(queryStr, data, (err, result, field) => {
                    conn.release();

                    if (err) {
                        console.error('Class Database => update() => conn.query(): ', err.stack);
                        resolve(false);
                        return;
                    }

                    // 修改的行数是否超过一行，即是否修改了数据库里的数据
                    result.affectedRows >= 1 ? resolve(true) : resolve(false);
                });
            });
        });
    }

    /**
     * @description 删除数据
     * @param {string} queryStr 查询字符串 'delete form tablename where columnname = ?'
     * @param {Array} data 要插入占位符中的值，[1001]
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static delete(queryStr, data = []) {
        return new Promise(resolve => {
            if (typeof queryStr !== 'string' || !(data instanceof Array)) {
                console.error('Class Database => delete(): arguments type error');
                resolve(false);
                return;
            }

            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error('Class Database => delete() => getConnection(): ', err.stack);
                    resolve(false);
                    return;
                }

                conn.query(queryStr, data, (err, result, field) => {
                    if (err) {
                        console.error('Class Database => delete() => query(): ', err.stack);
                        resolve(false);
                        return;
                    }

                    //判断是否删除成功
                    result.affectedRows > 0 ? resolve(true) : resolve(false);
                });
            });
        });
    }

    /**
     * @description 用户注册使用事务向两个表里插入数据
     * @param {string} queryStr 查询字符串 'insert into tablename set ?'
     * @param {object} data 要插入占位符中的值，{userName, userPwd}
     * @param {string} nickName 用户昵称
     * @returns 返回一个期约对象，成功返回true，失败返回false
     */
    static register(queryStr, data = {}, nickName) {
        return new Promise(resolve => {
            if (typeof queryStr !== 'string' || !(data instanceof Object) || typeof nickName !== 'string') {
                console.error('Class Database => register(): arguments type error');
                resolve(false);
                return;
            }
    
            this.pool.getConnection((err, conn) => {
                if (err) {
                    console.error('Class Database => register() => getConnection(): ', err.stack);
                    resolve(false);
                    return;
                }
    
                //事务开始
                conn.beginTransaction(err => {
                    if (err) {
                        console.error('Class Database => register() => beginTransaction(): ', err.stack);
                        resolve(false);
                        return;
                    }
    
                    //向用户账号表插入数据
                    conn.query(queryStr, data, (err, result, field) => {
                        if (err) {
                            console.error('Class Database => register() => conn.query(1): ', err.stack);
                            resolve(false);
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
                                resolve(false);
                                return conn.rollback(); //事务回滚
                            }
    
                            conn.commit(err => {
                                if (err) {
                                    console.error('Class Database => register() => conn.commit(): ', err.stack);
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
    }
}

module.exports = Database;