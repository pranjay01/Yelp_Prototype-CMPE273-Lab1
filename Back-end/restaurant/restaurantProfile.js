/* eslint-disable no-else-return */
/* eslint-disable no-console */

const bcrypt = require('bcrypt');
const url = require('url');
const { getUserIdFromToken } = require('../common/loginLogout');

const mysqlConnection = require('../mysqlConnection');
require('dotenv').config();

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
      const { _results } = await connection.query(signupQuery, [
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
    } = restaurant;
    const restroID = getUserIdFromToken(restaurant.token, restaurant.userrole);
    if (restroID) {
      const updateRestaurantProfileQuery =
        'CALL updateRestaurantProfileQuery(?,?,?,?,?,?,?,?,?,?,?)';

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
};

const insertFood = async (request, response) => {
  const { category, name, price, cuisine, ingredients, description } = request.body;
  const restroId = getUserIdFromToken(request.cookies.cookie, request.cookies.userrole);
  if (restroId) {
    let items = null;
    if (category === 'APPETIZERS') {
      items = 'CALL insertAppetizerItems(?,?,?,?,?,?)';
    } else if (category === 'BEVERAGES') {
      items = 'CALL insertBeveragesItems(?,?,?,?,?,?)';
    } else if (category === 'DESSERTS') {
      items = 'CALL insertDessertsItems(?,?,?,?,?,?)';
    } else if (category === 'MAIN_COURSE') {
      items = 'CALL insertMainCourseItems(?,?,?,?,?,?)';
    } else {
      items = 'CALL insertSaladsItems(?,?,?,?,?,?)';
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
};

module.exports = {
  signup,
  getBasicInfo,
  getRestaurantCompleteInfo,
  updateRestaurantProfile,
  fetchMenu,
  insertFood,
  deleteFoodItem,
};
