/* eslint-disable camelcase */
/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const { getUserIdFromToken } = require('../common/loginLogout');
const mysqlConnection = require('../mysqlConnection');

require('dotenv').config();

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
  } = request.body;
  try {
    const cusID = getUserIdFromToken(token, userrole);
    if (cusID) {
      const updateCustomerProfileQuery =
        'CALL updateCustomerProfile(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

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
      ]);
      connection.end();
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

module.exports = {
  signup,
  getBasicInfo,
  getDataForCustomerUpdateProfile,
  updateProfile,
  getContactInfo,
  updateContactInfo,
  getCustomerCompleteProfile,
};
