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

export const app = express();
export const io = socketio();
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

app.get('/', (req, res) => {
  res.status(123);
});

io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    socket.join(data.room);
  });
  socket.on('leave room', (data) => {
    socket.leave(data.room);
  });
  socket.on('code msg', (data) => {
    socket.to(data.room).emit('code msg sent back to clients', data.msg);
  });

  socket.on('word msg', (data) => {
    socket.to(data.room).emit('word msg sent back to clients', data.msg);
  });

  socket.on('whiteBoard msg', (data) => {
    socket.to(data.room).emit('whiteBoard msg sent back to clients', data.msg);
  });
});


export const runServer = (port = PORT) => {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
  io.attach(server);
};

if (require.main === module) {
  dbConnect();
  runServer();
}
