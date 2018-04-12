import { fork, spawn, } from 'child_process';
import { NodeVM, } from 'vm2';

// Function that kills the process when async code takes too long.
// Time is preset to a minute
const killProcess = (processInstance, time = 10000) => {
  return setTimeout( () => {
    try {
      process.kill(processInstance.pid);
      console.log('Tried to kill.');
    }
    catch (e) {
      console.warn('Process does not exist.');
    }
  }, time ); // > mins, seconds, millis - 1000
};

const stopKillProcess = (intervalInstance) => {
  console.log('clear interval x.x --------');
  clearTimeout(intervalInstance);
};

export const runJavascriptSecure = text => new Promise((resolve, reject) => {
  console.log('​------------------------------------------------------------');
  console.log('​exportrunJavascriptSecure ->text',text);
  console.log('​------------------------------------------------------------');

  let consoleOutput = '\n';
  let err = false;
  const child = fork('./lib/runVMWorker', { silent: true, stdio: 'inherit', });

  const killProcessId = killProcess(child);

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
      stopKillProcess(killProcessId);
      resolve({ log: consoleOutput, });
    }
  });
});

module.exports = runJavascriptSecure;
