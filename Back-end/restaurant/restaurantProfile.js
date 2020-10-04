/* eslint-disable no-console */

const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
// const { request } = require('http');
const { getUserIdFromToken } = require('../common/loginLogout');

const mysqlConnection = require('../mysqlConnection');

const { BUCKET_NAME } = process.env;
const s3Storage = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
require('dotenv').config();

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
      const folderName = 'yelpPrototype-restaurant-';
      console.log('Multer Called', folderName);
      cb(null, `${folderName}/${Date.now().toString()}${file.originalname}`);
    },
  }),
}).single('file');

const getOrderList = async (_order, _appetizers, _desserts, _beverages, _salads, _mainCourse) => {
  const results = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of _order) {
    const itemInformation = item.split(':');
    if (itemInformation[1] === '1') {
      const index = _appetizers.findIndex((x) => x.ID === Number(itemInformation[0]));
      const tmpObj = {
        Name: _appetizers[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _appetizers[index].Price,
        TPrice: _appetizers[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '2') {
      const index = _salads.findIndex((x) => x.ID === Number(itemInformation[0]));
      const tmpObj = {
        Name: _salads[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _salads[index].Price,
        TPrice: _salads[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '3') {
      const index = _desserts.findIndex((x) => x.ID === Number(itemInformation[0]));
      const tmpObj = {
        Name: _desserts[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _desserts[index].Price,
        TPrice: _desserts[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '4') {
      const index = _beverages.findIndex((x) => x.ID === Number(itemInformation[0]));
      const tmpObj = {
        Name: _beverages[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _beverages[index].Price,
        TPrice: _beverages[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '5') {
      const index = _mainCourse.findIndex((x) => x.ID === Number(itemInformation[0]));
      const tmpObj = {
        Name: _mainCourse[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _mainCourse[index].Price,
        TPrice: _mainCourse[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    }
  }
  return results;
};

// Function to check if email already exists
// 2 is for enum value restauarnt
const checkEmailExists = async (email) => {
  const verifyEmailExist = 'CALL getEmail(?,?)';

  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(verifyEmailExist, [email, 2]);

  connection.end();
  console.log(results);
  if (results[0].length === 0) {
    return true;
    // eslint-disable-next-line no-else-return
  } else {
    return false;
  }
};

// Function to create ine restaurant
const signup = async (restaurant, response) => {
  const {
    Email,
    Password,
    Name,
    // eslint-disable-next-line camelcase
    Country_ID,
    // eslint-disable-next-line camelcase
    State_ID,
    City,
    Zip,
    Street,
    // eslint-disable-next-line camelcase
    Country_Code,
    // eslint-disable-next-line camelcase
    Phone_no,
  } = restaurant;
  if (await checkEmailExists(Email)) {
    try {
      const hashedPassword = await bcrypt.hash(Password, 10);
      console.log(hashedPassword);
      const signupQuery = 'CALL resturantSignup(?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      const [results] = await connection.query(signupQuery, [
        Email,
        hashedPassword,
        Name,
        Number(Country_ID),
        Number(State_ID),
        City,
        Number(Zip),
        Street,
        Number(Country_Code),
        Number(Phone_no),
      ]);
      connection.end();
      console.log(results);
      response.writeHead(201, {
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
    response.writeHead(409, {
      'Content-Type': 'text/plain',
    });
    response.end('Email Already Exists');
    return response;
  }
};

const getBasicInfo = async (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getBasicInfoQuery = 'CALL getBasicInfo(?)';

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

const getRestaurantCompleteInfo = async (request, response) => {
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getRestaurantCompleteInfoQuery = 'CALL getRestaurantCompleteInfoQuery(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getRestaurantCompleteInfoQuery, userID);
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

// Update Restaurant Profile
const updateRestaurantProfile = async (restaurant, response) => {
  try {
    const {
      Name,
      // eslint-disable-next-line camelcase
      Country_ID,
      // eslint-disable-next-line camelcase
      State_ID,
      City,
      Zip,
      Street,
      // eslint-disable-next-line camelcase
      Phone_no,
      // eslint-disable-next-line camelcase
      Country_Code,
      // eslint-disable-next-line camelcase
      Opening_Time,
      // eslint-disable-next-line camelcase
      Closing_Time,
      CurbsidePickup,
      DineIn,
      YelpDelivery,
    } = restaurant;
    const restroID = getUserIdFromToken(restaurant.token, restaurant.userrole);
    if (restroID) {
      const updateRestaurantProfileQuery =
        'CALL updateRestaurantProfileQuery(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateRestaurantProfileQuery, [
        Name,
        // eslint-disable-next-line camelcase
        Number(Country_ID),
        // eslint-disable-next-line camelcase
        Number(State_ID),
        City,
        Number(Zip),
        Street,
        // eslint-disable-next-line camelcase
        Number(Phone_no),
        // eslint-disable-next-line camelcase
        Number(Country_Code),
        // eslint-disable-next-line camelcase
        Opening_Time,
        // eslint-disable-next-line camelcase
        Closing_Time,
        restroID,
        CurbsidePickup,
        DineIn,
        YelpDelivery,
      ]);
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

const fetchMenu = async (request, response) => {
  const { category } = url.parse(request.url, true).query;
  const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (userID) {
    let items = null;
    if (category === 'APPETIZERS') {
      items = 'CALL fetchAppetizerItems(?)';
    } else if (category === 'BEVERAGES') {
      items = 'CALL fetchBeveragesItems(?)';
    } else if (category === 'DESSERTS') {
      items = 'CALL fetchDessertsItems(?)';
    } else if (category === 'MAIN_COURSE') {
      items = 'CALL fetchMainCourseItems(?)';
    } else {
      items = 'CALL fetchSaladsItems(?)';
    }
    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(items, userID);
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
  return response;
};

const insertFood = async (request, response) => {
  const { category, name, price, cuisine, ingredients, description, ImageUrl } = request.body;
  const restroId = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (restroId) {
    let items = null;
    if (category === 'APPETIZERS') {
      items = 'CALL insertAppetizerItems(?,?,?,?,?,?,?)';
    } else if (category === 'BEVERAGES') {
      items = 'CALL insertBeveragesItems(?,?,?,?,?,?,?)';
    } else if (category === 'DESSERTS') {
      items = 'CALL insertDessertsItems(?,?,?,?,?,?,?)';
    } else if (category === 'MAIN_COURSE') {
      items = 'CALL insertMainCourseItems(?,?,?,?,?,?,?)';
    } else {
      items = 'CALL insertSaladsItems(?,?,?,?,?,?,?)';
    }
    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(items, [
      restroId,
      name,
      price,
      cuisine,
      ingredients,
      description,
      ImageUrl,
    ]);
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
  return response;
};

const deleteFoodItem = async (request, response) => {
  const { category, foodId } = request.body;
  const id = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (id) {
    let items = null;
    if (category === 'APPETIZERS') {
      items = 'CALL deleteAppetizerItems(?,?)';
    } else if (category === 'BEVERAGES') {
      items = 'CALL deleteBeveragesItems(?,?)';
    } else if (category === 'DESSERTS') {
      items = 'CALL deleteDessertsItems(?,?)';
    } else if (category === 'MAIN_COURSE') {
      items = 'CALL deleteMainCourseItems(?,?)';
    } else {
      items = 'CALL deleteSaladsItems(?,?)';
    }
    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(items, [id, Number(foodId)]);
    connection.end();
    response.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    response.end('Food Item Deleted Successfully');
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Invalid User');
  }
  return response;
};

// Update Restaurant Profile
const updateFoodItem = async (request, response) => {
  try {
    const foodItem = request.body;
    const {
      ID,
      category,
      Name,
      MainIngredients,
      CuisineID,
      Description,
      Price,
      ImageUrl,
    } = foodItem;
    const restroID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    let updateFoodItemQuery = '';
    if (restroID) {
      if (category === 'APPETIZERS') {
        updateFoodItemQuery = 'CALL updateAppetizerItems(?,?,?,?,?,?,?,?)';
      } else if (category === 'BEVERAGES') {
        updateFoodItemQuery = 'CALL updateBeveragesItems(?,?,?,?,?,?,?,?)';
      } else if (category === 'DESSERTS') {
        updateFoodItemQuery = 'CALL updateDessertItems(?,?,?,?,?,?,?,?)';
      } else if (category === 'MAIN_COURSE') {
        updateFoodItemQuery = 'CALL updateMainCourseItems(?,?,?,?,?,?,?,?)';
      } else {
        updateFoodItemQuery = 'CALL updateSaladsItems(?,?,?,?,?,?,?,?)';
      }
      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateFoodItemQuery, [
        ID,
        restroID,
        Name,
        MainIngredients,
        Price,
        CuisineID,
        Description,
        ImageUrl,
      ]);
      connection.end();
      console.log(results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Food Item Updated successfully');
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

// fetch Reviews
const fetchReviews = async (request, response) => {
  const restroId = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (restroId) {
    const fetchReviewsQuery = 'CALL fetchReviews(?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(fetchReviewsQuery, restroId);
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
  return response;
};

// fetch order depending on filter value
const getOrderDetailsNew = async (request, response) => {
  const { sortValue } = url.parse(request.url, true).query;
  const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (userID) {
    const getOrderDetailsQuery = 'CALL getOrderDetails(?,?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(getOrderDetailsQuery, [userID, sortValue]);
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
  return response;
};

// Fetch details of particular order
const orderFetch = async (request, response) => {
  const { orderID } = url.parse(request.url, true).query;
  const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (userID) {
    const orderFetchQuery = 'CALL orderFetch(?,?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(orderFetchQuery, [userID, orderID]);
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

// Update Deliver Status
const updateDeliveryStatus = async (request, response) => {
  try {
    const order = request.body;
    const { orderID, deliveryStatus, token, userrole } = order;
    const restroID = getUserIdFromToken(token, userrole);

    if (restroID) {
      const updateOrderStatusQuery = 'CALL updateOrderStatus(?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(updateOrderStatusQuery, [
        orderID,
        restroID,
        deliveryStatus,
      ]);
      connection.end();
      console.log(results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Order Status Updated successfully');
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

// Create New Event
const createNewEvent = async (request, response) => {
  const {
    Name,
    Description,
    EventDate,
    EventStartTime,
    EventEndTime,
    CountryId,
    StateId,
    City,
    hashtags,
    Zip,
    Street,
    token,
    userrole,
  } = request.body;
  try {
    const restroID = getUserIdFromToken(token, userrole);
    if (restroID) {
      const createNewEventQuery = 'CALL createNewEvent(?,?,?,?,?,?,?,?,?,?,?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(createNewEventQuery, [
        Name,
        restroID,
        Description,
        EventDate,
        EventStartTime,
        EventEndTime,
        CountryId,
        StateId,
        City,
        Zip,
        Street,
        hashtags,
      ]);
      connection.end();
      console.log(results);
      response.writeHead(201, {
        'Content-Type': 'text/plain',
      });
      response.end('Event created successfully');
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
      const getEventListQuery = 'CALL getEventList(?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getEventListQuery, [userID, sortValue]);
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
const getCustomerList = async (request, response) => {
  try {
    const { eventID } = url.parse(request.url, true).query;
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getRegisteredCustomersQuery = 'CALL getRegisteredCustomers(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getRegisteredCustomersQuery, eventID);
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

// upload restaurant profile to s3 bucket
const uploadRestaurantProfilePic = async (req, res) => {
  try {
    const restroId = getUserIdFromToken(req.cookies.cookie, req.cookies.userrole);
    if (restroId) {
      multipleUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json({ status: 400, error: err.message });
        } else if (err) {
          res.json({ status: 400, error: err.message });
        } else {
          console.log(req.file.location);
          // const uploadRestaurantProfilePicQuery = 'CALL uploadRestaurantProfilePic(?,?)';

          // const connection = await mysqlConnection();
          // const imageUrl = req.file.location;
          // // eslint-disable-next-line no-unused-vars
          // const [results, fields] = await connection.query(uploadRestaurantProfilePicQuery, [
          //   restroId,
          //   imageUrl,
          // ]);
          // connection.end();
          // console.log(results);
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

// upload restaurant image to db
const uploadPicToDB = async (req, response) => {
  try {
    const image = req.body;
    const { ImageUrl } = image;
    const restroID = getUserIdFromToken(req.cookies.cookie, req.cookies.userrole);

    if (restroID) {
      const uploadRestaurantProfilePicQuery = 'CALL uploadPicToDB(?,?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(uploadRestaurantProfilePicQuery, [
        restroID,
        ImageUrl,
      ]);
      connection.end();
      console.log(results);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Image saved successfully');
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

const uploadFoodImage = async (req, res) => {
  try {
    const restroId = getUserIdFromToken(req.cookies.cookie, req.cookies.userrole);
    if (restroId) {
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

// Get Contact Information
const getCustomerCompleteProfileForRestaurant = async (request, response) => {
  const { cusID } = url.parse(request.url, true).query;
  try {
    const userID = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
    if (userID) {
      const getCustomerCompleteProfileQuery = 'CALL getCustomerCompleteProfile(?)';

      const connection = await mysqlConnection();
      // eslint-disable-next-line no-unused-vars
      const [results, fields] = await connection.query(getCustomerCompleteProfileQuery, cusID);
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

module.exports = {
  signup,
  getBasicInfo,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  fetchMenu,
  insertFood,
  deleteFoodItem,
  updateFoodItem,
  fetchReviews,
  getOrderDetailsNew,
  orderFetch,
  updateDeliveryStatus,
  createNewEvent,
  getEventList,
  getCustomerList,
  uploadRestaurantProfilePic,
  uploadPicToDB,
  uploadFoodImage,
  getOrderList,
  getCustomerCompleteProfileForRestaurant,
};
