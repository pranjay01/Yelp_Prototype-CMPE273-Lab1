/* eslint-disable no-console */
const express = require('express');

const Router = express.Router();
const signup = require('../customer/customerProfile');
const login = require('../common/loginLogout');

// Customer signup
Router.post('/signup', async (req, res) => {
  console.log('Signup if unique email, otherwise return email already exist');
  let results = null;
  results = await signup(req.body, res);
  return results;
});

// Customer Login
Router.post('/login', async (req, res) => {
  console.log('Login if correct credential');
  let results = null;
  results = await login(req, res, 1);
  return results;
});
module.exports = Router;