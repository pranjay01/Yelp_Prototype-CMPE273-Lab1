/* eslint-disable camelcase */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const { getUserIdFromToken } = require('../common/loginLogout');
const mysqlConnection = require('../mysqlConnection');

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
require('dotenv').config();

const { getOrderList } = require('../restaurant/restaurantProfile');

const checkEmailExists = async (email) => {
  const verifyEmailExist = 'CALL getEmail(?,?)';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(verifyEmailExist, [email, 1]);

  connection.end();
  console.log(results);
  if (results[0].length === 0) {
    return true;
  }
  return false;
};

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

const signup = async (customer, response) => {
  // eslint-disable-next-line camelcase
  const { Email, Password, First_Name, Last_Name, Gender } = customer;
  if (await checkEmailExists(Email)) {
    try {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(hashedPassword);
      const signupQuery = 'CALL customerSignup(?,?,?,?,?)';

      const connection = await mysqlConnection();
      const { _results } = await connection.query(signupQuery, [
        Email,
        hashedPassword,
        // eslint-disable-next-line camelcase
        First_Name,
        // eslint-disable-next-line camelcase
        Last_Name,
        Number(Gender),
      ]);
      connection.end();
      console.log(_results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('User Created');
      return response;
    } catch (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Network error');
      return response;
    }
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Email Already Exists');
    return response;
  }
};

// getCustomer Basic Info
const getBasicInfo = async (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getBasicInfoQuery = 'CALL getBasicInfoCustomer(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getBasicInfoQuery, userID);
      connection.end();
      console.log(results);
      if (results[1].length === 0) {
        results[1].push({ ReviewCount: 0 });
      }
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
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// get data static + user for update profile
const getDataForCustomerUpdateProfile = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getDataForCustomerUpdateProfileQuery = 'CALL getDataForCustomerUpdateProfile(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(
        getDataForCustomerUpdateProfileQuery,
        userID
      );
      connection.end();
      console.log(results);

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
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// Update Customer profile
const updateProfile = async (request, response) => {
  const {
    First_Name,
    Last_Name,
    Nick_Name,
    Gender,
    Date_Of_Birth,
    Country_ID,
    State_ID,
    City,
    Zip,
    Street,
    Headline,
    I_Love,
    Find_Me_In,
    Website,
    token,
    userrole,
    ImageUrl,
  } = request.body;
  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const updateCustomerProfileQuery =
        'CALL updateCustomerProfile(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateCustomerProfileQuery, [
        cusID,
        First_Name,
        Last_Name,
        Nick_Name,
        Gender,
        Date_Of_Birth,
        Country_ID,
        State_ID,
        City,
        Zip,
        Street,
        Headline,
        I_Love,
        Find_Me_In,
        Website,
        ImageUrl,
      ]);
      connection.release();
      console.log(results);
      response.writeHead(204, {
        'Content-Type': 'text/plain',
      });
      response.end('Profile Update Successfully');
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

