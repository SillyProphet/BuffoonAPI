require('dotenv').config();
const mysql = require('mysql2/promise');

const Host = process.env.DBH;
const User = process.env.DBU;
const Password = process.env.DBP;
const Database = process.env.DBN;
const Port = process.env.DBHP

const pool = mysql.createPool({
    host: Host,
    port: Port,
    user: User,
    password: Password,
    database: Database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
});

module.exports = pool;