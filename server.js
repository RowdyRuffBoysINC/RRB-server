'use strict';
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { PORT, CLIENT_ORIGIN, DATABASE_URL, } from './config';
import { dbConnect, } from './db-mongoose';
import { usersRouter, } from './users';
import { authRouter, localStrategy, jwtStrategy, } from './auth';

mongoose.Promise = global.Promise;
export const app = express();


// Logging
app.use(morgan('common'));

// CORS
app.use(
  cors({ origin: CLIENT_ORIGIN, })
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
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', (err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer, };
