import ioClient from 'socket.io-client';
import io from 'socket.io';
const should = require('chai').should();
// const { app, runServer } = require('../server');

const socketURL = 'http://localhost:8080/';

const options ={
  transports: [ 'websocket' , ],
  'force new connection': true,
};

const user1 = 'Brent';
const user2 = {user: 'Vernon',};
const room1 = 'rrb';

describe('Server', () => {
  describe('Socket', () => {
    let server;
    let client;
    beforeEach(() => {
      server = io().listen(8080);
      // client = ioClient.connect(socketURL, options);
    });
    afterEach(() => {
      server.close();
      client.disconnect();
    });

    describe('room join', () => {
      it('Should allow users to join room', () => {
        const roomData = {room: 'rrb', user: 'Brent',};
        server.on('connection', (socket) => {
          console.log('hello');
        });
        client = ioClient.connect(socketURL, options);
      });
    });
  });

  
  // it('Should allow users to join room', () => {
  //   // console.log('hello');
  //   // server.on('connection', (socket) => {
  //     const socket = ioClient(socketURL);
  //     socket.emit('join room', {room: room1, hiff: user1,});

  //     console.log('hi');
  //     socket.on('join room', (data) => {
  //       console.log(data);
  //       data.should.be.type('object');
  //       data.should.include.keys('room', 'user');
  //       data.room.should.be.type('string');
  //       data.user.should.be.type('string');
  //       socket.join(data.room);
  //     });
  //     socket.on('leave room', (data) => {
  //       data.should.be.type('object');
  //       data.should.include.keys('room', 'user');
  //       data.room.should.be.type('string');
  //       data.user.should.be.type('string');
  //       socket.leave(data.room);
  //     });
  //     socket.on('code msg', (data) => {
  //       socket.to(data.room).emit('code msg sent back to clients', data.msg);
  //     });
    // });
    // client.disconnect();
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
