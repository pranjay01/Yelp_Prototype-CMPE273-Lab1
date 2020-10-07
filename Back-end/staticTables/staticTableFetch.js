const url = require('url');
const mysqlConnection = require('../mysqlConnection');

require('dotenv').config();

const getSignupMasterData = async (response) => {
  const getMasterData = 'CALL getSignupMasterData()';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(getMasterData);

  connection.end();
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // eslint-disable-next-line no-console
  console.log('SignupMaster for Restaurant : ', JSON.stringify(results));
  response.end(JSON.stringify(results));
  return response;
};

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

const getCusinesForMenu = async (response) => {
  const getCusinesForMenuQuery = 'CALL getCusinesForMenuQuery()';
  // 1 is for enum value customer
  const connection = await mysqlConnection();
  // eslint-disable-next-line no-unused-vars
  const [results, fields] = await connection.query(getCusinesForMenuQuery);

  connection.end();
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // eslint-disable-next-line no-console
  console.log('SignupMaster for Customer : ', JSON.stringify(results));
  response.end(JSON.stringify(results));
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
    connection.release();
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
  getSignupMasterData,
  getSignupMasterDataCustomer,
  getCusinesForMenu,
  getDeliverStatus,
  getSearchStrings,
  fetchRestaurantResults,
  fetchReviews,
  menuFetch,
  fetchRestaurantProfileForCustomer,
};
