"use strict";
const mysqlConnection = require("../mysqlConnection");
require("dotenv").config();
const bcrypt = require("bcrypt");
//2 is for enum value restauarnt

let checkEmailExists = async (email) => {
  const verifyEmailExist = "CALL getEmail(?,?)";

  let connection = await mysqlConnection();
  let [results, fields] = await connection.query(verifyEmailExist, [email, 2]);

  connection.end();
  console.log(results);
  if (results[0].length == 0) {
    return true;
  } else {
    return false;
  }
};

let signup = async (restaurant, response) => {
  let {
    Email,
    Password,
    Name,
    Country_ID,
    State_ID,
    City,
    Zip,
    Street,
    Country_Code,
    Phone_no,
  } = restaurant;
  if (await checkEmailExists(Email)) {
    try {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(hashedPassword);
      const signupQuery = "CALL resturantSignup(?,?,?,?,?,?,?,?,?,?)";

      let connection = await mysqlConnection();
      let { _results } = await connection.query(signupQuery, [
        Email,
        hashedPassword,
        Name,
        Number(Country_ID),
        Number(State_ID),
        City,
        Number(Zip),
        Street,
        Number(Country_Code),
        Number(Phone_no),
      ]);
      connection.end();
      console.log(_results);
      response.writeHead(200, {
        "Content-Type": "text/plain",
      });
      response.end("User Created");
      return response;
    } catch (error) {
      response.writeHead(500, {
        "Content-Type": "text/plain",
      });
      response.end("Network error");
      return response;
    }
  } else {
    response.writeHead(401, {
      "Content-Type": "text/plain",
    });
    response.end("Email Already Exists");
    return response;
  }
};
// }

module.exports = signup;
