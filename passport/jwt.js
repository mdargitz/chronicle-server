//import strategies from passport and key from .env
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {JWT_SECRET} = require('../config');

const options = {
  secretOrKey : JWT_SECRET,
  jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  algorithms: ['HS256']
};

//set up strategy- on done, return null for errors and user
const jwtStrategy = new JwtStrategy(options, 
  (payload, done) => {
    done(null, payload.user);
  });

module.exports = jwtStrategy;