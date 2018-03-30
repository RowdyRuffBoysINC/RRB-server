import chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
// import { app, runServer, } from '../server.js';
import hi from '../server';
// const hi = require('../server');
// const app = express();
const expect = chai.expect;
chai.use(chaiHttp);

describe('server', (done) => {
  it('should work', () => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});


