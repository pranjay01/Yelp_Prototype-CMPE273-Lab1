/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');

// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
const url = require('url');
const jwt = require('jsonwebtoken');

const moment = require('moment');

// const { BUCKET_NAME } = process.env;
// const s3Storage = new AWS.S3({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
// });
require('dotenv').config();

const UserSignup = require('../Models/UserSignup');

const Customer = require('../Models/Customer');

const Reviews = require('../Models/Review');

const Orders = require('../Models/Order');

const Restaurant = require('../Models/Restaurant');

const Event = require('../Models/Event');

async function handle_request(msg, callback) {
  const response = {};
  switch (msg.api) {
    case 'signup': {
      try {
        const customer = msg.data;
        UserSignup.findOne({ Email: customer.Email, Role: 'Customer' }, async (error, user) => {
          if (error) {
            response.status = 500;
            response.data = 'Network Error';
            callback(null, response);
          } else if (user) {
            response.status = 400;
            response.data = 'Email Already Exists';

            callback(null, response);
          } else {
            const hashedPassword = await bcrypt.hash(customer.Password, 10);
            const newUser = new UserSignup({
              ...customer,
              Role: 'Customer',
              Password: hashedPassword,
            });
            newUser.save((err, data) => {
              if (err) {
                response.status = 500;
                response.data = 'Network Error';
                callback(null, response);
              } else {
                // moment('America/Los_Angeles');
                // JoinDate = JoinDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
                const newCustomer = new Customer({
                  ...customer,
                  CustomerID: data._id,
                  JoinDate: moment().format(),
                });
                newCustomer.save((err1) => {
                  if (err1) {
                    callback(err1, null);
                  } else {
                    response.status = 201;
                    response.data = 'User Created';
                    callback(null, response);
                  }
                });
              }
            });
          }
        });
      } catch (error) {
        response.status = 500;
        response.data = 'Network Error';
        callback(null, response);
      }
      break;
    }
    case 'getCustomerInfo': {
      try {
        const { _id } = url.parse(msg.url, true).query;

        const customer = await Customer.findOne({ CustomerID: _id }).exec();

        const reviewCount = await Reviews.find({ CustomerID: _id }).countDocuments();
        const results = {
          customer,
          reviewCount,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
        // response.writeHead(200, {
        //   'Content-Type': 'application/json',
        // });
        // response.end(JSON.stringify(results));
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'updateProfile': {
      try {
        const customer = msg.data;
        Customer.updateOne({ CustomerID: customer.CustomerID }, { ...customer }, async (error) => {
          if (error) {
            callback(error, null);
          } else {
            // console.log(data);
            response.status = 204;
            response.data = 'Profile Updated Successfully';
            callback(null, response);
          }
        });
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'updateContactInfo': {
      const { Password, customerInfo } = msg.data;
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
                  callback(error, null);
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
                response.status = 200;
                response.data = `JWT ${token}`;
                callback(null, response);
              }
            }
          );
        } else {
          response.status = 401;
          response.data = 'Incorrect Password';
          callback(null, response);
        }
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'generateOrder': {
      try {
        const newOrder = new Orders({
          ...msg.data,
        });
        newOrder.save((err) => {
          if (err) {
            callback(err, null);
          } else {
            response.status = 201;
            response.data = 'Order Created Successfully';
            callback(null, response);
          }
        });
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'submitReview': {
      try {
        const newReview = new Reviews({
          ...msg.data,
        });
        await Restaurant.updateOne(
          { RestaurantID: msg.data.RestaurantID },
          { ReviewCounts: msg.data.ReviewCounts, TotalRating: msg.data.TotalRating }
        ).exec();
        newReview.save((err, result) => {
          if (err) {
            callback(err, null);
          } else {
            response.status = 201;
            response.data = JSON.stringify(result);
            callback(null, response);
          }
        });
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'getEventList': {
      try {
        const { sortValue, selectedPage, sortOrder, CustomerID } = url.parse(msg.url, true).query;
        let EventList = [];
        let eventCount = 0;
        switch (sortValue) {
          case 'upcoming':
            EventList = await Event.find({ EventDate: { $gte: new Date() } })
              .sort({ EventDate: sortOrder })
              .skip(selectedPage * 3)
              .limit(3)
              .exec();
            eventCount = await Event.find({ EventDate: { $gte: new Date() } }).countDocuments();
            break;
          case 'registered':
            EventList = await Event.find({
              'RegisteredCustomers.CustomerID': CustomerID,
              EventDate: { $gte: new Date() },
            })
              .sort({ EventDate: sortOrder })
              .skip(selectedPage * 3)
              .limit(3)
              .exec();
            eventCount = await Event.find({
              'RegisteredCustomers.CustomerID': CustomerID,
              EventDate: { $gte: new Date() },
            }).countDocuments();
            break;
          default:
            EventList = await Event.find({
              EventName: { $regex: `${sortValue}`, $options: 'i' },
            })
              .sort({ EventDate: sortOrder })
              .skip(selectedPage * 3)
              .limit(3)
              .exec();
            eventCount = await Event.find({
              EventName: { $regex: `${sortValue}`, $options: 'i' },
            }).countDocuments();
            break;
        }

        const results = {
          EventList,
          eventCount,
        };

        response.status = 201;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'registerForEvent': {
      const { eventId, RegisteredCustomer } = msg.data;

      try {
        await Event.updateOne(
          { _id: eventId },
          { $push: { RegisteredCustomers: RegisteredCustomer } }
        ).exec();
        await Customer.updateOne(
          { CustomerID: RegisteredCustomer.CustomerID },
          { $push: { RegisteredEvents: eventId } }
        ).exec();
        response.status = 200;
        response.data = 'Event Registered Succesfully';
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'getAllOrders': {
      try {
        const { CustomerID, selectedPage, sortOrder, filter1, filter2 } = url.parse(
          msg.url,
          true
        ).query;
        let OrderList = [];
        let orderCount = 0;
        if (filter1 !== 'All') {
          OrderList = await Orders.find({ CustomerID, OrderType: filter1, DeliveryStatus: filter2 })
            .sort({ OrderedDate: sortOrder })
            .skip(selectedPage * 3)
            .limit(3)
            .exec();
          orderCount = await Orders.find({
            CustomerID,
            OrderType: filter1,
            DeliveryStatus: filter2,
          }).countDocuments();
        } else {
          OrderList = await Orders.find({ CustomerID })
            .sort({ OrderedDate: sortOrder })
            .skip(selectedPage * 3)
            .limit(3)
            .exec();
          orderCount = await Orders.find({ CustomerID }).countDocuments();
        }
        const results = {
          OrderList,
          orderCount,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    default:
      break;
  }
}

/*
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
*/

/*
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
*/
// getCustomer Basic Info // MongoDB Implemented
/*
const getCustomerInfo = async (request, response) => {
  try {
    const { _id } = url.parse(request.url, true).query;

    const customer = await Customer.findOne({ CustomerID: _id }).exec();

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
*/
// Update Customer profile // MongoDB Implemented
/*
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
*/
/*
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
*/
/*
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
*/
/*
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
*/
// Submit Review //MongoDB Implemented
/*
const submitReview = async (request, response) => {
  try {
    const newReview = new Reviews({
      ...request.body,
    });
    await Restaurant.updateOne(
      { RestaurantID: request.body.RestaurantID },
      { ReviewCounts: request.body.ReviewCounts, TotalRating: request.body.TotalRating }
    ).exec();
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
*/
// fetch events fased on filter //MongoDB Implemented
/*
const getEventList = async (request, response) => {
  try {
    const { sortValue, selectedPage, sortOrder, CustomerID } = url.parse(request.url, true).query;
    let EventList = [];
    let eventCount = 0;
    switch (sortValue) {
      case 'upcoming':
        EventList = await Event.find({ EventDate: { $gte: new Date() } })
          .sort({ EventDate: sortOrder })
          .skip(selectedPage * 3)
          .limit(3)
          .exec();
        eventCount = await Event.find({ EventDate: { $gte: new Date() } }).countDocuments();
        break;
      case 'registered':
        EventList = await Event.find({
          'RegisteredCustomers.CustomerID': CustomerID,
          EventDate: { $gte: new Date() },
        })
          .sort({ EventDate: sortOrder })
          .skip(selectedPage * 3)
          .limit(3)
          .exec();
        eventCount = await Event.find({
          'RegisteredCustomers.CustomerID': CustomerID,
          EventDate: { $gte: new Date() },
        }).countDocuments();
        break;
      default:
        EventList = await Event.find({
          EventName: { $regex: `${sortValue}`, $options: 'i' },
        })
          .sort({ EventDate: sortOrder })
          .skip(selectedPage * 3)
          .limit(3)
          .exec();
        eventCount = await Event.find({
          EventName: { $regex: `${sortValue}`, $options: 'i' },
        }).countDocuments();
        break;
    }

    const results = {
      EventList,
      eventCount,
    };

    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    console.log(results);
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};
*/
// Submit Review //MongoDB IMplemented
/*
const registerForEvent = async (request, response) => {
  const { eventId, RegisteredCustomer } = request.body;

  try {
    await Event.updateOne(
      { _id: eventId },
      { $push: { RegisteredCustomers: RegisteredCustomer } }
    ).exec();
    await Customer.updateOne(
      { CustomerID: RegisteredCustomer.CustomerID },
      { $push: { RegisteredEvents: eventId } }
    ).exec();
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.end('Event Registered Succesfully');
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};
*/
// fetch events fased on filter //MongoDB Implemented
/*
const getAllOrders = async (request, response) => {
  try {
    const { CustomerID, selectedPage, sortOrder, filter1, filter2 } = url.parse(
      request.url,
      true
    ).query;
    let OrderList = [];
    let orderCount = 0;
    if (filter1 !== 'All') {
      OrderList = await Orders.find({ CustomerID, OrderType: filter1, DeliveryStatus: filter2 })
        .sort({ OrderedDate: sortOrder })
        .skip(selectedPage * 3)
        .limit(3)
        .exec();
      orderCount = await Orders.find({
        CustomerID,
        OrderType: filter1,
        DeliveryStatus: filter2,
      }).countDocuments();
    } else {
      OrderList = await Orders.find({ CustomerID })
        .sort({ OrderedDate: sortOrder })
        .skip(selectedPage * 3)
        .limit(3)
        .exec();
      orderCount = await Orders.find({ CustomerID }).countDocuments();
    }

    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    console.log(OrderList);
    const results = {
      OrderList,
      orderCount,
    };
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};
*/
exports.handle_request = handle_request;
