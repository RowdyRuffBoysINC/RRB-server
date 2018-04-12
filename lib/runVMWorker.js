import { NodeVM, } from 'vm2';

// Allows the process to listen to message events
process.on('message', (text) => {
  // Do work
  const vm = new NodeVM({
    console: 'inherit',
    sandbox: { /* Allow functions like setTimeout, etc. */ },
    require: {
      external: true,
      builtin: [ 'fs', 'path' , ],
      root: './',
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
