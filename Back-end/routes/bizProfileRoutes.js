/* eslint-disable no-console */
const express = require('express');

const {
  signup,
  getRestaurantInfo,
  updateRestaurantProfile,
  fetchMenu,
  insertFood,
  deleteFoodItem,
  updateFoodItem,
  fetchReviews,
  getOrderDetails,
  // orderFetch,
  updateDeliveryStatus,
  createNewEvent,
  getEventList,
  getCustomerList,
  uploadRestaurantProfilePic,
  uploadPicToMulter,
  uploadFoodImage,
  getCustomerCompleteProfileForRestaurant,
} = require('../restaurant/restaurantProfile');

const { validateUser } = require('../Utils/passport');

const { login } = require('../common/loginLogout');

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
  results = await login(req, res, 'Restaurant');
  return results;
});

// Restaurant Logout
Router.post('/logout', async (req, res) => {
  console.log('Logout');
  req.logout();
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end('User Logout Successful');
  return res;
});

// Restaurant get Profile Info for Home page
Router.get('/homeProfile', validateUser, async (req, res) => {
  console.log('Get basic Restaurant Profile');
  let results = null;
  results = await getRestaurantInfo(req, res);
  return results;
});

// Restaurant Update Profile
Router.post('/updateRestaurantProfile', validateUser, async (req, res) => {
  console.log('Update Restaurant Profile');
  let results = null;
  results = await updateRestaurantProfile(req.body, res);
  return results;
});

Router.post('/uploadRestaurantProfilePic', validateUser, async (req, res) => {
  console.log('uploadRestaurantProfilePic');
  let results = null;
  results = await uploadRestaurantProfilePic(req, res);
  return results;
});

Router.post('/uploadPicToMulter', validateUser, async (req, res) => {
  console.log('uploadPicToMulter');
  let results = null;
  results = await uploadPicToMulter(req, res);
  return results;
});

// Fetch menu of asked category
Router.get('/menuFetch', validateUser, async (req, res) => {
  console.log('Fetch Menu');
  let results = null;
  results = await fetchMenu(req, res);
  return results;
});

Router.post('/uploadFoodImage', validateUser, async (req, res) => {
  console.log('uploadFoodImage');
  let results = null;
  results = await uploadFoodImage(req, res);
  return results;
});

// nsert New Food Item
Router.post('/insertFood', validateUser, async (req, res) => {
  console.log('Insert New Food Item');
  let results = null;
  results = await insertFood(req, res);
  return results;
});

// Delete Food Item
Router.post('/deleteFoodItem', validateUser, async (req, res) => {
  console.log('Delete Food Item');
  let results = null;
  results = await deleteFoodItem(req, res);
  return results;
});

// Update Food Item
Router.post('/updateFoodItem', validateUser, async (req, res) => {
  console.log('Update Food Item');
  let results = null;
  results = await updateFoodItem(req, res);
  return results;
});

// Fetch reviews
Router.get('/fetchReviews', validateUser, async (req, res) => {
  console.log('Fetch Menu');
  let results = null;
  results = await fetchReviews(req, res);
  return results;
});

// Fetch Orders
Router.get('/getOrderDetails', validateUser, async (req, res) => {
  console.log('Fetch Orders');
  let results = null;
  results = await getOrderDetails(req, res);
  return results;
});

// // Fetch particukar order detail
// Router.get('/orderFetch', async (req, res) => {
//   console.log('Fetch OrderDetail');
//   let results = null;
//   results = await orderFetch(req, res);
//   return results;
// });

// Update Delivery Status
Router.post('/updateDeliveryStatus', validateUser, async (req, res) => {
  console.log('Update Delivery Status');
  let results = null;
  results = await updateDeliveryStatus(req, res);
  return results;
});

// Update Delivery Status
Router.post('/createNewEvent', validateUser, async (req, res) => {
  console.log('Create new Event');
  let results = null;
  results = await createNewEvent(req, res);
  return results;
});

// Fetch Events
Router.get('/getEventList', validateUser, async (req, res) => {
  console.log('Fetch Events');
  let results = null;
  results = await getEventList(req, res);
  return results;
});

// Get Customer Register to event
Router.get('/getCustomerList', validateUser, async (req, res) => {
  console.log('Fetch Events');
  let results = null;
  results = await getCustomerList(req, res);
  return results;
});

Router.get('/getCustomerCompleteProfile', validateUser, async (req, res) => {
  console.log('getContactInfo');
  let results = null;
  results = await getCustomerCompleteProfileForRestaurant(req, res);
  return results;
});
module.exports = Router;
