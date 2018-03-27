import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { User, } from './models';
import { jwtStrategy, } from './../auth/strategies';

export const router = express.Router();

mongoose.Promise = global.Promise;

passport.use(jwtStrategy);
router.use(bodyParser.json());
const jwtAuth = passport.authenticate('jwt', { session: false, });


router.get('/', async (req, res) => {
  try {
    return await User
      .find()
  }
  catch (err) {
    console.error(err);
  }
});

// Post to register a new user
router.post('/', (req, res) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName',];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField,
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName',];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField,
    });
  }

  /*
  If the username and password aren't trimmed we give an error.
  We'll silently trim the other fields, because they aren't credentials
  used to log in, so it's less of a problem.
  */
  const explicityTrimmedFields = ['username', 'password',];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  const sizedFields = {
    username: {
      min: 1,
      max: 15,
    },
    password: {
      min: 8,
      // Bcrypt truncates after 72 characters
      max: 72,
    },
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField,
    });
  }

  let { username, password, firstName = '', lastName = '', questions } = req.body; // eslint-disable-line
  // Username and password come in pre-trimmed, otherwise we throw an error
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({ username, })
    .count()
    .then((count) => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username',
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then((digest) => {
      return User.create({
        username,
        password: digest,
        firstName,
        lastName,
      });
    })
    .then((user) => {
      return res.status(201).location(`/users/${user.id}`).json(user.serialize());
    })
    .catch((err) => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error', });
    });
});
