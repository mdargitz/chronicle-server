process.env.NODE_ENV = 'test';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : stories', function() {

  // let token = jwt.sign({username : 'JohnSmith', 
  //   password : '$2b$10$f2BjS7Z9aOcgJjX/iA36pu8pKO6myI2VwQzQPMGZn1cr.ffRJoPYy'},
  // JWT_SECRET, {subject : 'JohnSmith', expiresIn: '7d'});
  let token;

  beforeEach(() => {
    return seedData('./db/seedDB.sql')
      .then(() => {
        return chai.request(app)
          .post('/api/auth')
          .send({username: 'JohnSmith', password: 'password10'})
          .then(result => token = result.body.authToken);
      });
  });

  after(() => {
    return knex.destroy();
  });

  describe('Sanity Check', () =>{
    it('true should be true', ()=>{
      expect(true).to.be.true;
    });
  });

  describe('Get All "/"',function (){
    it('should return all stories for a given user', function(){
      let res;
      return chai.request(app)
        .get('/api/stories')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          
          return knex('stories')
            .select()
            .where({user_id : 1})
            .then(data => {
              console.log(data);
              
            });
        });
    });
  });
});