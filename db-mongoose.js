import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import { DATABASE_URL, } from './config';

export const dbConnect = (url = DATABASE_URL) => {
  return mongoose.connect(url)
    .catch((err) => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
};

export const dbDisconnect = () => {
  return mongoose.disconnect();
};

export const dbGet = () => {
  return mongoose;
};
