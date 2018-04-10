const fs = require('fs');

const readFiles = (dirname, onFileContent, onError) => {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      console.log(`Err: ${err}`);
      return;
    }
    filenames.forEach((filename) => {
      const time = (new Date()).toTimeString();
      console.log(`File: ${filename} & ${time}`);
    });
  });
};

module.exports = readFiles;
