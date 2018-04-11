import fs from 'fs';

const deleteFile = (fileName) => {

  return fs.unlink(fileName, ((err) => {
    if (err) {
      return err;
    }

  }));
};

module.exports = deleteFile;
