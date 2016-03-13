/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
const server = require('../');
chai.use(sinonChai);

describe('consumer http server', () => {
  describe('when started', () => {
    it('should be able to shutdown', () => {
      expect(server.close).to.not.throw;
    });

    after(() => {
      server.close();
    });
  });
});
