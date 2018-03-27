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
  }

  connect() {
    this.io.on('connection', (socket) => {

    });
  }
}

module.exports = SIO;
