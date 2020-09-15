if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mysql = require("mysql2/promise");

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const db = process.env.MYSQL_DB;
const port = process.env.MYSQL_PORT;

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

var mysqlConnection = async () => {
  return mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db,
    multipleStatements: true,
    port: port,
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
