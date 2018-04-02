/* eslint-disable */
import os from 'os';

import socketIO from "socket.io";
/**
 * Creates a new SocketIO object setup for
 * Project RRB.
 *
 * @class SIO
 */
class SIO {
  /**
   * Creates an instance of SIO.
   * @param {any} server
   * @memberof SIO
   */
  constructor(server) {
    this.io = socketIO(server);
    this.sockets = [];
  }

  connect() {
    console.log('connecting...');
    this.io.on('connection', (socket) => {
      console.log(`User with id ${socket.id} connected`);

      /**
       * Helpers
       */
      function log (){
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
      }
      
      const sockets = [];

      socket.on('add-users', (data)=> {
        socket.emit('add-users', {
          users: sockets,
        });
      })
      

      socket.broadcast.emit('add-users', {
        users: [socket.id],
      });

      socket.on('make-offer', (data) => {
        socket.to(data.to).emit('offer-made', {
          offer: data.offer,
          socket: socket.id
        });
      });

      socket.on('make-answer', (data) => {
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer
        });
      });
      
      socket.on('disconnect', (data) =>{
        console.log(`user ${socket.id} disconnected`);
        this.sockets.splice(this.sockets.indexOf(socket.id), 1);
        socket.emit('remove-user', socket.id);
        socket.broadcast.emit('remove-user', socket.id);
      });

      this.sockets.push(socket.id);

      // @David & @Vernons code
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
  }
}

module.exports = SIO;
