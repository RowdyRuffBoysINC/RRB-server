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

    // obj that holds array of rooms
    this.rooms = {};
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
      // i dont see this being used o-o
      // const sockets = [];
      socket.on("join room", data => {
        socket.join(data.room);
        
        // only add users when they call join
        if (data.room) {

          console.log(data);
          // if data.room exists add more
          if (this.rooms[data.room]) {
            this.rooms[data.room] = [...this.rooms[data.room], { id: socket.id, user: data.user }];
          }

          // if not make a new arr
          else {
            this.rooms[data.room] = [{ id: socket.id, user: data.user }];
          }

          console.log('I PUSHED A USER', this.rooms);

          socket.to(data.room).emit('add-users', {
            users: this.rooms[data.room]
          })
          
          console.log("SOMEONE CONNECTED SO, ADD USERS", socket.id);
        }
      });
      
      socket.on('add-users', (data)=> {
        console.log('SOMEONE CALLED ADD USERS', data)
        socket.to(data.room).emit('add-users', {
          users: this.rooms[data.room],
          user: data.username
        });
      }) 
    
      socket.on('make-offer', (data) => {
        console.log("MAKEOFFER");
        socket.to(data.to).emit('offer-made', {
          offer: data.offer,
          socket: socket.id
        });
      });

      socket.on('make-answer', (data) => {
        console.log('MAKEANSWER');
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
          user: data.user
        });
      });
      
      socket.on('disconnect', (data) =>{
        console.log('DISCONNECT', data);
        console.log(`user ${socket.id} disconnected`);
        console.log(Object.keys(this.rooms));
        const arrOfKeys = Object.keys(this.rooms);
        for (let key in arrOfKeys) {
          console.log(arrOfKeys[key]);

          this.rooms[arrOfKeys[key]] = this.rooms[arrOfKeys[key]].filter(
            user => {
              console.log(user);
              return user.id !== socket.id;
            }
          );

        }
        socket.emit('remove-user', socket.id);
        socket.broadcast.emit('remove-user', socket.id);
      });


      // @David & @Vernons code
        socket.on('leave room', (data) => {
          console.log('PERSON LEFT ROOM');
          console.log('​-------------------------');
          console.log('​SIO -> connect');
          console.log('​-------------------------');
          console.log('ROOMS', this.rooms);

          const arrOfKeys = Object.keys(this.rooms);
          for (let key in arrOfKeys) {
            console.log(arrOfKeys[key]);

            this.rooms[arrOfKeys[key]] = this.rooms[arrOfKeys[key]].filter(
              user => {
                console.log(user);
                return user.id !== socket.id;
              }
            );
          }
           socket.emit("remove-user", socket.id);
           socket.broadcast.emit("remove-user", socket.id);

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
