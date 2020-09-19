/* eslint-disable func-names */
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
// const mysqlConnection = require("./mysqlConnection");
const bizProfile = require('./routes/bizProfileRoutes');
const custProfile = require('./routes/customerProfileRoutes');
const staticTabbles = require('./routes/staticTableRoutes');
// const customerRoutes = require("./routes/cus");

const app = express();
// use express session to maintain session data
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60,
    activeDuration: 5 * 60,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/biz', bizProfile);
app.use('/customer', custProfile);
app.use('/static', staticTabbles);
app.listen(3001);
