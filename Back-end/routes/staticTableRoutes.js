/* eslint-disable no-console */
const express = require('express');

const {
  getSignupMasterData,
  getSignupMasterDataCustomer,
  getCusinesForMenu,
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

module.exports = Router;
