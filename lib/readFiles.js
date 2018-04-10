const fs = require('fs');

const readFiles = (dirname, onFileContent, onError) => {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      console.log(`Err: ${err}`);
      return;
    }

    filenames.forEach((filename) => {
      console.log(`File: ${filename}`);
    });
  });
};

module.exports = readFiles;
