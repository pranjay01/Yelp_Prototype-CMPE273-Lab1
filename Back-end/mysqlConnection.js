if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mysql = require("mysql2/promise");

var mysqlConnection = async () => {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pranjay@01",
    database: "Yelp_Prototype",
    multipleStatements: true,
    port: 3307,
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
