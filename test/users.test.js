process.env.NODE_ENV = 'test';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : users', function() {

  beforeEach(() => {
    return seedData('./db/dropDB.sql');
  });

  after(() => {
    return knex.destroy();
  });

  describe('POST a new user "/"', function(){
    it('should create a new user given a valid username and password', function(){
      let res;
      const newUser = {username:'testuser50', password: 'password50'};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);

          return knex('users')
            .where({username : 'testuser50'});
        })
        .then(data => {
          expect(data[0]).to.have.keys(['id', 'username', 'password']);
        });
    });
    it('should return an error when missing username', function(){
      const newUser = {password: 'password50'};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Missing username');
        });
    });
    it('should return an error when missing password', function(){
      const newUser = {username: 'testuser50'};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Missing password');
        });
    });
    it('should return an error with trailing spaces', function(){
      const newUser = {username: 'testuser50', password:'password50  '};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('You can not lead or trail with spaces');
        });
    });

    it('should return an error when password less than 10 characters', function(){
      const newUser = {username: 'testuser50', password:'password'};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Your password must be at least 10 characters long');
        });
    });
    it('should return an error when username already exists', function(){
      const newUser = {username: 'testuser50', password:'password50'};
      return chai.request(app)
        .post('/api/users')
        .send(newUser)
        .then(() => {
          return chai.request(app)
            .post('/api/users')
            .send(newUser);
        })
        .then(res => {
          expect(res).to.have.status(422);
          expect(res.body.message).to.be.equal('Woops! That username already exists');
        });
    });
  });
});