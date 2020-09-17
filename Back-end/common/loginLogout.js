/* eslint-disable no-console */
const bcrypt = require('bcrypt');

const randomToken = require('randomstring');

const mysqlConnection = require('../mysqlConnection');
require('dotenv').config();

const LoggedTokens = [];

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
        LoggedTokens.push({
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

module.exports = login;