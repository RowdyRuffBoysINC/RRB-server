import { fork, } from 'child_process';
import { NodeVM, } from 'vm2';

const killProcess = (time, process) => {
  setTimeout( () => {
    process.kill();
    console.log('Tried to kill.');
  }, 1 * 10 * 1000 ); // > mins, seconds, millis
};

export const runJavascriptSecure = (fileName, text) => {
  console.log('​------------------------------------------------------------');
  console.log('​exportrunJavascriptSecure -> fileName, text', fileName, text);
  console.log('​------------------------------------------------------------');

  const child = fork('node', [ fileName, ]);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${  data}`);
  });

  child.stderr.on('data', (data) => {
    console.log('stderr: ' + data);
  });

  child.on('close', (code, signal) => {
    console.log(`child process terminated due to receipt of signal ${signal}`);
  });

  return { log: 'Boom.', };
};

module.exports = runJavascriptSecure;
