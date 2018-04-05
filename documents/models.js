import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const DocumentSchema = mongoose.Schema({
  code: { type: String, default: '',},
  word: { type: String, default: '', },
  whiteboard: { type: String, default: '',},
});

DocumentSchema.methods.serialize = function () {
  return {
    code: this.code || '',
    word: this.word || '',
    whiteboard: this.whiteboard || '',
  };
};

export const Document = mongoose.model('Document', DocumentSchema);
