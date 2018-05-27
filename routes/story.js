const express = require('express');
const router = express.Router();
const knex = require('../knex');
const passport = require('passport');

//Protect endpoint with JWT
router.use('/', passport.authenticate('jwt', {
  session: false,
  failWithError : true
}));

router.get('/', (req, res, next)=>{
  knex('stories')
    .select()
    .where({user_id : req.user.id})
    .then(results => {
      if(results.length) {
        res.json(results);
      }
      else return next();
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next)=>{
  const {
    title,
    description,
    picture,
    genre,
    period,
    plotsummary,
    settingsummary
  } = req.body;

  const newStory = {
    user_id : req.user.id,
    title,
    description,
    picture,
    genre,
    period,
    plotsummary,
    settingsummary};

  if (!title){
    const err = new Error('Missing a title!');
    err.status = 400;
    return next(err);
  }
  knex('stories')
    .insert(newStory)
    .returning(['title', 'user_id'])
    .then(result =>{
      res.status(201).json(result);
    })
    .catch(err => next(err));
});

module.exports= router;