const express = require('express');
require('dotenv').config();
const {PORT} = require('./config');
const morgan = require('morgan');

const app = express();

app.use(morgan('default'));


app.listen(PORT, function(){
  console.log('Server running on port: ' + PORT);
  console.log('Confirm database running');
});


