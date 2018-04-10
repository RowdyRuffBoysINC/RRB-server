const fs = require('fs');
const childProcess = require('child_process');

const readCode = (language, fileName) => {
  console.log('​---------------------------------------------------');
  console.log('​readCode -> language, fileName', language, fileName);
  console.log('​---------------------------------------------------');
};

module.exports = readCode;
