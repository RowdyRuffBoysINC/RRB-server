import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const DocumentSchema = mongoose.Schema({
  code: { type: String, default: '',},
  word: { type: Object, default: {}, },
  whiteBoard: { type: Object, default: {},},
});

DocumentSchema.methods.serialize = function () {
  return {
    code: this.code || '',
    word: this.word || '',
    whiteBoard: this.whiteBoard || '',
  };
};

export const Document = mongoose.model('Document', DocumentSchema);
