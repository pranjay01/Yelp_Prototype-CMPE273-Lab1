/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const geocoder = require('google-geocoder');
// const { request } = require('http');
const { getUserIdFromToken } = require('../common/loginLogout');

const mysqlConnection = require('../mysqlConnection');
const UserSignup = require('../Models/UserSignup');

const Restaurant = require('../Models/Restaurant');

const geo = geocoder({
  key: 'AIzaSyBpI0r49yQH5FrrK6tsDHrbkYoBp8bWSXE',
});

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
    console.log('item: ', item);
    const itemInformation = item.split(':');
    if (itemInformation[1] === '1') {
      console.log('_appetizers:', _appetizers);
      const index = _appetizers.findIndex((x) => x.ID === Number(itemInformation[0]));
      console.log('Index: ', index, '_appetizers[index] ', _appetizers[index]);
      const tmpObj = {
        Name: _appetizers[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _appetizers[index].Price,
        TPrice: _appetizers[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '2') {
      console.log('_salads:', _salads);
      const index = _salads.findIndex((x) => x.ID === Number(itemInformation[0]));
      console.log('Index: ', index, '_salads[index] ', _salads[index]);
      const tmpObj = {
        Name: _salads[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _salads[index].Price,
        TPrice: _salads[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '3') {
      console.log('_desserts:', _desserts);
      const index = _desserts.findIndex((x) => x.ID === Number(itemInformation[0]));
      console.log('Index: ', index, '_desserts[index] ', _desserts[index]);
      const tmpObj = {
        Name: _desserts[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _desserts[index].Price,
        TPrice: _desserts[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '4') {
      console.log('_beverages:', _beverages);
      const index = _beverages.findIndex((x) => x.ID === Number(itemInformation[0]));
      console.log('Index: ', index, '_beverages[index] ', _beverages[index]);
      const tmpObj = {
        Name: _beverages[index].Name,
        Count: Number(itemInformation[2]),
        PPrice: _beverages[index].Price,
        TPrice: _beverages[index].Price * Number(itemInformation[2]),
      };
      results.push(tmpObj);
    } else if (itemInformation[1] === '5') {
      console.log('_mainCourse:', _mainCourse);
      const index = _mainCourse.findIndex((x) => x.ID === Number(itemInformation[0]));
      console.log('Index: ', index, '_mainCourse[index] ', _mainCourse[index]);
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

// Function to create new restaurant // mongoDbAdded
const signup = async (restaurant, response) => {
  try {
    UserSignup.findOne({ Email: restaurant.Email, Role: 'Restaurant' }, async (error, user) => {
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
        let Location = restaurant.Street.concat(', ');
        Location = Location.concat(restaurant.Zip);
        geo.find(Location, async function (err1, res) {
          if (res.length === 0) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            response.end('Incorrect Location');
          } else {
            console.log(res[0].location.lat);
            console.log(res[0].location.lng);
            const latitude = res[0].location.lat;
            const longitude = res[0].location.lng;
            const hashedPassword = await bcrypt.hash(restaurant.Password, 10);
            const newUser = new UserSignup({
              ...restaurant,
              Role: 'Restaurant',
              Password: hashedPassword,
            });
            //  newUser = { ...newUser, Password: hashedPassword };
            newUser.save((err, data) => {
              if (err) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                response.end('Network Error');
              } else {
                const newRestaurant = new Restaurant({
                  ...restaurant,
                  RestaurantID: data._id,
                  Latitude: latitude,
                  Longitude: longitude,
                });
                newRestaurant.save((err2, result) => {
                  if (err2) {
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
            if (err1) {
              response.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              response.end('Incorrect Location');
            }
          }
        });
      }
    });
  } catch (e) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Network error');
  }
  return response;
};

// Get Complete Restaurant, // mongoDbAdded
const getRestaurantInfo = async (request, response) => {
  try {
    const { _id } = url.parse(request.url, true).query;

    Restaurant.findOne({ RestaurantID: _id }, async (error, restaurant) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        response.end(JSON.stringify(restaurant));
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

// Update Restaurant Profile // mongoDbAdded
const updateRestaurantProfile = async (restaurant, response) => {
  try {
    Restaurant.updateOne(
      { RestaurantID: restaurant.RestaurantID },
      { ...restaurant },
      async (error, data) => {
        if (error) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          response.end('Network Error');
        } else {
          console.log(data);
          response.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          response.end('Profile Updated Successfully');
        }
      }
    );
  } catch (error) {
    response.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    response.end('Network Error');
  }
  return response;
};

// upload restaurant profile to s3 bucket // mongoDbAdded
const uploadRestaurantProfilePic = async (req, res) => {
  try {
    console.log(req.body);
    multipleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({ status: 400, error: err.message });
      } else if (err) {
        res.json({ status: 400, error: err.message });
      } else {
        // console.log(req.file.location);
        Restaurant.updateOne(
          { RestaurantID: req.body },
          { ImageURL: req.file.location },
          async (error) => {
            if (error) {
              res.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              res.end('Network Error');
            } else {
              res.writeHead(200, {
                'Content-Type': 'text/plain',
              });
              // console.log('data:', data);
              res.end(req.file.location);
            }
          }
        );
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

// upload restaurant profile to only s3 bucket // mongoDbAdded
const uploadPicToMulter = async (req, res) => {
  try {
    console.log(req.body);
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
  getRestaurantInfo,
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
  uploadPicToMulter,
  uploadFoodImage,
  getOrderList,
  getCustomerCompleteProfileForRestaurant,
};
