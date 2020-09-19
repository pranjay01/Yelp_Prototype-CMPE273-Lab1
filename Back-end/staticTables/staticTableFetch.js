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

module.exports = { getSignupMasterData, getSignupMasterDataCustomer };