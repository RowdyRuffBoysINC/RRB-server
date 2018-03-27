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

describe('Auth endpoints', () => {
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

 describe('/auth/login', () => {
  it('Should reject requests with no credentials', () => {
   return chai
    .request(app)
    .post('/auth/login')
    .then(() =>
     expect.fail(null, null, 'Request should not succeed')
    )
    .catch((err) => {
     if (err instanceof chai.AssertionError) {
      throw err;
     }

     const res = err.response;
     expect(res).to.have.status(400);
    });
  });
  it('Should reject requests with incorrect usernames', () => {
   return chai
    .request(app)
    .post('/auth/login')
    .send({ username: 'wrongUsername', password, })
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
  it('Should reject requests with incorrect passwords', () => {
   return chai
    .request(app)
    .post('/auth/login')
    .send({ username, password: 'wrongPassword', })
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
  it('Should return a valid auth token', () => {
   return chai
    .request(app)
    .post('/auth/login')
    .send({ username, password, })
    .then((res) => {
     expect(res).to.have.status(200);
     expect(res.body).to.be.an('object');
     const token = res.body.authToken;
     expect(token).to.be.a('string');
     const payload = jwt.verify(token, JWT_SECRET, {algorithm: [ 'HS256', ],});
     expect(payload.user).to.deep.equal({
      username,
      firstName,
      lastName,
     });
    });
  });
 });

 describe('/auth/refresh', () => {
  it('Should reject requests with no credentials', () => {
   return chai
    .request(app)
    .post('/auth/refresh')
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
    .post('/auth/refresh')
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
  // It('Should reject requests with an expired token', function () {
  //   Const token = jwt.sign(
  //     {
  //       User: {
  //         Username,
  //         FirstName,
  //         LastName
  //       },
  //     },
  //     JWT_SECRET,
  //     {
  //       Algorithm: 'HS256',
  //       Subject: username,
  //       ExpiresIn: Math.floor(Date.now() / 1000) - 100 // Expired ten seconds ago
  //     }
  //   );

  //   Return chai
  //     .request(app)
  //     .post('/auth/refresh')
  //     .set('authorization', `Bearer ${token}`)
  //     .then(() =>
  //       Expect.fail(null, null, 'Request should not succeed')
  //     )
  //     .catch(err => {
  //       If (err instanceof chai.AssertionError) {
  //         Throw err;
  //       }

  //       Const res = err.response;
  //       Expect(res).to.have.status(401);
  //     });
  // });
  it('Should return a valid auth token with a newer expiry date', () => {
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
   const decoded = jwt.decode(token);

   return chai
    .request(app)
    .post('/auth/refresh')
    .set('authorization', `Bearer ${token}`)
    .then((res) => {
     expect(res).to.have.status(200);
     expect(res.body).to.be.an('object');
     const token = res.body.authToken;
     expect(token).to.be.a('string');
     const payload = jwt.verify(token, JWT_SECRET, {algorithm: [ 'HS256' ,],});
     expect(payload.user).to.deep.equal({
      username,
      firstName,
      lastName,
     });
     expect(payload.exp).to.be.at.least(decoded.exp);
    });
  });
 });
});
