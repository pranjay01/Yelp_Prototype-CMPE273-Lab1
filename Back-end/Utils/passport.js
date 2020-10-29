/* eslint-disable func-names */
/* eslint-disable consistent-return */
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { Passport } = require('passport');
// const { secret } = require('./config');
const kafka = require('../kafka/client');
const config = require('../config');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const passport = new Passport();

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    // secretOrKey: process.env.SESSION_SECRET,
    secretOrKey: config.SESSION_SECRET,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, callback) => {
      // eslint-disable-next-line no-underscore-dangle
      const userId = jwtPayload._id;
      const role = jwtPayload.userrole;
      const { email } = jwtPayload;
      // eslint-disable-next-line consistent-return
      const data = {
        api: 'validate',
        data: { userId, role, email },
      };
      kafka.make_request(config.kafkacommontopic, data, function (err, results) {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, false);
        }
      });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
