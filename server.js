require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import { dbConnect } from './db-mongoose';
import { router as usersRouter } from './users';
import { router as documentsRouter } from './documents';
import { PORT, CLIENT_ORIGIN } from './config';
import { router as authRouter, localStrategy, jwtStrategy } from './auth';

import SIO from './lib/sio';

export const app = express();
mongoose.Promise = global.Promise;

// Logging
app.use(morgan('common'));

// CORS
app.use(
  cors({ origin: CLIENT_ORIGIN, })
);

app.use(
  bodyParser.json()
);


passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/documents', documentsRouter);

export const runServer = (port = PORT) => {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
  const sio = new SIO(server);
  sio.connect();
};

if (require.main === module) {
  dbConnect();
  runServer();
}
