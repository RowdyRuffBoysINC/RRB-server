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

  vm.run(text);
});
