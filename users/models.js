import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: { type: String, default: '', },
  lastName: { type: String, default: '', },
});

UserSchema.methods.serialize = () => {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

export const User = mongoose.model('User', UserSchema);
