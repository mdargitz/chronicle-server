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
        return res.json(results);
      }
      else return next();
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next)=>{
  const {id} = req.params;
  const user_id = req.user.id;
  knex('stories')
    .where({id, user_id})
    .then(result => {
      if(result.length) {
        return res.json(result[0]);
      }
      return next();
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
      return res.status(201).json(result);
    })
    .catch(err => next(err));
});

module.exports= router;