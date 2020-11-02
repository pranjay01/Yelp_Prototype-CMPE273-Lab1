/* eslint-disable func-names */
/* eslint-disable no-console */
const express = require('express');

const Router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
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
      console.log(req.body);
      const folderName = 'yelpPrototype-customer-';
      console.log('Multer Called', folderName);
      cb(null, `${folderName}/${Date.now().toString()}${file.originalname}`);
    },
  }),
}).single('file');

const { checkAuth } = require('../Utils/passport');

// Customer signup // kafka Implemented
Router.post('/signup', async (req, res) => {
  console.log('Signup if unique email, otherwise return email already exist');
  const data = {
    api: 'signup',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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

// Customer Login // kafka Implemented
Router.post('/login', async (req, res) => {
  auth();
  console.log('Login if correct credential');
  const data = {
    api: 'login',
    data: req.body,
    Role: 'Customer',
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

  // console.log('Login if correct credential');
  // let results = null;
  // results = await login(req, res, 'Customer');
  // return results;
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

// kafka Implemented
Router.get('/getCustomerInfo', checkAuth, async (req, res) => {
  console.log('Get basic Customer Profile');
  const data = {
    api: 'getCustomerInfo',
    url: req.url,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // console.log('getBasicInfo');
  // let results = null;
  // results = await getCustomerInfo(req, res);
  // return results;
});
// kafka Implemented
Router.put('/updateProfile', checkAuth, async (req, res) => {
  console.log('updateProfile');
  const data = {
    api: 'updateProfile',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await updateProfile(req.body, res);
  // return results;
});
// kafka Implemented
Router.post('/updateContactInfo', checkAuth, async (req, res) => {
  console.log('updateContactInfo');
  const data = {
    api: 'updateContactInfo',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await updateContactInfo(req, res);
  // return results;
});

// Upload profile pic to s3 bucket // kafka Implemented
Router.post('/uploadCustomerProfilePic', checkAuth, async (req, res) => {
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
// kafka Implemented
Router.post('/generateOrder', checkAuth, async (req, res) => {
  console.log('generateOrder');
  const data = {
    api: 'generateOrder',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await generateOrder(req, res);
  // return results;
});
// kafka Implemented
Router.post('/submitReview', checkAuth, async (req, res) => {
  console.log('submitReview');
  const data = {
    api: 'submitReview',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await submitReview(req, res);
  // return results;
});

// Fetch Events // kafka Implemented
Router.get('/getEventList', checkAuth, async (req, res) => {
  console.log('Fetch Events');
  const data = {
    api: 'getEventList',
    url: req.url,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await getEventList(req, res);
  // return results;
});

// kafka Implemented
Router.post('/registerForEvent', checkAuth, async (req, res) => {
  console.log('registerForEvent');
  const data = {
    api: 'registerForEvent',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await registerForEvent(req, res);
  // return results;
});
// kafka Implemented
Router.get('/getAllOrders', checkAuth, async (req, res) => {
  console.log('getAllOrders');
  const data = {
    api: 'getAllOrders',
    url: req.url,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
  // results = await getAllOrders(req, res);
  // return results;
});

Router.get('/getCustomers', checkAuth, async (req, res) => {
  console.log('getCustomers');
  const data = {
    api: 'getCustomers',
    url: req.url,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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

Router.post('/followUser', checkAuth, async (req, res) => {
  console.log('followUser');
  const data = {
    api: 'followUser',
    data: req.body,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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

Router.get('/getAllMessages', checkAuth, async (req, res) => {
  console.log('getAllMessages');
  const data = {
    api: 'getAllMessages',
    url: req.url,
  };
  kafka.make_request(config.kafkacustomertopic, data, function (err, results) {
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
