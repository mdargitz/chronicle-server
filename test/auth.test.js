process.env.NODE_ENV = 'test';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : auth', function() {

  beforeEach(() => {
    return seedData('./db/seedDB.sql');
  });

  after(() => {
    // return knex.destroy();
  });

  
  describe('POST for new authToken "/"', function(){
    const user = {username: 'JohnSmith', password: 'password10'};
    it('should return a json web token when given existing user credentials', function(){
      return chai.request(app)
        .post('/api/auth')
        .send(user)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
        });
    });
    it('should return an error when given non-existing user credentials', function(){
      const badUser = {username:'Idontexist', password: 'password10'};
      return chai.request(app)
        .post('/api/auth')
        .send(badUser)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res.body.message).to.be.equal('That username does not exist!');
        });
    });
  });

  describe('POST for refreshed token "/refresh"', function(){
    const user = {username: 'JohnSmith', password: 'password10'};
    it('should return a json web token when given existing user credentials', function(){
      return chai.request(app)
        .post('/api/auth/')
        .send(user)
        .then(result => {
          return chai.request(app)
            .post('/api/auth/refresh')
            .send(user)
            .set('Authorization', `Bearer ${result.body.authToken}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.key('authToken');
        });
    });
    it('should return an error when given non-existing user credentials', function(){
      const user = {username: 'totesnotauser', password: 'password10'};
      return chai.request(app)
        .post('/api/auth/')
        .send(user)
        .then(result => {
          return chai.request(app)
            .post('/api/auth/refresh')
            .send(user)
            .set('Authorization', `Bearer ${result.body.authToken}`);
        })
        .then(res => {
          expect(res).to.have.status(401);
          expect(res.body).to.not.have.key('authToken');
        });
    });
  });
});