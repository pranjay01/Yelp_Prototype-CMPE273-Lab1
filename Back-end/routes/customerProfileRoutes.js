/* eslint-disable no-console */
const express = require('express');

const Router = express.Router();
const {
  signup,
  getCustomerInfo,
  updateProfile,
  updateContactInfo,
  uploadCustomerProfilePic,
  generateOrder,
  submitReview,
  getEventList,
  registerForEvent,
  getRegisteredEventIds,
  getAllOrders,
} = require('../customer/customerProfile');
const { validateUser } = require('../Utils/passport');
const { login } = require('../common/loginLogout');

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
  results = await login(req, res, 'Customer');
  return results;
});

// Customer Logout
Router.post('/logout', async (req, res) => {
  console.log('Logout');
  req.logout();
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('User Logout Successful');
  return res;
});

Router.get('/getCustomerInfo', validateUser, async (req, res) => {
  console.log('getBasicInfo');
  let results = null;
  results = await getCustomerInfo(req, res);
  return results;
});

Router.put('/updateProfile', validateUser, async (req, res) => {
  console.log('updateProfile');
  let results = null;
  results = await updateProfile(req.body, res);
  return results;
});

Router.post('/updateContactInfo', validateUser, async (req, res) => {
  console.log('updateContactInfo');
  let results = null;
  results = await updateContactInfo(req, res);
  return results;
});

// Upload profile pic to s3 bucket
Router.post('/uploadCustomerProfilePic', validateUser, async (req, res) => {
  console.log('uploadCustomerProfilePic');
  let results = null;
  results = await uploadCustomerProfilePic(req, res);
  return results;
});

Router.post('/generateOrder', validateUser, async (req, res) => {
  console.log('generateOrder');
  let results = null;
  results = await generateOrder(req, res);
  return results;
});

Router.post('/submitReview', validateUser, async (req, res) => {
  console.log('submitReview');
  let results = null;
  results = await submitReview(req, res);
  return results;
});

// Fetch Events
Router.get('/getEventList', validateUser, async (req, res) => {
  console.log('Fetch Events');
  let results = null;
  results = await getEventList(req, res);
  return results;
});

Router.post('/registerForEvent', validateUser, async (req, res) => {
  console.log('registerForEvent');
  let results = null;
  results = await registerForEvent(req, res);
  return results;
});

Router.get('/getRegisteredEventIds', validateUser, async (req, res) => {
  console.log('getRegisteredEventIds');
  let results = null;
  results = await getRegisteredEventIds(req, res);
  return results;
});

Router.get('/getAllOrders', validateUser, async (req, res) => {
  console.log('getAllOrders');
  let results = null;
  results = await getAllOrders(req, res);
  return results;
});

module.exports = Router;
