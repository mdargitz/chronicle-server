const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Sanity Check', ()=> {
  it('true should be true', ()=>{
    expect(true).to.be.true;
  });
});

describe('Enviornment', function(){
  it('NODE_ENV should be "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });
});

describe('Catch-all 404 handler', function(){
  it('should return a 404 given an invalid path', function(){
    return chai.request(app)
      .get('/not/a/path')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});