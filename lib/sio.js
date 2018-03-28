/* eslint-disable */
import os from 'os';

const socketIO = require('socket.io'); // @brentguistwite change this to import
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

      socket.on('message', function(message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
      });
    
      socket.on('create or join', function(room) {
        log('Received request to create or join room ' + room);
    
        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        log('Room ' + room + ' now has ' + numClients + ' client(s)');
    
        if (numClients === 0) {
          socket.join(room);
          log('Client ID ' + socket.id + ' created room ' + room);
          socket.emit('created', room, socket.id);
    
        } else if (numClients === 1) {
          log('Client ID ' + socket.id + ' joined room ' + room);
          io.sockets.in(room).emit('join', room);
          socket.join(room);
          socket.emit('joined', room, socket.id);
          io.sockets.in(room).emit('ready');
        } else { // max two clients
          socket.emit('full', room);
        }
      });
    
      socket.on('ipaddr', function() {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
          ifaces[dev].forEach(function(details) {
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
              socket.emit('ipaddr', details.address);
            }
          });
        }
      });

      socket.on('disconnect', () =>{
        console.log(`user ${socket.id} disconnected`);
        this.sockets.splice(this.sockets.indexOf(socket.id), 1);
        socket.emit('remove-user', socket.id);
        socket.broadcast.emit('remove-user', socket.id);
      });
      this.sockets.push(socket.id);
    });
  }
}

module.exports = SIO;
