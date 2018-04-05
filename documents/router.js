import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

import { Document, } from './models';

export const router = express.Router();

mongoose.Promise = global.Promise;

router.use(bodyParser.json());

router.get('/', asyncHandler(async (req, res, next) => {
  const documents = await Document.find();
  res.send(documents)
}));

router.post('/', asyncHandler(async (req, res, next) => {
  let { code, word, whiteboard, } = req.body;
  
}));
// Post to register a new user
router.post('/', asyncHandler(async (req, res, next) => {
  let { username, password, firstName = '', lastName = '', questions } = req.body; // eslint-disable-line (Prefer const over let but since some vars get reassigned value, use let for all)
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
  const usernameIsNotTrimmed = username !== username.trim();
  const passwordIsNotTrimmed = password !== password.trim();

  // Silently trimming fields could result in user confusion when attempting to log in.
  if (usernameIsNotTrimmed || passwordIsNotTrimmed) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
    });
  }
  // Bcrypt truncates after 72 character
  let wrongPasswordSize = password.length <= 8 || password.length >= 72;
  let wrongUsernameSize = username.length <= 1 || username.length >= 15;


  if (wrongUsernameSize || wrongPasswordSize) {
    return res.status(422).json({
      reason: 'ValidationError',
      message: 'Password must be between 8-72 characters. Username must be between 1-15 characters',
    });
  }

  // Username and password come in pre-trimmed, otherwise we throw an error
  firstName = firstName.trim();
  lastName = lastName.trim();

  const usersFound = await User
    .find({ username, })
    .count();
  if (usersFound > 0) {
    return Promise.reject({
      reason: 'ValidationError',
      message: 'Username already exists',
    });
  }

  const hashedPassword = await User.hashPassword(password);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });
  res.status(201).location(`/users/${newUser.id}`).json(newUser.serialize());
}));
