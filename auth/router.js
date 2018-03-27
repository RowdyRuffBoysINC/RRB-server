import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config';

const router = express.Router();


const createAuthToken = (user) => {
  return jwt.sign({ user, }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

const localAuth = passport.authenticate('local', { session: false, });
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken, });
});

const jwtAuth = passport.authenticate('jwt', { session: false, });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken, });
});

module.exports = { router, };
