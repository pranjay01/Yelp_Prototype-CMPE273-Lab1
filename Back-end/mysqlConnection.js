if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const mysql = require('mysql2/promise');

/** Local DB */
const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const db = process.env.MYSQL_DB;
const port = process.env.MYSQL_PORT;

/* RDBMS */
// const host = process.env.MYSQL_HOST_RDS;
// const user = process.env.MYSQL_USER_RDS;
// const password = process.env.MYSQL_PASSWORD_RDS;
// const db = process.env.MYSQL_DB_RDS;
// const port = process.env.MYSQL_PORT_RDS;

const mysqlConnection = async () => {
  return mysql.createConnection({
    host,
    user,
    password,
    database: db,
    multipleStatements: true,
    port,
  });
};

// const pool = mysql.createPool({
//   connectionLimit: 50,
//   host,
//   user,
//   password,
//   database: db,
//   multipleStatements: true,
//   port,
// });

// const mysqlConnection = async () => {
//   return pool.getConnection();
// };

// // const mysqlConnection = function (callback) {
//   pool.getConnection(function (err, connection) {
//     callback(err, connection);
//   });
// };

module.exports = mysqlConnection;
