const fs = require('fs');
const uuid = require('uuid/v4');

const writeFile = (fileName, text) => new Promise ((resolve, reject) => {
  console.log('createUniqueFile -> writeFile ->',fileName, text);

  fs.writeFile(fileName, text, ((err) => {
    if (err) {
      console.log('createUniqueFile -> writeFile -> fs.writeFile', err);
      return reject(err);
    }

    return resolve(fileName);
  }));
});

const createFile = (language, text) => {
  console.log('​---------------------------------------------');
  console.log('​createFile -> language, data', language, text);
  console.log('​---------------------------------------------');

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
  const fileName = uuid() + fileEnding;

  // Writing the file in temp
  
};

module.exports = createFile;
