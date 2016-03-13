/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
import config from '../../../../config';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Log from '../../../common/lib/logger';
const log = new Log(config.consumer.messages.prefix);
import io from 'socket.io-client';
import ConsumerClass from '../consumer';
chai.use(sinonChai);

describe('consumer', () => {
  let consumer;
  let sandbox;
  const url = config.consumer.test.url;
  const port = config.consumer.test.port;
  const urlpath = `${url}:${port}`;
  const messages = config.consumer.messages;
  const testdata = config.consumer.test.data;
  const interval = config.consumer.test.socket.retries.interval;
  const maxRetries = config.consumer.test.socket.retries.max;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log, 'error');
    sandbox.stub(log, 'info');
  });

  afterEach(() => {
    consumer.close();
    sandbox.restore();
  });

  describe('when started', () => {
    beforeEach(done => {
      consumer = new ConsumerClass();
      consumer.setLog(log);
      consumer.listen(port, () => { done(); });
    });

    it('should log listening', () => {
      expect(log.info).to.have.been.calledOnce;
      expect(log.info).to.have.been.calledWith(`${messages.listening}${port}`);
    });

    describe('and a producer is connected', () => {
      let socket;
      let socket2;

      beforeEach(done => {
        let socketConnected = false;
        socket = io(urlpath, { forceNew: true });
        socket.on('connect', () => { socketConnected ? done() : socketConnected = true; });

        socket2 = io(urlpath, { forceNew: true });
        socket2.on('connect', () => { socketConnected ? done() : socketConnected = true; });
      });

      afterEach(done => {
        socket.on('disconnect', () => { done(); });
        socket.disconnect();
      });

      it('should respond back to valid expression from individual producer', done => {
        const invalidStub = sandbox.stub();
        let tries = 0;
        // Can't guarantee order of socket messages, so must retry sometimes
        const responseHandler = msg => {
          try {
            expect(msg.expression).to.equal(testdata.valid.expression);
            expect(msg.result).to.equal(testdata.valid.result);
            expect(invalidStub).to.not.have.been.called;
            const logMsg = `${messages.response}${msg.expression}${msg.result}`;
            expect(log.info).to.have.been.calledWith(logMsg);
            done();
          } catch (e) {
            if (++tries < maxRetries) {
              setTimeout(() => responseHandler(msg), interval);
            }
          }
        };
        socket.on('invalid', invalidStub);
        socket.on('response', responseHandler);
        socket.emit('produce', testdata.valid.expression);
      });

      it('should respond via response log to valid expression from multiple producers', done => {
        const invalidStub = sandbox.stub();
        const invalid2Stub = sandbox.stub();
        const resultStub = sandbox.stub();
        const result2Stub = sandbox.stub();
        let tries = 0;
        // Can't guarantee order of socket messages, so must retry sometimes
        const responseLogHandler = msg => {
          try {
            const logMsg = `${messages.response}${msg.expression}${msg.result}`;
            expect(log.info).to.have.been.calledWith(logMsg);
            expect(invalidStub).to.not.have.been.called;
            expect(resultStub).to.have.been.calledOnce;
            expect(invalid2Stub).to.not.been.called;
            expect(result2Stub).to.not.have.been.called;
            expect(msg.expression).to.equal(testdata.valid.expression);
            expect(msg.result).to.equal(testdata.valid.result);
            done();
          } catch (e) {
            if (++tries < maxRetries) {
              setTimeout(() => responseLogHandler(msg), interval);
            }
          }
        };

        socket.on('invalid', invalidStub);
        socket.on('response', resultStub);

        socket2.on('invalid', invalid2Stub);
        socket2.on('response', result2Stub);
        socket2.on('response-log', responseLogHandler);

        socket.emit('produce', testdata.valid.expression);
      });

      it('should respond back to invalid expression from individual producer', done => {
        const resultStub = sandbox.stub();
        let tries = 0;
        // Can't guarantee order of socket messages, so must retry sometimes
        let invalidHandler = msg => {
          try {
            expect(resultStub).to.not.have.been.called;
            expect(msg.expression).to.equal(testdata.invalid.expression);
            expect(msg.result).to.be.undefined;
            const logMsg = `${messages.invalid}${msg.expression}`;
            expect(log.error).to.have.been.calledWith(logMsg);
            done();
          } catch (e) {
            if (++tries < maxRetries) {
              setTimeout(() => invalidHandler(msg), interval);
            }
          }
        };
        socket.on('reponse', resultStub);
        socket.on('invalid', invalidHandler);
        socket.emit('produce', testdata.invalid.expression);
      });

      it('should respond via invalid log to invalid expression from multiple producers', done => {
        const resultStub = sandbox.stub();
        const result2Stub = sandbox.stub();
        const invalidStub = sandbox.stub();
        const invalid2Stub = sandbox.stub();
        let tries = 0;
        // Can't guarantee order of socket messages, so must retry sometimes
        let invalidLogHandler = msg => {
          try {
            expect(invalidStub).to.have.been.calledOnce;
            expect(resultStub).to.not.have.been.called;
            expect(invalid2Stub).to.not.have.been.called;
            expect(result2Stub).to.not.have.been.called;
            expect(msg.expression).to.equal(testdata.invalid.expression);
            expect(msg.result).to.be.undefined;
            const logMsg = `${messages.invalid}${msg.expression}`;
            expect(log.error).to.have.been.calledWith(logMsg);
            done();
          } catch (e) {
            if (++tries < maxRetries) {
              setTimeout(() => invalidLogHandler(msg), interval);
            }
          }
        };

        socket.on('invalid', invalidStub);
        socket.on('response', resultStub);

        socket2.on('invalid', invalid2Stub);
        socket2.on('response', result2Stub);
        socket2.on('invalid-log', invalidLogHandler);

        socket.emit('produce', testdata.invalid.expression);
      });
    });
  });
});
