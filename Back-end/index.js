/* eslint-disable func-names */

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const config = require('./config');

const { auth } = require('./Utils/passport');

auth();
// const mysqlConnection = require("./mysqlConnection");
// const cors = require('cors');
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
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);
// app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', config.frontEndUrl);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
// app.options('GET,HEAD,POST,PUT,DELETE,OPTIONS', cors());
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   poolSize: 500,
//   bufferMaxEntries: 0,
// };

// const { mongoDB } = require('./Models/config');

// mongoose.connect(mongoDB, options, (err, res) => {
//   if (err) {
//     console.log('MongoDB connection Failesd', err);
//   } else {
//     console.log('MongoDB Connected Succesfully', res);
//   }
// });

app.use('/biz', bizProfile);
app.use('/customer', custProfile);
app.use('/static', staticTabbles);
app.listen(3001);
