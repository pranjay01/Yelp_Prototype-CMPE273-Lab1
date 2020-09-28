/* eslint-disable no-console */
const express = require('express');

const Router = express.Router();
const {
  signup,
  getBasicInfo,
  getDataForCustomerUpdateProfile,
  updateProfile,
  getContactInfo,
  updateContactInfo,
  getCustomerCompleteProfile,
} = require('../customer/customerProfile');
const { login, logout } = require('../common/loginLogout');

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

// Customer Logout
Router.post('/logout', async (req, res) => {
  console.log('Logout');
  let results = null;
  results = await logout(req.body, res);
  return results;
});

Router.get('/getBasicInfo', async (req, res) => {
  console.log('getBasicInfo');
  let results = null;
  results = await getBasicInfo(req, res);
  return results;
});

Router.get('/getDataForCustomerUpdateProfile', async (req, res) => {
  console.log('getDataForCustomerUpdateProfile');
  let results = null;
  results = await getDataForCustomerUpdateProfile(req, res);
  return results;
});

Router.put('/updateProfile', async (req, res) => {
  console.log('updateProfile');
  let results = null;
  results = await updateProfile(req, res);
  return results;
});

Router.get('/getContactInfo', async (req, res) => {
  console.log('getContactInfo');
  let results = null;
  results = await getContactInfo(req, res);
  return results;
});

Router.put('/updateContactInfo', async (req, res) => {
  console.log('updateContactInfo');
  let results = null;
  results = await updateContactInfo(req, res);
  return results;
});

Router.get('/getCustomerCompleteProfile', async (req, res) => {
  console.log('getContactInfo');
  let results = null;
  results = await getCustomerCompleteProfile(req, res);
  return results;
});
module.exports = Router;
