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

// MongoDb Implemented
const uploadCountryData = async (request, response) => {
  const newCountry = new Country({
    Name: request.body.Name,
    CountryCode: request.body.CountryCode,
  });
  newCountry.save((error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end();
    } else {
      // console.log('data: ', data);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end();
    }
  });
};

// MongoDb Implemented
const uploadStateData = async (request, response) => {
  const newState = new State({
    ...request.body,
  });
  newState.save((error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end();
    } else {
      // console.log('data: ', data);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end();
    }
  });
};

// MongoDb Implemented
const uploadGenderData = async (request, response) => {
  const newGender = new Gender({
    ...request.body,
  });
  newGender.save((error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Network Error');
    } else {
      // console.log('data: ', data);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end();
    }
  });
};

// MongoDb Implemented
const uploadCuisineData = async (request, response) => {
  const newCuisine = new Cusinie({
    ...request.body,
  });
  newCuisine.save((error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Network Error');
    } else {
      // console.log('data: ', data);
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end();
    }
  });
};

// MongoDb Implemented // Fetch maaster static data
const getSignupMasterData = async (response) => {
  const results = [];

  try {
    Country.find(await {}, async (error, country) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
      } else {
        results.push(country);
        State.find(await {}, async (error1, state) => {
          if (error1) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
          } else {
            await results.push(state);
            Gender.find(await {}, async (error2, gender) => {
              if (error2) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
              } else {
                await results.push(gender);
                response.writeHead(200, {
                  'Content-Type': 'application/json',
                });
                response.end(JSON.stringify(results));
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
    response.end('Master Data Fetch Failed');
    // return results;
  }
  return results;
};

// MongoDbImplemented
const getCusinesForMenu = async (response) => {
  try {
    Cusinie.find(await {}, async (error, cuisine) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
      } else {
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(cuisine));
      }
    });
  } catch (error) {
    response.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    response.end('Cuisine Data Fetch Failed');
  }
  return response;
};

// MongoDbImplemented
const getSearchStrings = async (request, response) => {
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
    const FoodItemsStrings = [...Appetizers, ...Beverages, ...Desserts, ...Salads, ...MainCourses];

    const results = {
      NameLocation,
      FoodItemsStrings,
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

// get restuarant result on basis of searched string and filter criteria // MongoDbImplemented
const fetchRestaurantResults = async (req, res) => {
  const { filter, searchString, selectedPage } = url.parse(req.url, true).query;
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
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

// get restuarant result on basis of searched string and filter criteria //mongodb Implemented
const fetchRestaurantProfileForCustomer = async (req, res) => {
  const { restroId } = url.parse(req.url, true).query;
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
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
    });
    res.end('Network Error');
  }
  return res;
};

module.exports = {
  uploadCountryData,
  uploadGenderData,
  uploadStateData,
  uploadCuisineData,
  getSignupMasterData,
  getCusinesForMenu,
  getSearchStrings,
  fetchRestaurantResults,

  fetchRestaurantProfileForCustomer,
};
// results = await getMasterData(res);
