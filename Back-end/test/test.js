/* eslint-disable func-names */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const chai = require('chai');

const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const apiHost = 'http://localhost';
const apiPort = '3001';
const apiUrl = `${apiHost}:${apiPort}`;
const { expect } = chai;

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjg5ZmM1MDM4MWRiMzNkZjk4ODVhZmMiLCJ1c2Vycm9sZSI6IkN1c3RvbWVyIiwiZW1haWwiOiJwcmFuamF5LnNhZ2FyMDFAZ21haWwuY29tIiwiaWF0IjoxNjA0NjExNDk1LCJleHAiOjE2MDU2MTk0OTV9.N68-KKJtyMck57E36ohJq2YSFXYY1X3EupBikrbAuB0';

it('Test Fetching Of Signup Master Data', function (done) {
  this.timeout(1000);
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
  this.timeout(1000);
  chai
    .request(apiUrl)
    .post('/customer/login')
    .send({
      Email: 'pranjay.sagar01@gmail.com',
      Password: 'pranjay02',
    })
    .end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.text).to.equal('Invalid Credentials');
      done();
    });
});

// Valid login
it('Testing of Valid customer Login', function (done) {
  this.timeout(1000);
  chai
    .request(apiUrl)
    .post('/customer/login')
    .send({
      Email: 'pranjay.sagar05@gmail.com',
      Password: 'pranjay01',
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      let Resulytoken = res.text;
      Resulytoken = Resulytoken.split(' ');
      expect(Resulytoken[0]).to.equal('JWT');
      done();
    });
});

// Updating profile with correct authentication login
it('Testing for Update contact information with correct authentication', function (done) {
  this.timeout(1000);
  chai
    .request(apiUrl)
    .put('/customer/updateProfile')
    .set({ Authorization: `JWT ${token}` })
    .send({
      Password: 'pranjay01',
      customerInfo: {
        CustomerID: '5f89fc50381db33df9885afc',
        CountryCode: 1,
        Email: 'pranjay.sagar01@gmail.com',
        NewEmail: 'pranjay.sagar01@gmail.com',
        PhoneNo: 9829992248,
      },
    })
    .end(function (err, res) {
      expect(res).to.have.status(204);
      done();
    });
});

// Updating profile with correct wrong authentication login
it('Testing for Update contact information with invalid authentication', function (done) {
  this.timeout(1000);
  chai
    .request(apiUrl)
    .put('/customer/updateProfile')
    .set({ Authorization: `JWT ` })
    .send({
      Password: 'pranjay01',
      customerInfo: {
        CustomerID: '5f89fc50381db33df9885afc',
        CountryCode: 1,
        Email: 'pranjay.sagar01@gmail.com',
        NewEmail: 'pranjay.sagar01@gmail.com',
        PhoneNo: 9829992248,
      },
    })
    .end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.text).to.equal('Unauthorized');
      done();
    });
});

// Restaurant search on basis of filter and search string
it('Test for Restaurant search results', function (done) {
  chai
    .request(apiUrl)
    .get('/static/fetchRestaurantResults')
    .query({ filter: 1, searchString: 'mac', selectedPage: 0 })
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
      Email: 'pranjay16@gmail.com',
      Password: 'pranjay01',
      Name: 'Joey Pizza',
      CountryName: 'U.S.A',
      StateName: 'California',
      City: 'San Jose',
      Zip: '95134',
      Street: '330 Elan Village Lane',
      CountryCode: 1,
      PhoneNo: 1234567890,
    })
    .end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.text).to.equal('User Created');
      done();
    });
});
