import mongoose from 'mongoose';

import { DATABASE_URL, } from './config';

mongoose.Promise = global.Promise;

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
