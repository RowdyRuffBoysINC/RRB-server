const fs = require('fs');
import readFiles from './readFiles';

const deleteFile = (fileName) => {
  console.log('​---------------------------------');
  console.log('​deleteFile -> fileName', fileName);
  console.log('​---------------------------------');

  fs.unlink(`temp/${fileName}`, ((err) => {
    if (err) {
      return err;
    }

    console.log('deleteFile() -> deleted ', fileName);
  }));
};

module.exports = deleteFile();
