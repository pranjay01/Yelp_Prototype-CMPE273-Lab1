/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const chai = require('chai');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const apiHost = 'http://localhost';
const apiPort = '3001';
const apiUrl = `${apiHost}:${apiPort}`;
const { expect } = chai;

let token = '';

it('Test Fetching Of Signup Master Data', function (done) {
  chai
    .request(apiUrl)
    .get('/static/signupMasterData')
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// InValid login
it('Testing of invalid customer Login', function (done) {
  chai
    .request(apiUrl)
    .post('/customer/login')
    .send({
      Email: 'pranjay.sagar01@gmail.com',
      Password: 'pranjay02',
    })
    .end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.text).to.equal('Incorrect Password');
      done();
    });
});

// Valid login
it('Testing of Valid customer Login', function (done) {
  chai
    .request(apiUrl)
    .post('/customer/login')
    .send({
      Email: 'pranjay.sagar01@gmail.com',
      Password: 'pranjay01',
    })
    .end(function (err, res) {
      // console.log(res);
      // console.log('res.cookie', res.header['set-cookie'][0]);
      const tokenPart = res.header['set-cookie'][0].split(';');
      // console.log('Token', tokenPart[0].substring(7));
      token = tokenPart[0].substring(7);
      expect(res).to.have.status(200);
      expect(res.text).to.equal('Successful Login');
      done();
    });
});

it('Testing for Update contact information', function (done) {
  chai
    .request(apiUrl)
    .put('/customer/updateProfile')
    .send({
      Email: 'pranjay.sagar01@gmail.com',
      NewEmail: 'pranjay.sagar01@gmail.com',
      ContactNo: 9829992248,
      Password: 'pranjay01',
      CountryCode: 1,
      token,
      userrole: 'Customer',
    })
    .end(function (err, res) {
      expect(res).to.have.status(204);
      done();
    });
});

// Restaurant search on basis of filter and search string
it('Test for Restaurant search results', function (done) {
  chai
    .request(apiUrl)
    .get('/static/fetchRestaurantResults')
    .send({
      filter: 1,
      searchString: 'mac',
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

// Restaurant Signup
it('Testing of Restaurant Signup', function (done) {
  chai
    .request(apiUrl)
    .post('/biz/signup')
    .send({
      Email: 'pranjay13@gmail.com',
      Password: 'pranjay01',
      Name: 'Joey Pizza',
      Country_ID: 1,
      State_ID: 5,
      City: 'San Jose',
      Zip: '95134',
      Street: '330 Elan Village Lane',
      Country_Code: 1,
      Phone_no: 1234567890,
    })
    .end(function (err, res) {
      // console.log(res);
      // console.log('res.cookie', res.header['set-cookie'][0]);
      const tokenPart = res.header['set-cookie'][0].split(';');
      // console.log('Token', tokenPart[0].substring(7));
      token = tokenPart[0].substring(7);
      expect(res).to.have.status(201);
      expect(res.text).to.equal('User Created');
      done();
    });
});
