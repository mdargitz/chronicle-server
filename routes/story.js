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
      return res.json(results);
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

router.put('/:id', (req,res,next)=>{
  const {id} = req.params;
  const user_id = req.user.id;

  const updateableFields = ['title', 'description', 'picture',
    'genre', 'period', 'plotsummary', 'settingsummary'];

  const updatedStory = {};
  updateableFields.map(field => {
    if(field in req.body){
      updatedStory[field] = req.body[field];
    }});

  knex('stories')
    .where({id, user_id})
    .update(updatedStory)
    .returning(['id', 'title'])
    .then(results => {
      if(results.length){
        return res.json(results);
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

router.delete('/:id', (req, res, next)=>{
  const {id} = req.params;
  const user_id = req.user.id;

  knex('stories')
    .where({id, user_id})
    .del()
    .then(results => {
      res.status(204).json(results);
    })
    .catch(err => next(err));
});
module.exports= router;