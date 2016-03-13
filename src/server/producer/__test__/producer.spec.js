/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
import config from '../../../../config';
import connect from 'connect';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const ProducerClass = require('../producer');
import Log from '../../../common/lib/logger';
const log = new Log(config.producer.messages.prefix);
const httpmodule = require('http');
const socketio = require('socket.io');
chai.use(sinonChai);

describe('producer', () => {
  let sandbox;
  let http;
  let connectionSpy;
  let clock;
  let socket;
  let io;
  const url = config.consumer.test.url;
  const port = config.consumer.test.port;
  const urlpath = `${url}:${port}`;
  const messages = config.producer.messages;
  const interval = config.producer.defaults.interval;
  const tickAmount = config.producer.test.clockTickAmount;
  const numberOfIntervals = config.producer.test.numberOfIntervals;
  const totalProductionTime = numberOfIntervals * interval;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log, 'info');
    sandbox.stub(log, 'error');
    let app = connect();
    http = httpmodule.Server(app);
    io = socketio(http);
    io.on('connection', sock => {
      socket = sock;
      connectionSpy();
      socket.on('produce', expression => { socket.emit('ack', expression); });
    });
    http.listen(port);
    connectionSpy = sinon.spy();
  });

  afterEach(() => {
    http.close();
    sandbox.restore();
  });

  describe('when started', () => {
    let producer;

    beforeEach(done => {
      producer = new ProducerClass(0, 10);
      producer.setLog(log);
      producer.connect(url, port);
      producer.socket.on('connect', () => { done(); });
    });

    afterEach(() => {
      producer.close();
    });

    it('should log connection message', () => {
      expect(connectionSpy).to.have.been.calledOnce;
      expect(log.info).to.have.been.calledTwice;
      expect(log.info).to.have.been.calledWith(`${messages.connecting}${urlpath}`);
      expect(log.info).to.have.been.calledWith(`${messages.connect}${urlpath}`);
    });

    describe('and production is started', () => {
      it(`should produce an expression every ${interval}ms for ${totalProductionTime}ms`, () => {
        sandbox.spy(producer, 'startProduction');
        clock = sandbox.useFakeTimers();
        producer.startProduction(interval);
        for (let i = 1; i <= numberOfIntervals; i++) {
          clock.tick(tickAmount);
          const elapsed = tickAmount * i;
          const calls = Math.floor(elapsed / interval) + 1;
          expect(producer.startProduction).to.have.been.callCount(calls);
        }
        clock.restore();
      });

      it('should produce at least one expression', done => {
        producer.socket.on('ack', expression => {
          expect(expression).to.match(config.evaluator.regex);
          producer.stopProduction();
          done();
        });
        producer.startProduction(interval);
      });
    });

    describe('and an invalid response is received', () => {
      it('should log a message', done => {
        const invalidExpression = config.producer.test.invalidExpression;
        producer.socket.on('invalid', msg => {
          expect(msg).to.deep.equal(invalidExpression);
          expect(log.error).to.have.been.calledWith(`${messages.invalid}${msg.expression}`);
          if (msg.error) {
            expect(log.error).to.have.been.calledWith(`${messages.error}${msg.expression}`);
          }
          done();
        });
        socket.emit('invalid', invalidExpression);
      });
    });

    describe('and a response is received', () => {
      it('should log the result', done => {
        const validResult = config.producer.test.validResult;
        producer.socket.on('response', msg => {
          expect(log.info).to.have.been.calledWith(
            `${messages.response}${msg.expression}${msg.result}`
          );
          expect(msg).to.deep.equal(validResult);
          done();
        });
        socket.emit('response', validResult);
      });
    });
  });
});
