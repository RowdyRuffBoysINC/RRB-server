const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

import { DATABASE_URL, } from './config';

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url)
    .catch((err) => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet,
};
