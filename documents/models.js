import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const DocumentSchema = mongoose.Schema({
  roomName: { type: String, required: true, unique: true, },
  codeEditorText: { type: String, default: '',},
  wordEditorText: { type: Object, default: {}, },
  whiteBoardEditorValue: { type: Object, default: {},},
});

DocumentSchema.methods.serialize = function () {
  return {
    roomName: this.roomName,
    codeEditorText: this.codeEditorText || '',
    wordEditorText: this.wordEditorText || '',
    whiteBoardEditorValue: this.whiteBoardEditorValue || '',
  };
};

export const Document = mongoose.model('Document', DocumentSchema);
