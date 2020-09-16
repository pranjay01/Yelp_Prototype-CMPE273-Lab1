/* eslint-disable no-console */
const bcrypt = require('bcrypt');

const mysqlConnection = require('../mysqlConnection');

require('dotenv').config();

const checkEmailExists = async (email) => {
  const verifyEmailExist = 'CALL getEmail(?,?)';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(verifyEmailExist, [email, 1]);

  connection.end();
  console.log(results);
  if (results[0].length === 0) {
    return true;
  }
  return false;
};

const signup = async (customer, response) => {
  // eslint-disable-next-line camelcase
  const { Email, Password, First_Name, Last_Name, Gender } = customer;
  if (await checkEmailExists(Email)) {
    try {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(hashedPassword);
      const signupQuery = 'CALL customerSignup(?,?,?,?,?)';

      const connection = await mysqlConnection();
      const { _results } = await connection.query(signupQuery, [
        Email,
        hashedPassword,
        // eslint-disable-next-line camelcase
        First_Name,
        // eslint-disable-next-line camelcase
        Last_Name,
        Number(Gender),
      ]);
      connection.end();
      console.log(_results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('User Created');
      return response;
    } catch (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Network error');
      return response;
    }
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Email Already Exists');
    return response;
  }
};
// }

module.exports = signup;
