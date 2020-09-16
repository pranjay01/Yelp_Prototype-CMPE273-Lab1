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

// var mysqlConnection = async () => {
//   return mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Pranjay@01",
//     database: "Yelp_Prototype",
//     multipleStatements: true,
//     port: 3307,
//   });
// };

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

// mysqlConnection.connect((err) => {
//   if (!err) {
//     console.log("Connected", err);
//   } else {
//     console.log("Connection Failed", err);
//   }
// });

module.exports = mysqlConnection;
