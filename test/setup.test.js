import chai from 'chai';
import chaiHttp from 'chai-http';

import { TEST_DATABASE_URL } from '../config';
import { dbConnect, dbDisconnect } from '../db-mongoose';

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

before(() => {
  return dbConnect(TEST_DATABASE_URL);
});

after(() => {
  return dbDisconnect();
});

describe('Mocha and Chai', () => {
  it('should be properly setup', () => {
    expect(true).to.be.true;
  });
});
