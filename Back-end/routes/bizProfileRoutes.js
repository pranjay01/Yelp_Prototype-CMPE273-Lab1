/* eslint-disable func-names */
/* eslint-disable no-console */
const express = require('express');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { checkAuth } = require('../Utils/passport');

const Router = express.Router();
const kafka = require('../kafka/client');
const config = require('../config');

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
require('dotenv').config();
const { auth } = require('../Utils/passport');

const multipleUpload = multer({
  storage: multerS3({
    s3: s3Storage,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // eslint-disable-next-line func-names
    // eslint-disable-next-line object-shorthand
    key: function (req, file, cb) {
      const folderName = 'yelpPrototype-restaurant-';
      cb(null, `${folderName}/${Date.now().toString()}${file.originalname}`);
    },
  }),
}).single('file');

// Restaurant signup //Kafka Implemented
Router.post('/signup', async (req, res) => {
  console.log('Signup if unique email, otherwise return email already exist');
  const data = {
    api: 'signup',
    data: req.body,
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
    return res;
  });
});

// Restaurant Login //Kafka Implemented
Router.post('/login', async (req, res) => {
  auth();
  console.log('Login if correct credential');
  const data = {
    api: 'login',
    data: req.body,
    Role: 'Restaurant',
  };
  kafka.make_request(config.kafkacommontopic, data, function (err, results) {
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
  // results = await login(req, res, 'Restaurant');
  // return results;
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

// Restaurant get Profile Info for Home page //Kafka Implemented
Router.get('/homeProfile', checkAuth, async (req, res) => {
  console.log('Get basic Restaurant Profile');
  const data = {
    api: 'homeProfile',
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
    return res;
  });
  // let results = null;
  // results = await getRestaurantInfo(req, res);
  // return results;
});

// Restaurant Update Profile //Kafka Implemented
Router.post('/updateRestaurantProfile', checkAuth, async (req, res) => {
  console.log('Update Restaurant Profile');
  const data = {
    api: 'updateRestaurantProfile',
    data: req.body,
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
  // results = await updateRestaurantProfile(req.body, res);
  // return results;
});

Router.post('/uploadRestaurantProfilePic', checkAuth, async (req, res) => {
  console.log('uploadRestaurantProfilePic');
  await multipleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json({ status: 400, error: err.message });
    } else if (err) {
      res.json({ status: 400, error: err.message });
    } else {
      const data = {
        api: 'uploadRestaurantProfilePic',
        data: req.body,
        url: req.file.location,
      };
      kafka.make_request(config.kafkaresturanttopic, data, function (error, results) {
        if (error) {
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
    }
  });
  /*
  const data = {
    api: 'uploadRestaurantProfilePic',
    data: req.body,
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
  */
  // let results = null;
  // results = await uploadRestaurantProfilePic(req, res);
  // return results;
});

Router.post('/uploadPicToMulter', checkAuth, async (req, res) => {
  try {
    // console.log(req.body);
    multipleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({ status: 400, error: err.message });
      } else if (err) {
        res.json({ status: 400, error: err.message });
      } else {
        // console.log(req.file.location);
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        // console.log('data:', data);
        res.end(req.file.location);
      }
    });
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
});

// Fetch menu of asked category //Kafka Implemented
Router.get('/menuFetch', checkAuth, async (req, res) => {
  console.log('Fetch Menu');
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
  // let results = null;
  // results = await fetchMenu(req, res);
  // return results;
});

Router.post('/uploadFoodImage', checkAuth, async (req, res) => {
  try {
    multipleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({ status: 400, error: err.message });
      } else if (err) {
        res.json({ status: 400, error: err.message });
      } else {
        // console.log(req.file.location);

        res.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        res.end(req.file.location);
      }
    });
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
});

// nsert New Food Item //Kafka Implemented
Router.post('/insertFood', checkAuth, async (req, res) => {
  console.log('Insert New Food Item');
  const data = {
    api: 'insertFood',
    data: req.body,
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
      res.end(results.data);
    }
  });
  // // let results = null;
  // // results = await insertFood(req, res);
  // return results;
});

// Delete Food Item //Kafka Implemented
Router.post('/deleteFoodItem', checkAuth, async (req, res) => {
  console.log('Delete Food Item');
  const data = {
    api: 'deleteFoodItem',
    data: req.body,
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
  // results = await deleteFoodItem(req, res);
  // return results;
});

// Update Food Item //Kafka Implemented
Router.post('/updateFoodItem', checkAuth, async (req, res) => {
  console.log('Update Food Item');
  const data = {
    api: 'updateFoodItem',
    data: req.body,
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
  // results = await updateFoodItem(req, res);
  // return results;
});

// Fetch reviews //Kafka Implemented
Router.get('/fetchReviews', checkAuth, async (req, res) => {
  console.log('fetchReviews');
  const data = {
    api: 'fetchReviews',
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
  // results = await fetchReviews(req, res);
  // return results;
});

// Fetch Orders //Kafka Implemented
Router.get('/getOrderDetails', checkAuth, async (req, res) => {
  console.log('Fetch Orders');
  const data = {
    api: 'getOrderDetails',
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
  // results = await getOrderDetails(req, res);
  // return results;
});

// Update Delivery Status //Kafka Implemented
Router.post('/updateDeliveryStatus', checkAuth, async (req, res) => {
  console.log('Update Delivery Status');
  const data = {
    api: 'updateDeliveryStatus',
    data: req.body,
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
  // results = await updateDeliveryStatus(req, res);
  // return results;
});

// Update Delivery Status //Kafka Implemented
Router.post('/createNewEvent', checkAuth, async (req, res) => {
  console.log('Create new Event');
  const data = {
    api: 'createNewEvent',
    data: req.body,
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
  // results = await createNewEvent(req, res);
  // return results;
});

// Fetch Events //Kafka Implemented
Router.get('/getEventList', checkAuth, async (req, res) => {
  console.log('Fetch Events');
  const data = {
    api: 'getEventList',
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
  // results = await getEventList(req, res);
  // return results;
});

// Get Customer Register to event //Kafka Implemented
Router.get('/getCustomerList', checkAuth, async (req, res) => {
  console.log('Fetch Events');
  const data = {
    api: 'getCustomerList',
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
  // results = await getCustomerList(req, res);
  // return results;
});

// Kafka Implemented
Router.get('/getCustomerCompleteProfile', checkAuth, async (req, res) => {
  console.log('getContactInfo');
  const data = {
    api: 'getCustomerCompleteProfile',
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
  // results = await getCustomerCompleteProfileForRestaurant(req, res);
  // return results;
});

// MessageSent
Router.post('/sendMessage', checkAuth, async (req, res) => {
  console.log('sendMessage');
  const data = {
    api: 'sendMessage',
    data: req.body,
  };
  console.log('data:,', req.body);
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
});

Router.get('/getMessages', checkAuth, async (req, res) => {
  console.log('getMessages');
  const data = {
    api: 'getMessages',
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
});

Router.get('/getAllMessages', checkAuth, async (req, res) => {
  console.log('getAllMessages');
  const data = {
    api: 'getAllMessages',
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
});

module.exports = Router;
