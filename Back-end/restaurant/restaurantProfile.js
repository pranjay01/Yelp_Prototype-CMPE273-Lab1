/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const bcrypt = require('bcrypt');

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const url = require('url');
const geocoder = require('google-geocoder');
// const { getUserIdFromToken } = require('../common/loginLogout');

const mysqlConnection = require('../mysqlConnection');
const UserSignup = require('../Models/UserSignup');

const Restaurant = require('../Models/Restaurant');
const Reviews = require('../Models/Review');
const Event = require('../Models/Event');

const Orders = require('../Models/Order');

const Appetizer = require('../Models/Appetizer');
const Beverage = require('../Models/Beverage');
const Dessert = require('../Models/Dessert');
const MainCourse = require('../Models/MainCourse');
const Salad = require('../Models/Salad');
const Customer = require('../Models/Customer');
const { key } = require('./config');

const geo = geocoder({
  key,
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
      const folderName = 'yelpPrototype-restaurant-';
      cb(null, `${folderName}/${Date.now().toString()}${file.originalname}`);
    },
  }),
}).single('file');

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
          if (await res) {
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
                newRestaurant.save((err2) => {
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
          } else {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            response.end('Incorrect Location');
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

    const restaurant = await Restaurant.findOne({ RestaurantID: _id }).exec();

    const reviewCount = await Reviews.find({ RestaurantID: _id }).countDocuments();
    const results = {
      restaurant,
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

// Update Restaurant Profile // mongoDbAdded
const updateRestaurantProfile = async (restaurant, response) => {
  try {
    Restaurant.updateOne(
      { RestaurantID: restaurant.RestaurantID },
      { ...restaurant },
      async (error) => {
        if (error) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          response.end('Network Error');
        } else {
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
    multipleUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.json({ status: 400, error: err.message });
      } else if (err) {
        res.json({ status: 400, error: err.message });
      } else {
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

// MongoDb Implemented
const fetchMenu = async (request, response) => {
  const { RestaurantID, selectedPage, category } = url.parse(request.url, true).query;
  try {
    let Food = null;
    switch (category) {
      case 'APPETIZERS':
        Food = Appetizer;
        break;
      case 'SALADS':
        Food = Salad;
        break;
      case 'MAIN_COURSE':
        Food = MainCourse;
        break;
      case 'BEVERAGES':
        Food = Beverage;
        break;
      case 'DESSERTS':
        Food = Dessert;
        break;
      default:
        break;
    }
    const allFood = await Food.find({ RestaurantID })
      .limit(2)
      .skip(selectedPage * 2)
      .exec();
    const foodCount = await Food.find({ RestaurantID }).countDocuments();
    const results = {
      allFoods: allFood,
      foodCount,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
    // console.log(results);
    //   }
    // });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Cuisine Data Fetch Failed');
  }
  return response;
};

// MongoDb Implemented
const uploadFoodImage = async (req, res) => {
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
};

// MongoDb Implemented
const insertFood = async (request, response) => {
  try {
    let newFood = null;
    switch (request.body.category) {
      case 'APPETIZERS':
        newFood = new Appetizer({
          ...request.body,
        });
        break;
      case 'SALADS':
        newFood = new Salad({
          ...request.body,
        });
        break;
      case 'MAIN_COURSE':
        newFood = new MainCourse({
          ...request.body,
        });
        break;
      case 'BEVERAGES':
        newFood = new Beverage({
          ...request.body,
        });
        break;
      case 'DESSERTS':
        newFood = new Dessert({
          ...request.body,
        });
        break;
      default:
        break;
    }
    newFood.save((err) => {
      if (err) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end('Food Item Created Successfully!!!');
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

// MongoDb Implemented
const deleteFoodItem = async (request, response) => {
  const { _id } = request.body;
  try {
    let FoodCategory = null;
    switch (request.body.category) {
      case 'APPETIZERS':
        FoodCategory = Appetizer;
        break;
      case 'SALADS':
        FoodCategory = Salad;
        break;
      case 'MAIN_COURSE':
        FoodCategory = MainCourse;
        break;
      case 'BEVERAGES':
        FoodCategory = Beverage;
        break;
      case 'DESSERTS':
        FoodCategory = Dessert;
        break;
      default:
        break;
    }
    FoodCategory.findByIdAndDelete({ _id }, (error) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end(error.message);
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        response.end('Delete Successfull!!!');
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

// Update FoodItem // MongoDb Implemented
const updateFoodItem = async (request, response) => {
  try {
    let FoodCategory = null;
    switch (request.body.category) {
      case 'APPETIZERS':
        FoodCategory = Appetizer;
        break;
      case 'SALADS':
        FoodCategory = Salad;
        break;
      case 'MAIN_COURSE':
        FoodCategory = MainCourse;
        break;
      case 'BEVERAGES':
        FoodCategory = Beverage;
        break;
      case 'DESSERTS':
        FoodCategory = Dessert;
        break;
      default:
        break;
    }
    FoodCategory.updateOne({ _id: request.body._id }, { ...request.body }, async (error) => {
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
        response.end('Food Item Updated Successfully');
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

// fetch Reviews // MongoDb Implemented
const fetchReviews = async (request, response) => {
  const { RestaurantID, selectedPage } = url.parse(request.url, true).query;
  try {
    const ReviewsList = await Reviews.find({ RestaurantID })
      .limit(4)
      .skip(selectedPage * 4)
      .exec();
    const reviewCount = await Reviews.find({ RestaurantID }).countDocuments();
    const results = {
      ReviewsList,
      reviewCount,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Review Fetch Failed');
  }
  return response;
};

// fetch order depending on filter value // MongoDb Implemented
const getOrderDetails = async (request, response) => {
  const { RestaurantID, selectedPage, sortValue } = url.parse(request.url, true).query;
  try {
    let filterArray = [];
    switch (sortValue) {
      case 'New':
        filterArray = [
          { DeliveryStatus: 'Order Received' },
          { DeliveryStatus: 'Preparing' },
          { DeliveryStatus: 'On the way' },
          { DeliveryStatus: 'Pick up Ready' },
        ];
        break;
      case 'Delivered':
        filterArray = [{ DeliveryStatus: 'Delivered' }, { DeliveryStatus: 'Picked up' }];
        break;
      case 'Canceled':
        filterArray = [{ DeliveryStatus: 'Canceled' }];
        break;
      default:
        filterArray = [
          { DeliveryStatus: 'Order Received' },
          { DeliveryStatus: 'Preparing' },
          { DeliveryStatus: 'On the way' },
          { DeliveryStatus: 'Pick up Ready' },
          { DeliveryStatus: 'Delivered' },
          { DeliveryStatus: 'Canceled' },
        ];
        break;
    }
    const OrderList = await Orders.find({ $and: [{ RestaurantID }, { $or: filterArray }] })
      .limit(3)
      .skip(selectedPage * 3)
      .exec();
    const orderCount = await Orders.find({
      $and: [{ RestaurantID }, { $or: filterArray }],
    }).countDocuments();
    const results = {
      OrderList,
      orderCount,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Review Fetch Failed');
  }
  return response;
};

// Update Deliver Status // MongoDb Implemented
const updateDeliveryStatus = async (request, response) => {
  try {
    Orders.updateOne(
      { $and: [{ _id: request.body._id }, { RestaurantID: request.body.RestaurantID }] },
      { ...request.body },
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
          response.end('Order statuse succesfully updated to', request.body.DeliveryStatus);
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

// Create New Event // MongoDb Implemented
const createNewEvent = async (request, response) => {
  try {
    const newEvent = new Event({
      ...request.body,
    });

    newEvent.save((err) => {
      if (err) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        response.end('Network Error');
      } else {
        response.writeHead(201, {
          'Content-Type': 'application/json',
        });
        response.end('Food Item Created Successfully!!!');
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

// fetch events fased on filter // MongoDb Implemented
const getEventList = async (request, response) => {
  const { RestaurantID, selectedPage, sortValue } = url.parse(request.url, true).query;
  try {
    let filter = {};
    if (sortValue === 'upcoming') {
      filter = { $gte: new Date() };
    } else {
      filter = { $lt: new Date() };
    }
    const EventList = await Event.find(
      { $and: [{ RestaurantID }, { EventDate: filter }] },
      { RegisteredCustomers: 0 }
      // { RegisteredCustomers: { $slice: [selectedPageRegisteredCustomers * 2, 2] } }
    )
      .limit(3)
      .skip(selectedPage * 3)
      .exec();
    const eventCount = await Event.find({
      $and: [{ RestaurantID }, { EventDate: filter }],
    }).countDocuments();
    const results = {
      EventList,
      eventCount,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Review Fetch Failed');
  }
  return response;
};

// fetch events fased on filter // MongoDb Implemented
const getCustomerList = async (request, response) => {
  const { RestaurantID, _id, RegistrationPage } = url.parse(request.url, true).query;
  try {
    const focusedEvent = await Event.findOne(
      { $and: [{ RestaurantID }, { _id }] },
      { RegisteredCustomers: { $slice: [RegistrationPage * 8, 8] } }
    );

    const registeredCustomerArray = await Event.findOne({ $and: [{ RestaurantID }, { _id }] });
    const results = {
      RegisteredCustomers: focusedEvent.RegisteredCustomers,
      registeredCustomerCount: registeredCustomerArray.RegisteredCustomers.length,
    };

    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(results));
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Review Fetch Failed');
  }
  return response;
};

// Get Contact Information
const getCustomerCompleteProfileForRestaurant = async (request, response) => {
  const { CustomerID } = url.parse(request.url, true).query;
  try {
    const customer = await Customer.findOne(
      { CustomerID },
      { RegisteredEvents: 0, ReviewCount: 0 }
    );
    const results = {
      customer,
    };
    response.writeHead(200, {
      'Content-Type': 'text/plain',
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

module.exports = {
  signup,
  getRestaurantInfo,
  updateRestaurantProfile,
  fetchMenu,
  insertFood,
  deleteFoodItem,
  updateFoodItem,
  fetchReviews,
  getOrderDetails,
  updateDeliveryStatus,
  createNewEvent,
  getEventList,
  getCustomerList,
  uploadRestaurantProfilePic,
  uploadPicToMulter,
  uploadFoodImage,
  getCustomerCompleteProfileForRestaurant,
};
