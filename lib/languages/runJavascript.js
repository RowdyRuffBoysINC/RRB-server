import { fork, spawn, } from 'child_process';
import { NodeVM, } from 'vm2';

// Function that kills the process when async code takes too long.
// Time is preset to a minute
const killProcess = (processInstance, time = 10000) => {
  return setTimeout( () => {
    try {
      process.kill(processInstance.pid);

    }
    catch (e) {
      console.warn('Process does not exist.');
    }
  }, time ); // > mins, seconds, millis - 1000
};

const stopKillProcess = (intervalInstance) => {

  clearTimeout(intervalInstance);
};

export const runJavascriptSecure = text => new Promise((resolve, reject) => {

  let consoleOutput = '\n';
  let err = false;
  const child = fork('./lib/runVMWorker', { silent: true, stdio: 'inherit', });

  const killProcessId = killProcess(child);

  child.send(text);

  child.stdout.on('data', (data) => {
    consoleOutput = consoleOutput + data;
  });

  child.stderr.on('data', (data) => {
    err = true;
    reject({ error: data.toString(), });
  });

  child.on('exit', (code, signal) => {
    if (!err) {
      stopKillProcess(killProcessId);
      resolve({ log: consoleOutput, });
    }
  });
});

module.exports = runJavascriptSecure;
