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
      socket.emit('add-users', {users: this.sockets,});
      socket.broadcast.emit('add-users', {users: [ socket.id , ],});
      socket.on('make-offer', (data) => {
        console.log(`user ${socket.id} made an offer to ${data.to}`);
        socket.to(data.to).emit('offer-made', {
          offer: data.offer,
          socket: socket.id,
        });
      });
      socket.on('make-answer', (data) =>{
        console.log(`an answer was made from ${data.answer} to ${data.to}`);
        socket.to(data.to).emit('answer-made', {
          socket: socket.id,
          answer: data.answer,
        });
      });
      socket.on('disconnect', () =>{
        console.log(`user ${socket.id} disconnected`);
        this.sockets.splice(this.sockets.indexOf(socket.id), 1);
        this.io.emit('remove-user', socket.id);
      });
      this.sockets.push(socket.id);
    });
  }
}

module.exports = SIO;
