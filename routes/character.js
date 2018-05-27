const express = require('express');
const router = express.Router();
const knex = require('../knex');
const passport = require('passport');

//Protect endpoint with JWT
router.use('/', passport.authenticate('jwt', {
  session: false,
  failWithError : true
}));

router.get('/:storyId', (req, res, next) => {
  const user_id = req.user.id;
  const story_id = req.params.storyId;
  knex('characters')
    .select()
    .where({user_id, story_id})
    .then(result => res.json(result));
});

router.post('/:storyId', (req, res, next)=>{
  const user_id = req.user.id;
  const story_id = req.params.storyId;

  const {
    name,
    age,
    occupation,
    description,
    personality,
    background
  } = req.body;

  const newCharacter = {
    user_id,
    story_id,
    name,
    age,
    occupation,
    description,
    personality,
    background
  };

  if(!name){
    const err = new Error('Missing a name!');
    err.status = 400;
    return next(err);
  }

  knex('characters')
    .insert(newCharacter)
    .returning(['id','story_id', 'name'])
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => next(err));
});

module.exports= router;