// Get Contact Information
const getContactInfo = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getContactInfoQuery = 'CALL getContactInfoProfile(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getContactInfoQuery, userID);
      connection.end();
      console.log(results);

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
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// Update Customer Contact Information
const updateContactInfo = async (request, response) => {
  const { Email, NewEmail, ContactNo, Password, CountryCode, token, userrole } = request.body;

  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const getUserDetails = 'CALL getPassword(?)';
      const connection = await mysqlConnection();
      let [results, fields] = await connection.query(getUserDetails, cusID);

      if (await bcrypt.compare(Password, results[0][0].password)) {
        let updateContactInfoQuery = '';

        if (NewEmail === Email) {
          updateContactInfoQuery = 'CALL updateContactInformation2(?,?,?)';

          [results, fields] = await connection.query(updateContactInfoQuery, [
            cusID,
            ContactNo,
            CountryCode,
          ]);
          connection.end();
          console.log(results);
          response.writeHead(204, {
            'Content-Type': 'text/plain',
          });
          response.end('Contact Information successfully');
        } else {
          updateContactInfoQuery = 'CALL updateContactInformation(?,?,?,?,?)';
          // eslint-disable-next-line no-unused-vars
          [results, fields] = await connection.query(updateContactInfoQuery, [
            cusID,
            Email,
            NewEmail,
            ContactNo,
            CountryCode,
          ]);
          connection.end();
          console.log(results);
          if (results[0][0] && results[0][0].result === 'Email Already Exists') {
            response.writeHead(401, {
              'Content-Type': 'text/plain',
            });
            response.end('Email Already Exists');
          } else {
            response.writeHead(204, {
              'Content-Type': 'text/plain',
            });
            response.end('Contact Information successfully');
          }
        }
      } else {
        response.writeHead(401, {
          'Content-Type': 'text/plain',
        });
        response.end('Incorrect Password');
      }
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

// Get Contact Information
const getCustomerCompleteProfile = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getCustomerCompleteProfileQuery = 'CALL getCustomerCompleteProfile(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getCustomerCompleteProfileQuery, userID);
      connection.end();
      console.log(results);

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
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

const uploadCustomerProfilePic = async (req, res) => {
  try {
    const userID = getUserIdFromToken(req.cookies.cookie, req.cookies.userrole);
    if (userID) {
      multipleUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json({ status: 400, error: err.message });
        } else if (err) {
          res.json({ status: 400, error: err.message });
        } else {
          console.log(req.file.location);
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.end(req.file.location);
        }
      });
    } else {
      res.writeHead(401, {
        'Content-Type': 'text/plain',
      });
      res.end('Invalid User');
    }
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

const generateOrderMenuString = async (orderdCart) => {
  let orderdString = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const item of orderdCart) {
    orderdString = orderdString.concat(item.ID);
    orderdString = orderdString.concat(':');
    switch (item.MenuCategory) {
      case 'APPETIZERS':
        orderdString = orderdString.concat('1');
        break;
      case 'DESSERTS':
        orderdString = orderdString.concat('3');
        break;
      case 'BEVERAGES':
        orderdString = orderdString.concat('4');
        break;
      case 'MAIN_COURSE':
        orderdString = orderdString.concat('5');
        break;
      case 'SALADS':
        orderdString = orderdString.concat('2');
        break;
      default:
        break;
    }
    orderdString = orderdString.concat(':');
    orderdString = orderdString.concat(item.Quantity);
    orderdString = orderdString.concat(';');
  }
  orderdString = orderdString.substring(0, orderdString.length - 1);
  return orderdString;
};

// Generate Order
const generateOrder = async (request, response) => {
  const { RestroId, Price, foodCart, address, deliveryMode, token, userrole } = request.body;

  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const generateOrderQuery = 'CALL generateOrder(?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      const deliveryType = deliveryMode === 'Delivery' ? 1 : 2;
      const orderdMenu = await generateOrderMenuString(foodCart);

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(generateOrderQuery, [
        RestroId,
        cusID,
        deliveryType,
        orderdMenu,
        Price,
        address,
      ]);
      connection.end();
      console.log(results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Order Created Successfully');
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

// Submit Review
const submitReview = async (request, response) => {
  const { RestroId, review, rating, token, userrole } = request.body;

  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const submitReviewQuery = 'CALL submitReview(?,?,?,?)';

      const connection = await mysqlConnection();

      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(submitReviewQuery, [
        rating,
        RestroId,
        cusID,
        review,
      ]);
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

// Submit Review
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
  getBasicInfo,
  getDataForCustomerUpdateProfile,
  updateProfile,
  getContactInfo,
  updateContactInfo,
  getCustomerCompleteProfile,
  uploadCustomerProfilePic,
  generateOrder,
  submitReview,
  getEventList,
  registerForEvent,
  getRegisteredEventIds,
  getAllOrders,
  orderDetailsFetch,
};
