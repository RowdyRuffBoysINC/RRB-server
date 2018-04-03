import ioClient from 'socket.io-client';
import io from 'socket.io';
const should = require('chai').should();
// Const { app, runServer } = require('../server');

const socketURL = 'http://localhost:8080/';

const options = {
  transports: [ 'websocket', ],
  'force new connection': true,
};

const user1 = 'Brent';
const user2 = { user: 'Vernon', };
const room1 = 'rrb';

describe('Server', () => {
  describe('Socket', () => {
    let server;
    let client;
    beforeEach(() => {
      server = io().listen(8080);
      // Client = ioClient.connect(socketURL, options);
    });
    afterEach(() => {
      server.close();
      client.disconnect();
    });

    describe('room join', () => {
      it('Should allow users to join room', () => {
        const roomData = { room: 'rrb', user: 'Brent', };
        server.on('connection', (socket) => {
          console.log('hello');
        });
        client = ioClient.connect(socketURL, options);
      });
    });
  });


  // It('Should allow users to join room', () => {
  //   // console.log('hello');
  //   // server.on('connection', (socket) => {
  //     Const socket = ioClient(socketURL);
  //     Socket.emit('join room', {room: room1, hiff: user1,});

  //     Console.log('hi');
  //     Socket.on('join room', (data) => {
  //       Console.log(data);
  //       Data.should.be.type('object');
  //       Data.should.include.keys('room', 'user');
  //       Data.room.should.be.type('string');
  //       Data.user.should.be.type('string');
  //       Socket.join(data.room);
  //     });
  //     Socket.on('leave room', (data) => {
  //       Data.should.be.type('object');
  //       Data.should.include.keys('room', 'user');
  //       Data.room.should.be.type('string');
  //       Data.user.should.be.type('string');
  //       Socket.leave(data.room);
  //     });
  //     Socket.on('code msg', (data) => {
  //       Socket.to(data.room).emit('code msg sent back to clients', data.msg);
  //     });
  // });
  // Client.disconnect();
  // Done();


  // Socket.on('join room', (data) => {
  //   Socket.join(data.room);
  // });
  // Socket.on('leave room', (data) => {
  //   Socket.leave(data.room);
  // });
  // Socket.on('code msg', (data) => {
  //   Socket.to(data.room).emit('code msg sent back to clients', data.msg);
  // });

  // Socket.on('word msg', (data) => {
  //   Socket.to(data.room).emit('word msg sent back to clients', data.msg);
  // });
});
