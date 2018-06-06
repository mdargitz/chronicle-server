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
  knex('plots')
    .select()
    .where({user_id, story_id})
    .then(result => res.json(result))
    .catch(err => next(err));
});

router.get('/:storyId/:id', (req, res, next)=>{
  const user_id = req.user.id;
  const story_id = req.params.storyId;
  const {id} = req.params;

  knex('plots')
    .select()
    .where({user_id, story_id, id})
    .then(result => {
      if (result[0]){
        return res.json(result[0]);
      }
      return next();
    })
    .catch(err => next(err));
});

router.put('/:storyId/:id', (req, res, next)=>{
  const user_id = req.user.id;
  const story_id = req.params.storyId;
  const {id} = req.params;

  const updateableFields = ['name', 'picture', 'description','notes'];

  const updatedCharacter = {};

  updateableFields.map(field => {
    if(field in req.body){
      updatedCharacter[field] = req.body[field];
    }
  });

  knex('plots')
    .where({user_id, story_id, id})
    .update(updatedCharacter)
    .returning(['id', 'story_id', 'name'])
    .then(results => {
      if(results[0]){
        return res.json(results);
      }
      return next();
    })
    .catch(err => next(err));
});

router.post('/:storyId', (req, res, next)=>{
  const user_id = req.user.id;
  const story_id = req.params.storyId;

  const {
    name,
    picture,
    description,
    notes
  } = req.body;

  const newCharacter = {
    user_id,
    story_id,
    name,
    picture,
    description,
    notes
  };

  if(!name){
    const err = new Error('Missing a name!');
    err.status = 400;
    return next(err);
  }

  knex('plots')
    .insert(newCharacter)
    .returning(['id','story_id', 'name'])
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/:storyId/:id', (req, res, next)=>{
  const user_id = req.user.id;
  const story_id = req.params.storyId;
  const {id} = req.params;

  knex('plots')
    .where({user_id, story_id, id})
    .del()
    .then(result =>{
      res.status(204).json(result);
    })
    .catch(err => next(err));
});

module.exports= router;