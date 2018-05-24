const knexConfig = require('./knexfile');

const environment = process.env.environment || 'development';

module.exports = require('knex')(knexConfig[environment]);