require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { PORT, CLIENT_ORIGIN, } from './config';
import { dbConnect, } from './db-mongoose';
import { usersRouter, } from './users';
import { authRouter, localStrategy, jwtStrategy, } from './auth';

mongoose.Promise = global.Promise;
const app = express();


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

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false, });

// A protected endpoint which needs a valid JWT to access it
app.get('/protected', jwtAuth, (req, res) => {
  return res.json({ data: 'rosebud', });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found', });
});

// Referenced by both runServer and closeServer. closeServer
// Assumes runServer has run and set `server` to a server object

export const runServer = (port = PORT) => {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
};

if (require.main === module) {
  dbConnect();
  runServer();
}
