import runJavascript from './languages/runJavascript';

const readCode = (language, fileName) => {

  switch(language) {
  case 'javascript':
    return runJavascript(fileName);
  default:
    return { error: 'Cannot run that language.', };
  }
};

module.exports = readCode;
