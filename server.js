import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import socketio from 'socket.io';

import { dbConnect, } from './db-mongoose';
import { router as usersRouter, } from './users';
import { PORT, CLIENT_ORIGIN, } from './config';
import { router as authRouter, localStrategy, jwtStrategy, } from './auth';

import SIO from './lib/sio';

export const app = express();
const io = socketio();
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

// Io.on('connection', (socket) => {
//   Socket.on('join room', (data) => {
//     Socket.join(data.room);
//   });
//   Socket.on('leave room', (data) => {
//     Socket.leave(data.room);
//   });
//   Socket.on('code msg', (data) => {
//     Socket.to(data.room).emit('code msg sent back to clients', data.msg);
//   });

//   Socket.on('word msg', (data) => {
//     Socket.to(data.room).emit('word msg sent back to clients', data.msg);
//   });
// });


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
  // Io.attach(server);
};

if (require.main === module) {
  dbConnect();
  runServer();
}
