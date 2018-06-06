process.env.NODE_ENV = 'test';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const seedData = require('../db/seedData');

const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : settings', function() {
  
  let settingDetails = ['id', 'user_id','story_id', 'name',
    'description','picture', 'notes'];
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
    it('should return all settings for a story and given user', function(){
      let res;
      return chai.request(app)
        .get('/api/settings/10')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;

          expect(res).to.have.status(200);
          res.body.forEach(story => {
            expect(story.user_id).to.be.equal(1);
          });
          
          return knex('settings')
            .select()
            .where({user_id : 1, story_id : 10})
            .then(data => {
              expect(res.body.length).to.be.equal(data.length);
              settingDetails.forEach(detail => {
                expect(res.body[0][detail]).to.be.equal(data[0][detail]);
              });
            });
        });
    });
  });

  describe('Get by ID "/:id"', function(){
    it('should return a single setting given the correct ID', function(){
      let res;
      return chai.request(app)
        .get('/api/settings/10/100')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;

          expect(res).to.have.status(200);
          expect(res.body.user_id).to.be.equal(1);
          expect(res.body.story_id).to.be.equal(10);

          return knex('settings')
            .select()
            .where({user_id: 1, id: 100})
            .then(data => {
              settingDetails.forEach(detail => {
                expect(res.body[detail]).to.be.equal(data[0][detail]);
              });
            });
        });
    });
    it('should return a 404 given an incorrect ID', function(){
      return chai.request(app)
        .get('/api/settings/10/9089787')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
    it('should return a 404 given an ID that is not associated with the user', function(){
      return chai.request(app)
        .get('/api/settings/10/102')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

  describe('PUT by ID "/:id"', function(){
    const newObj = {name : 'new name'};
    it('should update a setting given valid ID, valid storyID and belonging to the user', function(){
      let res;
      return chai.request(app)
        .put('/api/settings/10/100')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
          return knex('settings')
            .where({id : 100})
            .select();
        })
        .then(data => {
          expect(res.body[0].name).to.be.equal(data[0].name);
        });
    });
    it('should return a 404 given an invalid ID', function(){
      return chai.request(app)
        .put('/api/settings/10/10080')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Uh oh, not found!');
        });
    });
    it('should return a 404 given valid ID belonging to another user', function(){
      return chai.request(app)
        .put('/api/settings/10/102')
        .send(newObj)
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal('Uh oh, not found!');
        });
    });
  });

  describe('POST new setting "/"', function(){

    it('should create a new setting given valid title, associated with the correct user', function(){
      const newObj = { name : 'a new name' };
      let res;
      return chai.request(app)
        .post('/api/settings/10')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);

          return knex('settings')
            .where({id : res.body[0].id})
            .select();
        })
        .then(data => {
          expect(res.body[0].name).to.be.equal(data[0].name);
        });

    });
    it('should throw a status 400 error given no name', function(){
      const newObj = {picture : 'newpng.jpg'};
      return chai.request(app)
        .post('/api/settings/10')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Missing a name!');
        });
    });
    it('should create a new setting given a name, that does not include any additional fields', function(){
      const newObj = { 
        name : 'a new name',
        notathing : 'better not show up'};
      let res;
      return chai.request(app)
        .post('/api/settings/10')
        .set('Authorization', `Bearer ${token}`)
        .send(newObj)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(201);

          return knex('settings')
            .where({id : res.body[0].id})
            .select();
        })
        .then(data => {
          expect(res.body[0].name).to.be.equal(data[0].name);
          expect(res.body[0].notathing).to.not.exist;
        });
    });
  });

  describe('DELETE by id "/:id"', function(){
    it('should delete a setting given valid ID and belonging to the user', function(){
      let res;
      return chai.request(app)
        .delete('/api/settings/10/100')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(204);

          return knex('settings')
            .where({id: 100})
            .select();
        })
        .then(data => {
          expect(data.length).to.be.equal(0);
        });
    });
    it('should not delete a setting given valid ID and not belonging to the user', function(){
      let res;
      return chai.request(app)
        .delete('/api/settings/12/102')
        .set('Authorization', `Bearer ${token}`)
        .then(_res => {
          res = _res;
          expect(res).to.have.status(204);
          return knex('settings')
            .where({id: 102})
            .select();
        })
        .then(data => {
          expect(data.length).to.be.equal(1);
        });
    });
    it('should return 204 when given an invalid ID', function(){
      return chai.request(app)
        .delete('/api/settings/10/12789')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(204);
        });
    });
  });
});