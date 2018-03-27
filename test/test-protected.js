'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer, } = require('../server');
const { User, } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL, } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// In our tests.
// See: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Protected endpoint', () => {
 const username = 'exampleUser';
 const password = 'examplePass';
 const firstName = 'Example';
 const lastName = 'User';

 before(() => {
  return runServer(TEST_DATABASE_URL);
 });

 after(() => {
  return closeServer();
 });

 beforeEach(() => {
  return User.hashPassword(password).then(password =>
   User.create({
    username,
    password,
    firstName,
    lastName,
   })
  );
 });

 afterEach(() => {
  return User.remove({});
 });

 describe('/protected', () => {
  it('Should reject requests with no credentials', () => {
   return chai
    .request(app)
    .get('/protected')
    .then(() =>
     expect.fail(null, null, 'Request should not succeed')
    )
    .catch((err) => {
     if (err instanceof chai.AssertionError) {
      throw err;
     }

     const res = err.response;
     expect(res).to.have.status(401);
    });
  });

  it('Should reject requests with an invalid token', () => {
   const token = jwt.sign(
    {
     username,
     firstName,
     lastName,
    },
    'wrongSecret',
    {
     algorithm: 'HS256',
     expiresIn: '7d',
    }
   );

   return chai
    .request(app)
    .get('/protected')
    .set('Authorization', `Bearer ${token}`)
    .then(() =>
     expect.fail(null, null, 'Request should not succeed')
    )
    .catch((err) => {
     if (err instanceof chai.AssertionError) {
      throw err;
     }

     const res = err.response;
     expect(res).to.have.status(401);
    });
  });
  it('Should reject requests with an expired token', () => {
   const token = jwt.sign(
    {
     user: {
      username,
      firstName,
      lastName,
     },
     exp: Math.floor(Date.now() / 1000) - 10, // Expired ten seconds ago
    },
    JWT_SECRET,
    {
     algorithm: 'HS256',
     subject: username,
    }
   );

   return chai
    .request(app)
    .get('/protected')
    .set('authorization', `Bearer ${token}`)
    .then(() =>
     expect.fail(null, null, 'Request should not succeed')
    )
    .catch((err) => {
     if (err instanceof chai.AssertionError) {
      throw err;
     }

     const res = err.response;
     expect(res).to.have.status(401);
    });
  });
  it('Should send protected data', () => {
   const token = jwt.sign(
    {
     user: {
      username,
      firstName,
      lastName,
     },
    },
    JWT_SECRET,
    {
     algorithm: 'HS256',
     subject: username,
     expiresIn: '7d',
    }
   );

   return chai
    .request(app)
    .get('/protected')
    .set('authorization', `Bearer ${token}`)
    .then((res) => {
     expect(res).to.have.status(200);
     expect(res.body).to.be.an('object');
     expect(res.body.data).to.equal('rosebud');
    });
  });
 });
});
