const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
  knex('characters')
    .select()
    .then(result => res.json(result));
});

module.exports= router;