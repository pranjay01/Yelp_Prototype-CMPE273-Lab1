/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserSignup = require('../Models/UserSignup');

const { auth } = require('../Utils/passport');

auth();

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

module.exports = { login };
