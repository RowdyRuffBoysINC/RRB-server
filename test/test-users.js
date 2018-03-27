import chai from 'chai';
import chaiHttp from 'chai-http';
import { dbConnect, dbDisconnect, } from '../db-mongoose';
import { app, } from '../server';
import { User, } from '../users';
import { TEST_DATABASE_URL, } from '../config';

const expect = chai.expect;

// This let's us make HTTP requests
// In our tests.
// See: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/user', () => {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const firstNameB = 'ExampleB';
  const lastNameB = 'UserB';

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
          .send({
            password,
            firstName,
            lastName,
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
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with missing password', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            firstName,
            lastName,
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
            firstName,
            lastName,
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
            firstName,
            lastName,
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
      it('Should reject users with non-string first name', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName: 1234,
            lastName,
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
            expect(res.body.location).to.equal('firstName');
          });
      });
      it('Should reject users with non-string last name', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName,
            lastName: 1234,
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
            expect(res.body.location).to.equal('lastName');
          });
      });
      it('Should reject users with non-trimmed username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName,
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
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-trimmed password', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName,
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
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with empty username', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: '',
            password,
            firstName,
            lastName,
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
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with password less than ten characters', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: '123456789',
            firstName,
            lastName,
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
              'Must be at least 10 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with password greater than 72 characters', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
            firstName,
            lastName,
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
              'Must be at most 72 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with duplicate username', () => {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName,
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/users').send({
              username,
              password,
              firstName,
              lastName,
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
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Username already taken'
            );
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should create a new user', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName,
            lastName,
          })
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({ username, });
          })
          .then((user) => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then((passwordIsCorrect) => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it('Should trim firstName and lastName', () => {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `,
          })
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({ username, });
          })
          .then((user) => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
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
            firstName,
            lastName,
          },
          {
            username: usernameB,
            password: passwordB,
            firstName: firstNameB,
            lastName: lastNameB,
          }
        )
          .then(() => chai.request(app).get('/users'))
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              username,
              firstName,
              lastName,
            });
            expect(res.body[1]).to.deep.equal({
              username: usernameB,
              firstName: firstNameB,
              lastName: lastNameB,
            });
          });
      });
    });
  });
});
