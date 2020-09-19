/* eslint-disable no-console */
const express = require('express');

const {
  getSignupMasterData,
  getSignupMasterDataCustomer,
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
module.exports = Router;
