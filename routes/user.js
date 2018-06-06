const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');

//Register a new user
router.post('/', function(req,res,next){
  const {username, password} = req.body;

  //Check that fields exist and are strings
  if (!username || typeof(username) !== 'string'){
    const err = new Error ('Missing username');
    err.status = 400;
    return next(err);
  }

  if (!password|| typeof(password) !== 'string'){
    const err = new Error ('Missing password');
    err.status = 400;
    return next(err);
  }

  //Check no leading or trailing spaces
  if (username.trim() !== username ||
      password.trim() !== password){
    const err = new Error ('You can not lead or trail with spaces');
    err.status = 400;
    return next(err);
  }

  //Check password not too short
  if (password.length < 10){
    const err = new Error('Your password must be at least 10 characters long');
    err.status = 400;
    return next(err);
  }

  //Check if username already exists
  knex('users')
    .where({username})
    .then(result => {
      if (result.length !== 0){
        const err = new Error ('Woops! That username already exists');
        err.status = 422;
        return next(err);
      }
    })
    .then(() => bcrypt.hash(password, 10))  
    .then(result => {
      const newUser = {
        username,
        password: result
      };
      return knex('users').select('id','username').insert(newUser).returning('id');
    }).then(result => res.status(201).json(result))
    .catch(err => next(err));    
});

module.exports= router;