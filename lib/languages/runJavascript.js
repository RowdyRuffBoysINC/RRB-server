import { fork, spawn, } from 'child_process';
import { NodeVM, } from 'vm2';

const killProcess = (time, process) => {
  setTimeout( () => {
    process.kill();
    console.log('Tried to kill.');
  }, 10 * 1000 ); // > mins, seconds, millis - 1000
};

export const runJavascriptSecure = (fileName, text) => {
  console.log('​------------------------------------------------------------');
  console.log('​exportrunJavascriptSecure -> fileName, text', fileName, text);
  console.log('​------------------------------------------------------------');

  let consoleOutput = '\n';

  const child = fork(fileName, { silent: true, stdio: 'inherit', });
  child.send(text);

  child.stdout.on('data', (data) => {
    console.log(`STDOUT -> data: ${data}`);
    consoleOutput = consoleOutput + data;
    console.log('​------------------------------------------------------------');
  });

  child.stderr.on('data', (data) => {
    console.log(`STDERR -> data: ${data}`);
    console.log('​------------------------------------------------------------');
  });

  child.on('close', (code, signal) => {
    console.log(`child process terminated due to receipt of signal ${signal}`);
    console.log('OUTPUT:', consoleOutput);
    console.log('​------------------------------------------------------------');
  });

  return { log: 'Boom.', };
};

module.exports = runJavascriptSecure;
