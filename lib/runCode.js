import * as LanguageRunners from './languages';

const readCode = (language, fileName, text) => {
  console.log('​---------------------------------------------------');
  console.log('​readCode -> language, fileName', language, fileName);
  console.log('​---------------------------------------------------');

  switch(language) {
  case 'javascript':
    return LanguageRunners.runJavascriptVM(fileName, text);
  default:
    return null;
  }
};

module.exports = readCode;
