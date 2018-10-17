import chai from 'chai';
import chaiHttp from 'chai-http';

import { dbConnect, dbDisconnect } from '../db-mongoose';
import { app } from '../server';
import { User } from '../users';
import { TEST_DATABASE_URL } from '../config';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/user', () => {
  const username = 'exampleUser';
  const password = 'examplePass';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';

  before(() => {
    return dbConnect(TEST_DATABASE_URL);
  });

  after(() => {
    return dbDisconnect();
  });

  beforeEach(() => { });

  afterEach(() => {
    return User.remove({});
  });

  describe('/users', () => {
    describe('POST', () => {
      it('Should reject users with missing username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({ password, })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with missing password', () => {
        return chai
          .request(app)
          .post('/users')
          .send({ username, })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-string username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: 1234,
            password,

          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-string password', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: 1234,

          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-trimmed username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: ` ${username} `,
            password,

          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
          });
      });
      it('Should reject users with empty username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: '',
            password,

          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(500);
          });
      });
      it('Should reject users with password greater than 72 characters', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),

          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
          });
      });
      it('Should reject users with duplicate username', () => {
        // Create an initial user
        return User.create({
          username,
          password,
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/users').send({
              username,
              password,
            })
          )
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(500);
          });
      });
      it('Should create a new user', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,

          })
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username'
            );
            expect(res.body.username).to.equal(username);
            return User.findOne({ username, });
          })
          .then((user) => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then((passwordIsCorrect) => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });

    describe('GET', () => {
      it('Should return an empty array initially', () => {
        return chai.request(app).get('/users').then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('Should return an array of users', () => {
        return User.create(
          {
            username,
            password,

          },
          {
            username: usernameB,
            password: passwordB,
          }
        )
          .then(() => chai.request(app).get('/users'))
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).contains({ username, });
            expect(res.body[1]).contains({ username: usernameB, });
          });
      });
    });
  });
});
