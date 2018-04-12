import { fork, spawn, } from 'child_process';
import { NodeVM, } from 'vm2';

// Function that kills the process when async code runs too long.
const killProcess = (time, processInstance) => {
  return setTimeout( () => {
    process.kill(processInstance.pid);
    console.log('Tried to kill.');
  }, 1 * 60 * 1000 ); // > mins, seconds, millis - 1000
};

const stopKillProcess = (intervalInstance) => {

};

export const runJavascriptSecure = (fileName, text) => new Promise((resolve, reject) => {
  console.log('​------------------------------------------------------------');
  console.log('​exportrunJavascriptSecure -> fileName, text', fileName, text);
  console.log('​------------------------------------------------------------');

  let consoleOutput = '\n';
  let err = false;
  const child = fork('./lib/runVMWorker', { silent: true, stdio: 'inherit', });

  child.send(text);

  child.stdout.on('data', (data) => {
    console.log(`STDOUT -> data: ${data}`);
    consoleOutput = consoleOutput + data;
    console.log('​------------------------------------------------------------');
  });

  child.stderr.on('data', (data) => {
    console.log(`STDERR -> data: ${data}`);
    console.log('​------------------------------------------------------------');
    err = true;
    reject({ error: data.toString(), });
  });

  child.on('exit', (code, signal) => {
    console.log(`child process terminated due to receipt of signal ${signal}`);
    console.log('OUTPUT + err:', err, consoleOutput);
    console.log('​------------------------------------------------------------');

    if (!err) {
      console.log('sending resolve!!!!!!');
      resolve({ log: consoleOutput, });
    }
  });
});

module.exports = runJavascriptSecure;
