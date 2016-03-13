const log4js = require('log4js');
const logger = log4js.getLogger();

/*
 * Purpose: Appends a prefix to log messages
 */
export default class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }

  makeMessage(msg) {
    return `${this.prefix}${msg}`;
  }

  error(msg) {
    logger.error(this.makeMessage(msg));
  }

  info(msg) {
    logger.info(this.makeMessage(msg));
  }

  debug(msg) {
    logger.debug(this.makeMessage(msg));
  }

  setPrefix(prefix) {
    this.prefix = prefix;
  }
}
