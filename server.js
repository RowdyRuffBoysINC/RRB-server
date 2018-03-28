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
const io = socketio(app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
}));
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
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  console.log('connected!!  ', 'socket id: ', socket.id);
  socket.on('join room', (data) => {
    console.log(`${data.user} joining room ${data.room}`);
    socket.join(data.room);
  });
  socket.on('leave room', (data) => {
    console.log(`${data.user} leaving room ${data.room}`);
    socket.leave(data.room);
  });
  socket.on('chat message', (data) => {
    console.log('sending msg');
    //Sending to everyone in room except me
    // socket.to(data.room).emit('chat message', data.msg);
    //Sending to everyone in room including me
    io.in(data.room).emit('chat message', data.msg);
  });
});



// export const runServer = (port = PORT) => {
//   const server = app
//     .listen(port, () => {
//       console.info(`App listening on port ${server.address().port}`);
//     })
//     .on('error', (err) => {
//       console.error('Express failed to start');
//       console.error(err);
//     });
// };

if (require.main === module) {
  dbConnect();
  // runServer();
}
