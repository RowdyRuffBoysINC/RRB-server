import runJavascript from './languages/runJavascript';

const readCode = (language, fileName) => {

  switch(language) {
  case 'javascript':
    return runJavascript(fileName);
  default:
    return null;
  }
};

module.exports = readCode;
