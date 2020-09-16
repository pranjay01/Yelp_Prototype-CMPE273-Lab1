/* eslint-disable no-else-return */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');

const randomToken = require('randomstring');

const restaurantLoggedTokens = [];

const mysqlConnection = require('../mysqlConnection');
require('dotenv').config();
// 2 is for enum value restauarnt

const checkEmailExists = async (email) => {
  const verifyEmailExist = 'CALL getEmail(?,?)';

  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(verifyEmailExist, [email, 2]);

  connection.end();
  console.log(results);
  if (results[0].length === 0) {
    return true;
  } else {
    return false;
  }
};

const signup = async (restaurant, response) => {
  const {
    Email,
    Password,
    Name,
    // eslint-disable-next-line camelcase
    Country_ID,
    // eslint-disable-next-line camelcase
    State_ID,
    City,
    Zip,
    Street,
    // eslint-disable-next-line camelcase
    Country_Code,
    // eslint-disable-next-line camelcase
    Phone_no,
  } = restaurant;
  if (await checkEmailExists(Email)) {
    try {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(hashedPassword);
      const signupQuery = 'CALL resturantSignup(?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      const { _results } = await connection.query(signupQuery, [
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
    response.writeHead(409, {
      'Content-Type': 'text/plain',
    });
    response.end('Email Already Exists');
    return response;
  }
};

const getEmailDetails = async (email, role) => {
  const getUserDetails = 'CALL getEmail(?,?)';

  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(getUserDetails, [email, role]);

  connection.end();
  console.log(results);
  return results[0];
};

const login = async (request, response, Role) => {
  const credentials = request.body;
  const { Email, Password } = credentials;
  const userDetails = await getEmailDetails(Email, Role);

  if (userDetails.length === 0) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Invalid Email id');
  } else {
    try {
      if (await bcrypt.compare(Password, userDetails[0].Password)) {
        const token = randomToken.generate();
        response.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
        response.cookie('userrole', userDetails[0].Role, {
          maxAge: 900000,
          httpOnly: false,
          path: '/',
        });
        restaurantLoggedTokens.push({
          userId: userDetails[0].Email,
          role: userDetails[0].Role,
          Token: token,
        });
        request.session.user = credentials.Email;
        response.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        response.end('Successful Login');
      } else {
        response.writeHead(401, {
          'Content-Type': 'text/plain',
        });
        response.end('Incorrect Password');
        // return response;
      }
    } catch (r) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Network error');
      // return response;
    }
  }
  return response;
};

module.exports = { signup, login };
