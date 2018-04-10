const fs = require('fs');
import readFiles from './readFiles';

const deleteFile = (fileName) => {
  console.log('​---------------------------------');
  console.log('​deleteFile -> fileName', fileName);
  console.log('​---------------------------------');

  return fs.unlink(fileName, ((err) => {
    if (err) {
      return err;
    }

    console.log('deleteFile() -> deleted ', fileName);
    readFiles('temp/');
  }));
};

module.exports = deleteFile;
