import { NodeVM, } from 'vm2';

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
  vm.run(text);

  // Kill the process when you're done
  process.kill(process.pid);
});
