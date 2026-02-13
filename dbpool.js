require('dotenv').config();
const mysql = require('mysql2/promise'); // MySQL Dependency

// Information for sever hosting MySQL.
const Host = process.env.DBH; // Address of server.
const User = process.env.DBU; // Database Username.
const Password = process.env.DBP; // Database Password.
const Database = process.env.DBN; // Name of Database.
const Port = process.env.DBHP // Port for server if being used on local Network.

// Allows multiple users to access database at once.
const pool = mysql.createPool({
    host: Host,
    port: Port,
    user: User,
    password: Password,
    database: Database,
    waitForConnections: true,
    connectionLimit: 20, // simultaneous connections.
    maxIdle: 20, // connections allowed to idle.
    idleTimeout: 30000, // ms before timeout.
    queueLimit: 0 // unlimited queue size.
});

// Allows for use in "index.js".
module.exports = pool;