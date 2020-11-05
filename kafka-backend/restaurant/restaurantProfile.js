/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

const bcrypt = require('bcrypt');

const url = require('url');
const geocoder = require('google-geocoder');

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
const Message = require('../Models/Message');
const { key } = require('./config');

const geo = geocoder({
  key,
});

require('dotenv').config();

async function handle_request(msg, callback) {
  const response = {};
  switch (msg.api) {
    case 'signup': {
      UserSignup.findOne({ Email: msg.data.Email, Role: 'Restaurant' }, async (error, user) => {
        if (error) {
          response.status = 500;
          response.data = 'Network Error';
          callback(null, response);
        } else if (user) {
          response.status = 400;
          response.data = 'Email Already Exists';

          callback(null, response);
        } else {
          let Location = msg.data.Street.concat(', ');
          Location = Location.concat(msg.data.Zip);
          // eslint-disable-next-line func-names
          geo.find(Location, async function (err1, res) {
            if (await res) {
              const latitude = res[0].location.lat;
              const longitude = res[0].location.lng;
              const hashedPassword = await bcrypt.hash(msg.data.Password, 10);
              const newUser = new UserSignup({
                ...msg.data,
                Role: 'Restaurant',
                Password: hashedPassword,
              });
              newUser.save((err, data) => {
                if (err) {
                  response.status = 500;
                  response.data = 'Network Error';

                  callback(null, response);
                } else {
                  const newRestaurant = new Restaurant({
                    ...msg.data,
                    RestaurantID: data._id,
                    Latitude: latitude,
                    Longitude: longitude,
                  });
                  newRestaurant.save((err2) => {
                    if (err2) {
                      response.status = 500;
                      response.data = 'Network Error';

                      callback(null, response);
                    } else {
                      response.status = 201;
                      response.data = 'User Created';
                      callback(null, response);
                    }
                  });
                }
              });
              if (err1) {
                response.status = 500;
                response.data = 'Incorrect Location';
                callback(null, response);
              }
            } else {
              response.status = 500;
              response.data = 'Incorrect Location';
              callback(null, response);
            }
          });
        }
      });

      break;
    }
    case 'homeProfile': {
      try {
        const { _id } = url.parse(msg.url, true).query;

        const restaurant = await Restaurant.findOne({ RestaurantID: _id }).exec();

        const reviewCount = await Reviews.find({ RestaurantID: _id }).countDocuments();
        const results = {
          restaurant,
          reviewCount,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        response.status = 401;
        response.data = 'Network Error';
        callback(null, response);
      }

      break;
    }
    case 'updateRestaurantProfile': {
      const restaurant = msg.data;
      try {
        await Restaurant.updateOne(
          { RestaurantID: restaurant.RestaurantID },
          { ...restaurant },
          async (error) => {
            if (error) {
              response.status = 500;
              response.data = 'Network Error';
              callback(null, response);
            } else {
              response.status = 200;
              response.data = 'Profile Updated Successfully';
              callback(null, response);
            }
          }
        );
      } catch (error) {
        response.status = 401;
        response.data = 'Network Error';
        callback(null, response);
      }

      break;
    }
    case 'menuFetch': {
      const { RestaurantID, selectedPage, category } = url.parse(msg.url, true).query;
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
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        response.status = 500;
        response.data = 'Menu Data Fetch Failed';
        callback(null, response);
        break;
      }
      break;
    }
    case 'insertFood': {
      try {
        let newFood = null;
        switch (msg.data.category) {
          case 'APPETIZERS':
            newFood = new Appetizer({
              ...msg.data,
            });
            break;
          case 'SALADS':
            newFood = new Salad({
              ...msg.data,
            });
            break;
          case 'MAIN_COURSE':
            newFood = new MainCourse({
              ...msg.data,
            });
            break;
          case 'BEVERAGES':
            newFood = new Beverage({
              ...msg.data,
            });
            break;
          case 'DESSERTS':
            newFood = new Dessert({
              ...msg.data,
            });
            break;
          default:
            break;
        }
        newFood.save((err) => {
          if (err) {
            response.status = 500;
            response.data = 'Network Error';
            callback(null, response);
          } else {
            response.status = 200;
            response.data = 'Food Item Created Successfully!!!';
            callback(null, response);
          }
        });
      } catch (error) {
        response.status = 500;
        response.data = 'Network Error';
        callback(null, response);
      }
      break;
    }
    case 'deleteFoodItem': {
      const { _id } = msg.data;
      try {
        let FoodCategory = null;
        switch (msg.data.category) {
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
            // response.status = 500;
            // response.data = error.message;
            callback(error, null);
          } else {
            response.status = 200;
            response.data = 'Delete Successfull!!!';
            callback(null, response);
          }
        });
      } catch (error) {
        // response.status = 500;
        // response.data = error.message;
        callback(error, null);
      }
      break;
    }
    case 'updateFoodItem': {
      try {
        let FoodCategory = null;
        switch (msg.data.category) {
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
        FoodCategory.updateOne({ _id: msg.data._id }, { ...msg.data }, async (error) => {
          if (error) {
            // response.status = 500;
            // response.data = 'Network Error';
            callback(error, null);
          } else {
            response.status = 200;
            response.data = 'Food Item Updated Successfully';
            callback(null, response);
          }
        });
      } catch (error) {
        response.status = 401;
        response.data = 'Network Error';
        callback(null, response);
      }
      break;
    }
    case 'fetchReviews': {
      const { RestaurantID, selectedPage } = url.parse(msg.url, true).query;
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
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        // response.status = 500;
        // response.data = 'Review Fetch Failed';
        callback(error, null);
      }
      break;
    }
    case 'getOrderDetails': {
      const { RestaurantID, selectedPage, sortValue } = url.parse(msg.url, true).query;
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

        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'updateDeliveryStatus': {
      try {
        Orders.updateOne(
          { $and: [{ _id: msg.data._id }, { RestaurantID: msg.data.RestaurantID }] },
          { ...msg.data },
          async (error) => {
            if (error) {
              callback(error, null);
            } else {
              response.status = 200;
              response.data = `Order statuse succesfully updated to${msg.data.DeliveryStatus}`;
              callback(null, response);
            }
          }
        );
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'createNewEvent': {
      try {
        const newEvent = new Event({
          ...msg.data,
        });

        newEvent.save((err) => {
          if (err) {
            callback(err, null);
          } else {
            response.status = 201;
            response.data = 'Food Item Created Successfully!!!';
            callback(null, response);
          }
        });
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'getEventList': {
      const { RestaurantID, selectedPage, sortValue } = url.parse(msg.url, true).query;
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

        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'getCustomerList': {
      const { RestaurantID, _id, RegistrationPage } = url.parse(msg.url, true).query;
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

        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'getCustomerCompleteProfile': {
      const { CustomerID } = url.parse(msg.url, true).query;
      try {
        const customer = await Customer.findOne(
          { CustomerID },
          { RegisteredEvents: 0, ReviewCount: 0 }
        );
        const results = {
          customer,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'uploadRestaurantProfilePic': {
      Restaurant.updateOne({ RestaurantID: msg.data }, { ImageURL: msg.url }, async (error) => {
        if (error) {
          callback(error, null);
        } else {
          response.status = 200;
          response.data = msg.url;
          callback(null, response);
        }
      });
      break;
    }
    case 'sendMessage': {
      const { message, CustomerId, CustomerName, RestaurantId, RestaurantName } = msg.data;
      // console.log('message', message);
      Message.findOne({ CustomerId, RestaurantId }, async (error, msgConnection) => {
        if (error) {
          response.status = 500;
          response.data = error;
          callback(null, response);
        }
        if (msgConnection) {
          // console.log('Inside Update Message:');
          Message.updateOne(
            { CustomerId, RestaurantId },
            { $push: { MessageArray: message } },
            (error2, result) => {
              if (error2) {
                response.status = 500;
                response.data = 'Network Error';
                callback(null, response);
              } else {
                console.log('message entered');
                response.status = 200;
                response.data = JSON.stringify(result);
                callback(null, response);
              }
            }
          );
          // console.log(msgConnection);
        } else {
          // console.log('New Message Insertion');
          const newMsgConnection = new Message({
            CustomerId,
            CustomerName,
            RestaurantId,
            RestaurantName,
            MessageArray: [message],
          });
          newMsgConnection.save((err, result) => {
            if (err) {
              response.status = 500;
              response.data = 'Network Error';
              callback(null, response);
            } else {
              response.status = 200;
              response.data = JSON.stringify(result);
              callback(null, response);
            }
          });
        }
      });
      break;
    }
    case 'getMessages': {
      const { CustomerId, RestaurantId } = url.parse(msg.url, true).query;

      await Message.findOne({ CustomerId, RestaurantId }, async (error, result) => {
        if (error) {
          response.status = 500;
          response.data = error;
          callback(null, response);
        } else {
          response.status = 200;
          const message = result;
          if (result) {
            const msgArray = await message.MessageArray.sort((a, b) => b.SentTime - a.SentTime);
            message.MessageArray = await msgArray;
          }
          response.data = JSON.stringify(message);
          callback(null, response);
        }
      });
      break;
    }
    case 'getAllMessages': {
      const { RestaurantId, selectedPage } = url.parse(msg.url, true).query;
      try {
        const MessageList = await Message.find({ RestaurantId })
          .limit(5)
          .skip(selectedPage * 5)
          .exec();
        const messageCount = await Message.find({ RestaurantId }).countDocuments();
        const results = {
          MessageList,
          messageCount,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        // response.status = 500;
        // response.data = 'Review Fetch Failed';
        callback(error, null);
      }
      break;
    }
    default:
      break;
  }
}

exports.handle_request = handle_request;
