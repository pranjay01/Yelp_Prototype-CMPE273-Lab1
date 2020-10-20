/* eslint-disable no-console */
const express = require('express');

const {
  uploadCountryData,
  uploadStateData,
  uploadGenderData,
  getSignupMasterData,
  uploadCuisineData,
  getCusinesForMenu,
  getSearchStrings,
  fetchRestaurantResults,
  fetchRestaurantProfileForCustomer,
} = require('../staticTables/staticTableFetch');

const { fetchMenu } = require('../restaurant/restaurantProfile');

const Router = express.Router();

// Insert STatic Master Data
Router.post('/country', async (req, res) => {
  console.log('Upload Country Data');
  let results = null;
  results = await uploadCountryData(req, res);
  return results;
});

Router.post('/state', async (req, res) => {
  console.log('Upload State Data');
  let results = null;
  results = await uploadStateData(req, res);
  return results;
});

Router.post('/gender', async (req, res) => {
  console.log('Upload Gender Data');
  let results = null;
  results = await uploadGenderData(req, res);
  return results;
});

Router.post('/cuisine', async (req, res) => {
  console.log('Upload Gender Data');
  let results = null;
  results = await uploadCuisineData(req, res);
  return results;
});
// Restaurant signup
Router.get('/signupMasterData', async (req, res) => {
  console.log('Get master data for restaurant signup');
  let results = null;
  results = await getSignupMasterData(res);
  return results;
});

// Food Menu
Router.get('/getCusinesForMenu', async (req, res) => {
  console.log('Get Cusines for menu');
  let results = null;
  results = await getCusinesForMenu(res);
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

Router.get('/menuFetch', async (req, res) => {
  console.log('menuFetch');
  let results = null;
  results = await fetchMenu(req, res);
  return results;
});

Router.get('/fetchRestaurantProfileForCustomer', async (req, res) => {
  console.log('fetchRestaurantProfileForCustomer');
  let results = null;
  results = await fetchRestaurantProfileForCustomer(req, res);
  return results;
});

module.exports = Router;
