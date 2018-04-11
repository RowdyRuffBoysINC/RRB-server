import { execFile, } from 'child_process';

export const runJavascriptSecure = (fileName, text) => {
  console.log('​------------------------------------------------------------');
  console.log('​exportrunJavascriptSecure -> fileName, text', fileName, text);
  console.log('​------------------------------------------------------------');

  return { log: 'Boom.', };
};

module.exports = runJavascriptSecure;
