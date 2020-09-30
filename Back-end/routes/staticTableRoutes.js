/* eslint-disable no-console */
const express = require('express');

const {
  getSignupMasterData,
  getSignupMasterDataCustomer,
  getCusinesForMenu,
  getDeliverStatus,
  getSearchStrings,
  fetchRestaurantResults,
} = require('../staticTables/staticTableFetch');

const Router = express.Router();

// Restaurant signup
Router.get('/signupMasterData', async (req, res) => {
  console.log('Get master data for restaurant signup');
  let results = null;
  results = await getSignupMasterData(res);
  return results;
});

// Customer Signup
Router.get('/signupMasterDataCustomer', async (req, res) => {
  console.log('Get master data for customer signup');
  let results = null;
  results = await getSignupMasterDataCustomer(res);
  return results;
});

// Food Menu
Router.get('/getCusinesForMenu', async (req, res) => {
  console.log('Get Cusines for menu');
  let results = null;
  results = await getCusinesForMenu(res);
  return results;
});

// Delivery Statuses
Router.get('/getDeliverStatus', async (req, res) => {
  console.log('Get Cusines for menu');
  let results = null;
  results = await getDeliverStatus(res);
  return results;
});

Router.get('/getSearchStrings', async (req, res) => {
  console.log('getSearchStrings');
  let results = null;
  results = await getSearchStrings(req, res);
  return results;
});

Router.get('/fetchRestaurantResults', async (req, res) => {
  console.log('fetchRestaurantResults');
  let results = null;
  results = await fetchRestaurantResults(req, res);
  return results;
});

module.exports = Router;
