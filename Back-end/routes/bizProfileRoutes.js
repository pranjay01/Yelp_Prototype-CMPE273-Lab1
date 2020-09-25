/* eslint-disable no-console */
const express = require('express');

const {
  signup,
  getBasicInfo,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  fetchMenu,
  insertFood,
  deleteFoodItem,
  updateFoodItem,
  fetchReviews,
  getOrderDetailsNew,
  orderFetch,
  updateDeliveryStatus,
} = require('../restaurant/restaurantProfile');

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

// Restaurant get Profile Info for Home page
Router.get('/homeProfile', async (req, res) => {
  console.log('Get basic Restaurant Profile');
  let results = null;
  results = await getBasicInfo(req, res);
  return results;
});

// Restaurant get Profile Info for Profile page
Router.get('/restaurantCompleteProfile', async (req, res) => {
  console.log('Get basic Restaurant Profile');
  let results = null;
  results = await getRestaurantCompleteInfo(req, res);
  return results;
});

// Restaurant Update Profile
Router.post('/updateRestaurantProfile', async (req, res) => {
  console.log('Update Restaurant Profile');
  let results = null;
  results = await updateRestaurantProfile(req.body, res);
  return results;
});

// Fetch menu of asked category
Router.get('/menuFetch', async (req, res) => {
  console.log('Fetch Menu');
  let results = null;
  results = await fetchMenu(req, res);
  return results;
});

// nsert New Food Item
Router.post('/insertFood', async (req, res) => {
  console.log('Insert New Food Item');
  let results = null;
  results = await insertFood(req, res);
  return results;
});

// Delete Food Item
Router.post('/deleteFoodItem', async (req, res) => {
  console.log('Delete Food Item');
  let results = null;
  results = await deleteFoodItem(req, res);
  return results;
});

// Update Food Item
Router.post('/updateFoodItem', async (req, res) => {
  console.log('Update Food Item');
  let results = null;
  results = await updateFoodItem(req, res);
  return results;
});

// Fetch reviews
Router.get('/fetchReviews', async (req, res) => {
  console.log('Fetch Menu');
  let results = null;
  results = await fetchReviews(req, res);
  return results;
});

// Fetch Orders
Router.get('/getOrderDetailsNew', async (req, res) => {
  console.log('Fetch Orders');
  let results = null;
  results = await getOrderDetailsNew(req, res);
  return results;
});

// Fetch particukar order detail
Router.get('/orderFetch', async (req, res) => {
  console.log('Fetch OrderDetail');
  let results = null;
  results = await orderFetch(req, res);
  return results;
});

// Update Delivery Status
Router.post('/updateDeliveryStatus', async (req, res) => {
  console.log('Update Delivery Status');
  let results = null;
  results = await updateDeliveryStatus(req, res);
  return results;
});
module.exports = Router;
