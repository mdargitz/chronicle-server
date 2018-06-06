const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

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