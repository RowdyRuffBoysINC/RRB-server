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
  const generatedFileName = uuid() + fileEnding;

  // Writing the file in temp folder
  return writeFile(`temp/${generatedFileName}`, text)
    .then((data) => {
      console.log('​-------------------------');
      console.log('​createFile -> writeFile response: ', data);
      console.log('​-------------------------');

      return data;
    })
    .catch((err) => {
      console.log('​-------------------------');
      console.log('​createFile -> writeFile err: ', err);
      console.log('​-------------------------');
    });
};

module.exports = createFile;
