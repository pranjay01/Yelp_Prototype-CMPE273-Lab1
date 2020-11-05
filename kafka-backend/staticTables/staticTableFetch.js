/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const url = require('url');
const Country = require('../Models/Country');
const State = require('../Models/State');
const Gender = require('../Models/Gender');
const Cusinie = require('../Models/Cusinie');
const Restaurant = require('../Models/Restaurant');
const Appetizer = require('../Models/Appetizer');
const Beverage = require('../Models/Beverage');
const Dessert = require('../Models/Dessert');
const MainCourse = require('../Models/MainCourse');
const Salad = require('../Models/Salad');
const Review = require('../Models/Review');
require('dotenv').config();

async function handle_request(msg, callback) {
  const response = {};
  switch (msg.api) {
    case 'signupMasterData': {
      const results = [];
      try {
        const country = await Country.find({});
        const state = await State.find({});
        const gender = await Gender.find({});
        results.push(country);
        results.push(state);
        results.push(gender);
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        response.status = 500;
        response.data = 'Master Data Fetch Failed';
        callback(null, response);
        // return results;
      }

      break;
    }
    case 'getCusinesForMenu': {
      try {
        await Cusinie.find({}, async (error, cuisine) => {
          if (error) {
            callback(error, null);
          } else {
            response.status = 200;
            response.data = JSON.stringify(cuisine);
            callback(null, response);
          }
        });
      } catch (error) {
        callback(error, null);
      }

      break;
    }
    case 'getSearchStrings': {
      try {
        const NameLocation = await Restaurant.aggregate([
          {
            $addFields: {
              location: {
                $concat: ['$StateName', ', ', '$City', ', ', '$Street'],
              },
            },
          },
          {
            $project: { location: 1, Name: 1, _id: 0 },
          },
        ]);

        // const RestaurantNameStrings = await Restaurant.distinct('Name');
        const Appetizers = await Appetizer.find({}, { FoodName: 1, Cuisine: 1, _id: 0 });
        const Beverages = await Beverage.find({}, { FoodName: 1, Cuisine: 1, _id: 0 });
        const Desserts = await Dessert.find({}, { FoodName: 1, Cuisine: 1, _id: 0 });
        const Salads = await Salad.find({}, { FoodName: 1, Cuisine: 1, _id: 0 });
        const MainCourses = await MainCourse.find({}, { FoodName: 1, Cuisine: 1, _id: 0 });

        // const FoodItemsStrings = [];
        const FoodItemsStrings = [
          ...Appetizers,
          ...Beverages,
          ...Desserts,
          ...Salads,
          ...MainCourses,
        ];

        const results = {
          NameLocation,
          FoodItemsStrings,
        };

        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'fetchRestaurantResults': {
      const { filter, searchString, selectedPage } = url.parse(msg.url, true).query;
      try {
        let restaurantList = [];
        let restaurantCount = 0;
        switch (filter) {
          case '1': {
            restaurantList = await Restaurant.find({
              Name: { $regex: `${searchString}`, $options: 'i' },
            })
              .skip(selectedPage * 2)
              .limit(2)
              .exec();
            restaurantCount = await Restaurant.find({
              Name: { $regex: `${searchString}`, $options: 'i' },
            }).countDocuments();
            break;
          }
          case '2': {
            const concernedAppetizersIds = await Appetizer.find(
              {
                FoodName: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedSaladsIds = await Salad.find(
              {
                FoodName: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedBeveragesIds = await Beverage.find(
              {
                FoodName: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedMainCourseIds = await MainCourse.find(
              {
                FoodName: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedDessertsIds = await Dessert.find(
              {
                FoodName: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedIdsA = concernedAppetizersIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsS = concernedSaladsIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsB = concernedBeveragesIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsM = concernedMainCourseIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsD = concernedDessertsIds.map((result) => {
              return result.RestaurantID;
            });
            restaurantList = await Restaurant.find({
              RestaurantID: {
                $in: [
                  ...concernedIdsA,
                  ...concernedIdsS,
                  ...concernedIdsB,
                  ...concernedIdsM,
                  ...concernedIdsD,
                ],
              },
            })
              .skip(selectedPage * 2)
              .limit(2)
              .exec();
            restaurantCount = await Restaurant.find({
              RestaurantID: {
                $in: [
                  ...concernedIdsA,
                  ...concernedIdsS,
                  ...concernedIdsB,
                  ...concernedIdsM,
                  ...concernedIdsD,
                ],
              },
            }).countDocuments();
            break;
          }
          case '3': {
            const concernedAppetizersIds = await Appetizer.find(
              {
                Cuisine: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedSaladsIds = await Salad.find(
              {
                Cuisine: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedBeveragesIds = await Beverage.find(
              {
                Cuisine: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedMainCourseIds = await MainCourse.find(
              {
                Cuisine: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedDessertsIds = await Dessert.find(
              {
                Cuisine: { $regex: `${searchString}`, $options: 'i' },
              },
              { _id: 0, RestaurantID: 1 }
            ).exec();
            const concernedIdsA = concernedAppetizersIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsS = concernedSaladsIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsB = concernedBeveragesIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsM = concernedMainCourseIds.map((result) => {
              return result.RestaurantID;
            });
            const concernedIdsD = concernedDessertsIds.map((result) => {
              return result.RestaurantID;
            });
            restaurantList = await Restaurant.find({
              RestaurantID: {
                $in: [
                  ...concernedIdsA,
                  ...concernedIdsS,
                  ...concernedIdsB,
                  ...concernedIdsM,
                  ...concernedIdsD,
                ],
              },
            })
              .skip(selectedPage * 2)
              .limit(2)
              .exec();
            restaurantCount = await Restaurant.find({
              RestaurantID: {
                $in: [
                  ...concernedIdsA,
                  ...concernedIdsS,
                  ...concernedIdsB,
                  ...concernedIdsM,
                  ...concernedIdsD,
                ],
              },
            }).countDocuments();
            break;
          }
          default: {
            restaurantList = await Restaurant.aggregate([
              {
                $addFields: {
                  location: {
                    $concat: ['$StateName', ', ', '$City', ', ', '$Street'],
                  },
                },
              },
              //     { $limit: 2 },

              {
                $match: {
                  location: {
                    $regex: `${searchString}`,
                    $options: 'i',
                  },
                },
              },
            ])
              .skip(selectedPage * 2)
              .limit(2);
            restaurantCount = await Restaurant.aggregate([
              {
                $addFields: {
                  location: {
                    $concat: ['$StateName', ', ', '$City', ', ', '$Street'],
                  },
                },
              },
              {
                $match: {
                  location: {
                    $regex: `${searchString}`,
                    $options: 'i',
                  },
                },
              },
              {
                $count: 'restaurantCount',
              },
            ]);
            restaurantCount = restaurantCount[0].restaurantCount;
            break;
          }
        }

        const results = {
          restaurantList,
          restaurantCount,
        };
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        response.status = 500;
        response.data = 'Network Error';
        callback(response, null);
      }
      break;
    }
    case 'fetchRestaurantProfileForCustomer': {
      const { restroId } = url.parse(msg.url, true).query;
      try {
        const RestaurantProfile = await Restaurant.findOne({ RestaurantID: restroId });
        // const AvgRating = await Review.aggregate([
        //   { $group: { _id: '$RestaurantID', avgRating: { $avg: '$Rating' } } },
        //   { $match: { _id: restroId } },
        // ]);
        const ReviewList = await Review.find({ RestaurantID: restroId });
        // {$match:{_id:}}
        const results = {
          RestaurantProfile,
          // AvgRating: Math.round(AvgRating[0].avgRating),
          ReviewList,
        };
        // console.log(results);
        response.status = 200;
        response.data = JSON.stringify(results);
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
      break;
    }
    case 'country': {
      const newCountry = new Country({
        Name: msg.data.Name,
        CountryCode: msg.data.CountryCode,
      });
      newCountry.save((error) => {
        if (error) {
          callback(error, null);
        } else {
          response.status = 200;
          response.data = JSON.stringify('success!');
          callback(null, response);
        }
      });

      break;
    }
    case 'state': {
      const newState = new State({
        ...msg.data,
      });
      newState.save((error) => {
        if (error) {
          callback(error, null);
        } else {
          response.status = 200;
          response.data = JSON.stringify('success!');
          callback(null, response);
        }
      });

      break;
    }
    case 'gender': {
      const newGender = new Gender({
        ...msg.data,
      });
      newGender.save((error) => {
        if (error) {
          callback(error, null);
        } else {
          response.status = 200;
          response.data = JSON.stringify('success!');
          callback(null, response);
        }
      });

      break;
    }
    case 'cuisine': {
      const newCuisine = new Cusinie({
        ...msg.data,
      });
      newCuisine.save((error) => {
        if (error) {
          callback(error, null);
        } else {
          response.status = 200;
          response.data = JSON.stringify('success!');
          callback(null, response);
        }
      });

      break;
    }
    default:
      break;
  }
}

exports.handle_request = handle_request;
