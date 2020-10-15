const url = require('url');
const mysqlConnection = require('../mysqlConnection');
const Country = require('../Models/Country');
const State = require('../Models/State');
const Gender = require('../Models/Gender');
const Cusinie = require('../Models/Cusinie');
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

/*
const getSignupMasterDataCustomer = async (response) => {
  const getMasterData = 'CALL getSignupMasterDataCustomer()';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(getMasterData);

  connection.end();
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // eslint-disable-next-line no-console
  console.log('SignupMaster for Customer : ', JSON.stringify(results));
  response.end(JSON.stringify(results));
  return response;
};
*/

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

const getDeliverStatus = async (response) => {
  const getDeliverStatusQuery = 'CALL getDeliverStatus()';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(getDeliverStatusQuery);

  connection.end();
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // eslint-disable-next-line no-console
  console.log('Delivery statuses of orders : ', JSON.stringify(results));
  response.end(JSON.stringify(results));
  return response;
};

const getSearchStrings = async (request, response) => {
  try {
    const fetchSTringsForSearchQuery = 'CALL fetchSTringsForSearch()';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(fetchSTringsForSearchQuery);
    connection.end();
    // console.log(results);

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

// get restuarant result on basis of searched string and filter criteria
const fetchRestaurantResults = async (req, res) => {
  const { filter, searchString } = url.parse(req.url, true).query;
  try {
    const fetchRestaurantResultsQuery = 'CALL fetchRestaurantResults(?,?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(fetchRestaurantResultsQuery, [
      filter,
      searchString,
    ]);
    connection.end();
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

// get restuarant result on basis of searched string and filter criteria
const fetchReviews = async (req, res) => {
  const { restroId } = url.parse(req.url, true).query;
  try {
    const fetchReviewsQuery = 'CALL fetchReviews(?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(fetchReviewsQuery, restroId);
    connection.end();
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

// get restuarant result on basis of searched string and filter criteria
const menuFetch = async (req, res) => {
  const { restroId } = url.parse(req.url, true).query;
  try {
    const menuFetchForOrderQuery = 'CALL menuFetchForOrder(?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(menuFetchForOrderQuery, restroId);
    connection.end();
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

// get restuarant result on basis of searched string and filter criteria
const fetchRestaurantProfileForCustomer = async (req, res) => {
  const { restroId } = url.parse(req.url, true).query;
  try {
    const fetchRestaurantProfileForCustomerQuery = 'CALL fetchRestaurantProfileForCustomer(?)';

    const connection = await mysqlConnection();
    // eslint-disable-next-line no-unused-vars
    const [results, fields] = await connection.query(
      fetchRestaurantProfileForCustomerQuery,
      restroId
    );
    connection.end();
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
  getDeliverStatus,
  getSearchStrings,
  fetchRestaurantResults,
  fetchReviews,
  menuFetch,
  fetchRestaurantProfileForCustomer,
};
// results = await getMasterData(res);
