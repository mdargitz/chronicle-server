const knex = require('../knex');
const bcrypt = require('bcrypt');

const hashPassword = password => {
  return bcrypt.hash(password, 10);
};

const validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};

const signup = (password) => {
  hashPassword(password)
    .then(hashedpass => {
      return hashedpass;
    })
    .catch(err => console.log(err));
};

bcrypt.hash('password', 10)
  .then(result => console.log(result));


bcrypt.compare('password', '$2b$10$U.kISslCRZgMNL.bK4H8.eOTM38NzB4XH4834hY8OpbK48b0LfDg6')
  .then(result => console.log(result));
module.exports = signup;