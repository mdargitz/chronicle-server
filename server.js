const express = require('express');
require('dotenv').config();
const {PORT} = require('./config');
const morgan = require('morgan');
//Instantiate Express App
const app = express();

//Default Morgan Logging for all requests
app.use(morgan('default'));

//Allow CORS for all domains (while in dev)
app.use('/', (req,res, next)=>{
  res.header('ACCESS-CONTROL-ALLOW-ORIGIN', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
});

app.listen(PORT, function(){
  console.log('Server running on port: ' + PORT);
  console.log('Confirm database running');
});


