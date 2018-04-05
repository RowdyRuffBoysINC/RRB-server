import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const DocumentSchema = mongoose.Schema({
  codeEditorText: { type: String, default: '',},
  wordEditorText: { type: Object, default: {}, },
  whiteBoardEditorValue: { type: Object, default: {},},
});

DocumentSchema.methods.serialize = function () {
  return {
    codeEditorText: this.codeEditorText || '',
    wordEditorText: this.wordEditorText || '',
    whiteBoardEditorValue: this.whiteBoardEditorValue || '',
  };
};

export const Document = mongoose.model('Document', DocumentSchema);
