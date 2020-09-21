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
          userID: userDetails[0].ID,
          userName: userDetails[0].Email,
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

const logout = async (body, response) => {
  let isTokenDeleted;
  // eslint-disable-next-line array-callback-return
  LoggedTokens.filter(function roleCheck(user) {
    if (user.Token === body.token && user.role === body.role) {
      LoggedTokens.splice(LoggedTokens.indexOf(user), 1);
      isTokenDeleted = true;
    }
  });

  if (isTokenDeleted) {
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.end('User Token Deleted');
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('User Token Not found');
    // return response;
  }
  return response;
};

const getUserIdFromToken = (token, userRole) => {
  let User = null;
  User = LoggedTokens.filter((user) => user.Token === token && user.role === userRole);
  console.log('User JSON: ', User);
  let userID = null;
  if (User) {
    console.log(User[0]);
    userID = User[0].userID;
  }
  return userID;
};

module.exports = { login, logout, getUserIdFromToken };
