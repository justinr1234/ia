import config from '../../../config';
import Log from '../../common/lib/logger';
let log = new Log(config.producer.messages.prefix);
const io = require('socket.io-client');
const GeneratorClass = require('./generator');

 /*
  * Purpose: Produces arhitemetic expressions and listens for results using web sockets.
  * Listens: connect, disconnect, response, invalid
  * Emits: produce
  */
export default class ProducerClass {
  constructor(min, max) {
    this.generator = new GeneratorClass(min, max);
    this.callbacks = [];
  }

  connect(addr, port) {
    this.url = `${addr}:${port}`;
    log.info(`${config.producer.messages.connecting}${this.url}`);
    this.socket = io.connect(this.url, { forceNew: true });
    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('response', this.onResponse.bind(this));
    this.socket.on('invalid', this.onInvalid.bind(this));
  }

  onConnect() {
    log.info(`${config.producer.messages.connect}${this.url}`);
  }

  onDisconnect() {
    log.info(`${config.producer.messages.disconnect}${this.url}`);
    this.stopProduction();
  }

  onResponse(msg) {
    log.info(`${config.producer.messages.response}${msg.expression}${msg.result}`);
  }

  onInvalid(msg) {
    log.error(`${config.producer.messages.invalid}${msg.expression}`);
    if (msg.error) { log.error(`${config.producer.messages.error}${msg.error}`); }
  }

  stopProduction() {
    if (this.timeoutTimer) { clearTimeout(this.timeoutTimer); }
  }

  startProduction(interval) {
    const expression = this.generator.generate();
    log.info(`${config.producer.messages.send}${expression}`);
    this.socket.emit('produce', expression);
    this.timeoutTimer = setTimeout(() => { this.startProduction(interval); }, interval);
  }

	// Use to stop the server from listening (shutdown)
  close() {
    this.socket.disconnect();
  }

  setLog(newLog) {
    log = newLog;
  }
}
