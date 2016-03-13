import config from '../../../config';
import Log from '../../common/lib/logger';
let log = new Log(config.consumer.messages.prefix);
const connect = require('connect');
const serveStatic = require('serve-static');
import evaluator from './evaluator';
const httpmodule = require('http');
const socketio = require('socket.io');

/*
 * Purpose: Listens for Producer events on web sockets
 * Listens: connection, produce, disconnect
 * Emits: response, response-log, invalid
 */
export default class Consumer {
  constructor() {
    const app = connect();
    this.http = httpmodule.Server(app);
    const io = socketio(this.http);
    app.use(serveStatic(`${__dirname}/../../browser/consumer`));
    io.on('connection', this.onConnection.bind(this, io));
  }

  onConnection(io, socket) {
    log.info(`${config.consumer.messages.connection}${socket.id}`);
    socket.on('produce', this.onProduce.bind(this, io, socket));
    socket.on('disconnect', this.onDisconnect.bind(this, socket));
  }

  onProduce(io, socket, expression) {
    try {
      log.info(`${config.consumer.messages.received}${expression}`);
      const result = evaluator(expression);
      log.info(`${config.consumer.messages.response}${expression}${result}`);
      // Note Object Literal Property Value Shorthand (ES6)
      // {expression, result} equal to {expression: expression, result: result}
      socket.emit('response', { expression, result });
      io.emit('response-log', { expression, result, producer: socket.id });
    } catch (error) {
      log.error(`${config.consumer.messages.invalid}${expression}`);
      socket.emit('invalid', { expression, error });
      io.emit('invalid-log', { expression, error, producer: socket.id });
    }
  }

  onDisconnect(socket) {
    log.info(`${config.consumer.messages.disconnect}${socket.id}`);
  }

  listen(port, callback) {
    this.port = port;
    this.http.listen(this.port, callback);
    log.info(`${config.consumer.messages.listening}${port}`);
  }

  close() {
    this.http.close();
    log.info(`${config.consumer.messages.stopListening}${this.port}`);
  }

  setLog(newLog) {
    log = newLog;
  }
}
