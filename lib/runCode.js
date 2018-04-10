import * as LanguageRunners from './languages';

const readCode = (language, fileName) => {
  console.log('​---------------------------------------------------');
  console.log('​readCode -> language, fileName', language, fileName);
  console.log('​---------------------------------------------------');

  switch(language) {
  case 'javascript':
    return LanguageRunners.runJavascript(fileName);
  default:
    return null;
  }
};

module.exports = readCode;
