const fs = require('fs');
const uuid = require('uuid/v4');
/* > import readFiles from './readFiles'; */

const writeFile = (fileName, text) => new Promise ((resolve, reject) => {
  return fs.writeFile(fileName, text, ((err) => {
    if (err) {
      return reject(err);
    }
    return resolve(fileName);
  }));
});

const createFile = (language, text) => {

  // Determine file ending
  let fileEnding = '';

  switch(language.toLowerCase()) {
  case 'javascript':
    fileEnding = '.js';
    break;
  case 'python':
    fileEnding = '.py';
    break;
  default:
    return new Error('Invalid language');
  }

  // Generate file name
  const generatedFileName = uuid() + fileEnding;

  // Writing the file in temp folder
  return writeFile(`temp/${generatedFileName}`, text)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = createFile;
