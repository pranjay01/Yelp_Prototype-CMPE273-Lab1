/* eslint-disable func-names */
/* eslint-disable no-console */
const express = require('express');

const Router = express.Router();
const kafka = require('../kafka/client');
const config = require('../config');

// Insert STatic Master Data
Router.post('/country', async (req, res) => {
  console.log('Upload Country Data');
  const data = {
    api: 'country',
    data: req.body,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await uploadCountryData(req, res);
  // return results;
});

Router.post('/state', async (req, res) => {
  console.log('Upload State Data');
  const data = {
    api: 'state',
    data: req.body,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await uploadStateData(req, res);
  // return results;
});

Router.post('/gender', async (req, res) => {
  console.log('Upload Gender Data');
  const data = {
    api: 'gender',
    data: req.body,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await uploadGenderData(req, res);
  // return results;
});

Router.post('/cuisine', async (req, res) => {
  console.log('Upload Gender Data');
  const data = {
    api: 'cuisine',
    data: req.body,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await uploadCuisineData(req, res);
  // return results;
});
// Restaurant signup //Kafka Implemented
Router.get('/signupMasterData', async (req, res) => {
  console.log('Get master data for restaurant signup');
  const data = {
    api: 'signupMasterData',
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    // console.log('in result');
    // console.log(results);
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');
      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
    return res;
  });
  // let results = null;
  // results = await getSignupMasterData(res);
  // return results;
});

// Food Menu //Kafka Implemented
Router.get('/getCusinesForMenu', async (req, res) => {
  console.log('Get Cusines for menu');
  const data = {
    api: 'getCusinesForMenu',
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await getCusinesForMenu(res);
  // return results;
});
// kafka Implemented
Router.get('/getSearchStrings', async (req, res) => {
  console.log('getSearchStrings');
  const data = {
    api: 'getSearchStrings',
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await getSearchStrings(req, res);
  // return results;
});
// kafka Implemented
Router.get('/fetchRestaurantResults', async (req, res) => {
  console.log('fetchRestaurantResults');
  const data = {
    api: 'fetchRestaurantResults',
    url: req.url,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await fetchRestaurantResults(req, res);
  // return results;
});

// Kafka Implemented
Router.get('/menuFetch', async (req, res) => {
  console.log('menuFetch');
  const data = {
    api: 'menuFetch',
    url: req.url,
  };
  kafka.make_request(config.kafkaresturanttopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await fetchMenu(req, res);
  // return results;
});
// kafka Implemented
Router.get('/fetchRestaurantProfileForCustomer', async (req, res) => {
  console.log('fetchRestaurantProfileForCustomer');
  const data = {
    api: 'fetchRestaurantProfileForCustomer',
    url: req.url,
  };
  kafka.make_request(config.kafkastatictopic, data, function (err, results) {
    if (err) {
      console.log('Inside err');
      res.status(500);
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
      res.end();
    } else {
      console.log('inside else of request');

      res.status(results.status);
      // res.json(results.data);
      res.end(results.data);
    }
  });
  // let results = null;
  // results = await fetchRestaurantProfileForCustomer(req, res);
  // return results;
});

module.exports = Router;
