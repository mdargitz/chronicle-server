const express = require('express');
require('dotenv').config();
const {PORT} = require('./config');

const app = express();

app.listen(PORT, function(){
  console.log('Server running on port: ' + PORT);
  console.log('Confirm database running');
});


