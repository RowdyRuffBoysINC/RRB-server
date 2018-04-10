import { execFile, } from 'child_process';


export const runJavascript = (language, fileName) => {
  console.log('​---------------------------------------------------');
  console.log('​readCode -> language, fileName', language, fileName);
  console.log('​---------------------------------------------------');
};

module.exports = { runJavascript, };
