import runJavascript from './languages/runJavascript';

const readCode = (language, fileName, text) => {

  switch(language) {
  case 'javascript':
    return runJavascript(fileName, text);
  default:
    return { error: 'Cannot run that language.', };
  }
};

module.exports = readCode;
