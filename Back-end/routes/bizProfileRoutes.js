/* eslint-disable no-console */
const express = require('express');

const signup = require('../restaurant/restaurantProfile');

const { login, logout } = require('../common/loginLogout');

const Router = express.Router();

// Restaurant signup
Router.post('/signup', async (req, res) => {
  console.log('Signup if unique email, otherwise return email already exist');
  let results = null;
  results = await signup(req.body, res);
  return results;
});

// Restaurant Login
Router.post('/login', async (req, res) => {
  console.log('Login if correct credential');
  let results = null;
  results = await login(req, res, 2);
  return results;
});

// Restaurant Logout
Router.post('/logout', async (req, res) => {
  console.log('Logout');
  let results = null;
  results = await logout(req.body, res);
  return results;
});
module.exports = Router;
