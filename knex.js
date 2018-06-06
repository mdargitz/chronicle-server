const knexConfig = require('./knexfile');

// const environment = process.env.environment || 'development';
const environment = process.env.NODE_ENV || 'development';

console.log('the environment is' + environment);
module.exports = require('knex')(knexConfig[environment]);
