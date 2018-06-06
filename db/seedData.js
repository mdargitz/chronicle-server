const util = require('util');
const exec = util.promisify(require('child_process').exec);
const knexConfig = require('../knexfile');
const environment = process.env.NODE_ENV || 'development';

module.exports = function(file) {
  return exec(`psql -f ${file} ${knexConfig[environment].connection}`);
};