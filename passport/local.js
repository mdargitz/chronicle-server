//import resources from package
const {Strategy : LocalStrategy} = require('passport-local');
const knex = require('../knex');

const localStrategy = new LocalStrategy((username, password, done) => {

  let user;

  knex('users')
    .where('username', username)
    .then(results => {
      user = results;
      if(!user){
        return Promise.reject({
          resason: 'LoginError',
          message : 'That username does not exist!',
          location: 'username'
        });
      }

      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        return Promise.reject({
          reason: 'LoginError',
          message: 'That username is not valid!',
          location: 'username'
        });
      }
      done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError'){
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;