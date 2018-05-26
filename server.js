const express = require('express');
const dotenv = require('dotenv').config();
const {PORT} = require('./config');
const morgan = require('morgan');


//Routers Import
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const storyRouter = require('./routes/story');
const characterRouter = require('./routes/character');
const settingRouter = require('./routes/setting');
const plotRouter = require('./routes/plot');

//Passport import and setup
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
passport.use(localStrategy);
passport.use(jwtStrategy);

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
console.log('about to hit user router');
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
app.use((err, req,res, next)=>{
  res
    .status(err.status || 500)
    .json({'message':err.message});
});


app.listen(PORT, function(){
  console.log('Server running on port: ' + PORT);
});


module.exports = app;

