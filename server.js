const express = require('express');
require('dotenv').config();
const {PORT} = require('./config');
const morgan = require('morgan');


const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const storyRouter = require('./routes/story');
const characterRouter = require('./routes/character');
const settingRouter = require('./routes/setting');
const plotRouter = require('./routes/plot');

//Instantiate Express App
const app = express();

//Default Morgan Logging for all requests
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip:() => process.env.NODE_ENV === 'test'
}));

//Allow CORS for all domains (while in dev)
// app.use('/', (req,res, next)=>{
//   res.header('ACCESS-CONTROL-ALLOW-ORIGIN', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// });

//body parser
app.use(express.json());


//All Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/stories', storyRouter);
app.use('/api/characters', characterRouter);
app.use('/api/settings', settingRouter);
app.use('/api/plots', plotRouter);

//404 Handler
app.use((req,res,next)=>{
  const err = new Error('Uh oh, not found!');
  err.status = 404;
  next(err);
});

//Error Handler
app.use((req,res, next, err)=>{
  res.json({
    message : err.message,
    error: err
  });
});


app.listen(PORT, function(){
  console.log('Server running on port: ' + PORT);
});


module.exports = app;

