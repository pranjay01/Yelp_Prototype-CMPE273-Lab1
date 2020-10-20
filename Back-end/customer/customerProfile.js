/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const jwt = require('jsonwebtoken');

const moment = require('moment');
const { getUserIdFromToken } = require('../common/loginLogout');
const mysqlConnection = require('../mysqlConnection');

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
require('dotenv').config();

const { getOrderList } = require('../restaurant/restaurantProfile');

const UserSignup = require('../Models/UserSignup');

const Customer = require('../Models/Customer');

const Reviews = require('../Models/Review');

const Orders = require('../Models/Order');

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

// MongoDB Implemented
const signup = async (customer, response) => {
  try {
    UserSignup.findOne({ Email: customer.Email, Role: 'Customer' }, async (error, user) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else if (user) {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        response.end('Email Already Exists');
      } else {
        const hashedPassword = await bcrypt.hash(customer.Password, 10);
        const newUser = new UserSignup({
          ...customer,
          Role: 'Customer',
          Password: hashedPassword,
        });
        newUser.save((err, data) => {
          if (err) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            response.end('Network Error');
          } else {
            // moment('America/Los_Angeles');
            // JoinDate = JoinDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
            const newCustomer = new Customer({
              ...customer,
              CustomerID: data._id,
              JoinDate: moment().format(),
            });
            newCustomer.save((err1, result) => {
              if (err1) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                response.end('Network Error');
              } else {
                response.writeHead(201, {
                  'Content-Type': 'text/plain',
                });
                response.end('User Created');
                console.log(result);
              }
            });
          }
        });
      }
    });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// getCustomer Basic Info // MongoDB Implemented
const getCustomerInfo = async (request, response) => {
  try {
    const { _id } = url.parse(request.url, true).query;

    const customer = await Customer.findOne({ CustomerID: _id }, { RegisteredEvents: 0 }).exec();

    const reviewCount = await Reviews.find({ CustomerID: _id }).countDocuments();
    const results = {
      customer,
      reviewCount,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// Update Customer profile // MongoDB Implemented
const updateProfile = async (customer, response) => {
  try {
    Customer.updateOne({ CustomerID: customer.CustomerID }, { ...customer }, async (error) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        // console.log(data);
        response.writeHead(204, {
          'Content-Type': 'text/plain',
        });
        response.end('Profile Updated Successfully');
      }
    });
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

const uploadCustomerProfilePic = async (req, res) => {
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
};

// Update Customer Contact Information //MongoDB Implemented
const updateContactInfo = async (request, response) => {
  const { Password, customerInfo } = request.body;

  try {
    const user = await UserSignup.findOne(
      { _id: customerInfo.CustomerID },
      { Password: 1, Role: 1 }
    ).exec();
    let token;
    if (await bcrypt.compare(Password, user.Password)) {
      if (customerInfo.NewEmail !== customerInfo.Email) {
        const payload = {
          _id: customerInfo.CustomerID,
          userrole: user.Role,
          email: customerInfo.NewEmail,
        };

        token = await jwt.sign(payload, process.env.SESSION_SECRET, {
          expiresIn: 1008000,
        });
        UserSignup.updateOne(
          { _id: customerInfo.CustomerID },
          { Email: customerInfo.NewEmail },
          async (error) => {
            if (error) {
              response.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              response.end('Network Error');
            }
          }
        );
      }
      Customer.updateOne(
        { CustomerID: customerInfo.CustomerID },
        { PhoneNo: customerInfo.PhoneNo, Email: customerInfo.NewEmail },
        async (error) => {
          if (error) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            response.end('Network Error');
          } else {
            // console.log(data);
            response.writeHead(200, {
              'Content-Type': 'text/plain',
            });
            response.end(`JWT ${token}`);
          }
        }
      );
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Incorrect Password');
    }
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// Generate Order // MongoDB Implemented
const generateOrder = async (request, response) => {
  // const { RestroId, Price, foodCart, address, deliveryMode, token, userrole } = request.body;

  try {
    const newOrder = new Orders({
      ...request.body,
    });
    newOrder.save((err, result) => {
      if (err) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        response.writeHead(201, {
          'Content-Type': 'text/plain',
        });
        response.end('Order Created Successfully');
        console.log(result);
      }
    });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// Submit Review
const submitReview = async (request, response) => {
  try {
    const newReview = new Reviews({
      ...request.body,
    });
    newReview.save((err, result) => {
      if (err) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        response.writeHead(201, {
          'Content-Type': 'text/plain',
        });
        response.end(JSON.stringify(result));
        console.log(result);
      }
    });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// fetch events fased on filter
const getEventList = async (request, response) => {
  try {
    const { sortValue } = url.parse(request.url, true).query;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getEventListForCustomerQuery = 'CALL getEventListForCustomer(?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getEventListForCustomerQuery, [
        userID,
        sortValue,
      ]);
      connection.end();
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// Submit Review //MongoDB IMplemented
const registerForEvent = async (request, response) => {
  const { eventId, token, userrole } = request.body;

  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const registerForEventQuery = 'CALL registerForEvent(?,?)';

      const connection = await mysqlConnection();

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(registerForEventQuery, [cusID, eventId]);
      connection.end();
      console.log(results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Review Created Successfully');
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// fetch events fased on filter
const getRegisteredEventIds = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getRegisteredEventIdsQuery = 'CALL getRegisteredEventIds(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getRegisteredEventIdsQuery, [userID]);
      connection.end();
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// fetch events fased on filter
const getAllOrders = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getAllOrdersPlacedByCustomerQuery = 'CALL getAllOrdersPlacedByCustomer(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getAllOrdersPlacedByCustomerQuery, userID);
      connection.end();
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      response.end('Invalid User');
    }
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// Fetch details of particular order
const orderDetailsFetch = async (request, response) => {
  const { orderID, restroId } = url.parse(request.url, true).query;
  const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (userID) {
    const orderFetchQuery = 'CALL orderFetch(?,?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(orderFetchQuery, [restroId, orderID]);
    let order = results[0][0].Ordered_Dishes;
    order = order.split(';');
    const appetizers = results[1];
    const beverages = results[2];
    const salads = results[3];
    const desserts = results[4];
    const mainCourse = results[5];
    const orders = await getOrderList(order, appetizers, desserts, beverages, salads, mainCourse);

    console.log(orders);

    connection.end();
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.end(JSON.stringify(orders));
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Invalid User');
  }
  return response;
};

module.exports = {
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
  orderDetailsFetch,
};
