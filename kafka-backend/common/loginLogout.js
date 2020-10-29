/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserSignup = require('../Models/UserSignup');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const { auth } = require('../../Back-end/Utils/passportold');

auth();

async function handle_request(msg, callback) {
  switch (msg.api) {
    case 'login': {
      const response = {};
      UserSignup.findOne({ Email: msg.data.Email, Role: msg.Role }, async (error, user) => {
        if (error) {
          response.status = 500;
          response.data = 'Error Occured';
          callback(null, response);
        }
        if (user && (await bcrypt.compare(msg.data.Password, user.Password))) {
          const payload = { _id: user._id, userrole: user.Role, email: user.Email };
          const token = jwt.sign(payload, process.env.SESSION_SECRET, {
            expiresIn: 1008000,
          });
          response.status = 200;
          response.data = `JWT ${token}`;

          callback(null, response);
        } else {
          response.status = 401;
          response.data = 'Invalid Credentials';

          callback(null, response);
        }
      });
      break;
    }
    case 'validate': {
      const { userId, role, email } = msg.data;
      await UserSignup.findOne({ _id: userId, Role: role, Email: email }, async (err, results) => {
        if (err) {
          callback(err, null);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, null);
        }
      });
      break;
    }
    default:
      break;
  }
}
/*
const login = async (request, response, Role) => {
  try {
    UserSignup.findOne({ Email: request.body.Email, Role }, async (error, user) => {
      if (error) {
        response.status(500).end('Error Occured');
      }
      if (user && (await bcrypt.compare(request.body.Password, user.Password))) {
        const payload = { _id: user._id, userrole: user.Role, email: user.Email };
        const token = jwt.sign(payload, process.env.SESSION_SECRET, {
          expiresIn: 1008000,
        });
        response.status(200).end(`JWT ${token}`);
      } else {
        response.status(401).end('Invalid Credentials');
      }
    });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
};
*/
exports.handle_request = handle_request;
