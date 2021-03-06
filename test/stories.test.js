process.env.NODE_ENV = 'test';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : stories', function() {
  
  let storyDetails = ['id', 'user_id','title',
    'description','picture', 'genre', 'period', 'plotsummary', 'settingsummary'];
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
    // return knex.destroy();
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
          res.body.forEach(story => {
            expect(story.user_id).to.be.equal(1);
          });
          
          return knex('stories')
            .select()
            .where({user_id : 1})
            .then(data => {
              expect(res.body.length).to.be.equal(data.length);
              storyDetails.forEach(detail => {
                expect(res.body[0][detail]).to.be.equal(data[0][detail]);
              });
            });
        });
    });
  });

  describe('Get by ID "/:id"', function(){
    it('should return a single story given the correct ID', function(){
      let res;
      return chai.request(app)
        .get('/api/stories/10')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;

          expect(res).to.have.status(200);
          expect(res.body.user_id).to.be.equal(1);

          return knex('stories')
            .select()
            .where({user_id: 1, id: 10})
            .then(data => {
              storyDetails.forEach(detail => {
                expect(res.body[detail]).to.be.equal(data[0][detail]);
              });
            });
        });
    });
    it('should return a 404 given an incorrect ID', function(){
      return chai.request(app)
        .get('/api/stories/8888888')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
    it('should return a 404 given an ID that is not associated with the user', function(){
      return chai.request(app)
        .get('/api/stories/3')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('PUT by ID "/:id"', function(){
    const newObj = {title : 'new title'};
    it('should update a story given valid ID belonging to the user', function(){
      let res;
      return chai.request(app)
        .put('/api/stories/10')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          return knex('stories')
            .where({id : 10})
            .select();
        })
        .then(data => {
          expect(res.body[0].title).to.be.equal(data[0].title);
        });
    });
    it('should return a 404 given an invalid ID', function(){
      return chai.request(app)
        .put('/api/stories/100080')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Uh oh, not found!');
        });
    });
    it('should return a 404 given valid ID belonging to another user', function(){
      return chai.request(app)
        .put('/api/stories/3')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Uh oh, not found!');
        });
    });
  });

  describe('POST new story "/"', function(){

    it('should create a new story given valid title, associated with the correct user', function(){
      const newObj = { title : 'a new title' };
      let res;
      return chai.request(app)
        .post('/api/stories')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);

          return knex('stories')
            .where({id : res.body[0].id})
            .select();
        })
        .then(data => {
          expect(res.body[0].title).to.be.equal(data[0].title);
        });

    });
    it('should throw a status 400 error given no title', function(){
      const newObj = {picture : 'newpng.jpg'};
      return chai.request(app)
        .post('/api/stories')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Missing a title!');
        });
    });
    it('should create a new story given a title that does not include any additional fields', function(){
      const newObj = { 
        title : 'a new title',
        notathing : 'better not show up'};
      let res;
      return chai.request(app)
        .post('/api/stories')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);

          return knex('stories')
            .where({id : res.body[0].id})
            .select();
        })
        .then(data => {
          expect(res.body[0].title).to.be.equal(data[0].title);
          expect(res.body[0].notathing).to.not.exist;
        });
    });
  });

  describe('DELETE by id "/:id"', function(){
    it('should delete a story give valid ID and belonging to the user', function(){
      let res;
      return chai.request(app)
        .delete('/api/stories/10')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(204);

          return knex('stories')
            .where({id: 2})
            .select();
        })
        .then(data => {
          expect(data.length).to.be.equal(0);
        });
    });
    it('should not delete a story give valid ID and not belonging to the user', function(){
      let res;
      return chai.request(app)
        .delete('/api/stories/12')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(204);
          return knex('stories')
            .where({id: 12})
            .select();
        })
        .then(data => {
          expect(data.length).to.be.equal(1);
        });
    });
    it('should return 204 when given an invalid ID', function(){
      return chai.request(app)
        .delete('/api/stories/12789')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(204);
        });
    });
  });
});