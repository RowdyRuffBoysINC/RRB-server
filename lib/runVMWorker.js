import { NodeVM, } from 'vm2';

// Allows the process to listen to message events
process.on('message', (text) => {
  // Do work
  const vm = new NodeVM({
    console: 'inherit',
    timeout: 5000,
    sandbox: {},
    require: {
      external: true,
      builtin: [ 'fs', 'path' , ],
      root: './',
      mock: {
        fs: {
          readFileSync() {
            return 'Nice try!';
          },
        },
      },
    },
  });

  // Run unsafe, not trusted code
  try {
    vm.run(text);
  }

  catch (e) {
    // Logs are for stdout in runJavascript.js to receive output from errs.
    console.log(e.message);
  }

  // Kill the process when you're done
  process.kill(process.pid);
});
