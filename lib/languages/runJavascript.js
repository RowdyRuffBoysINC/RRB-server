import { execFile, } from 'child_process';

const execFilePromise = fileName => new Promise((resolve, reject) => {
  execFile('node', [ fileName, ], (error, stdout, stderr) => {
    if (error) {
      return reject(error);
    }

    return resolve({ log: stdout, error: stderr, });
  });
});

export const runJavascript = (fileName) => {

  return execFilePromise(fileName)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = runJavascript;
