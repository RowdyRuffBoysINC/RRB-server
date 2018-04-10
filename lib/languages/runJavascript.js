import { execFile, } from 'child_process';

const execFilePromise = fileName => new Promise((resolve, reject) => {
  return execFile(fileName, null, (error, stdout, stderr) => {
    if (error) {
      console.log('​-------------');
      console.log('​runJS -> execFilePromise -> execFile -> error', error);
      console.log('​-------------');

      return reject(error);
    }

    console.log('​-------------');
    console.log('​runJS -> execFilePromise -> execFile -> response', { log: stdout, error: stderr, });
    console.log('​-------------');

    return resolve({ log: stdout, error: stderr, });
  });
});

export const runJavascript = (fileName) => {
  console.log('​---------------------------------------------------');
  console.log('​readJS -> fileName: ', fileName);
  console.log('​---------------------------------------------------');

  return execFilePromise(fileName)
    .then((data) => {
      console.log('​----------------------------------');
      console.log('​runJavascript -> data', data);
      console.log('​----------------------------------');
      return data;
    })
    .catch((err) => {
      console.log('​--------------------------------');
      console.log('​runJavascript -> err', err);
      console.log('​--------------------------------');
      return err;
    });
};

module.exports = { runJavascript, };
