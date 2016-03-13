require('babel-register');
require('babel-polyfill');

const Producer = require('./producer');
const config = require('../../../config');

 /*
  * Environment Variables (fallback to config file for defaults)
  *   PRODUCER_MIN - Minimum value for integer numbers in artimetic expressions
  *   PRODUCER_MAX - Maximum value for integer number sin aritmetic expressions
  *   PRODUCER_INTERVAL - Interval the producer generates expressions
  *   CONSUMER_URL - URL to connect to not including port
  *   CONSUMER_PORT - Port for Producer to connect to
  */

const pmin = process.env.PRODUCER_MIN !== undefined
  ? parseInt(process.env.PRODUCER_MIN, 10)
  : config.producer.defaults.minimum;
const pmax = process.env.P_MAX !== undefined
  ? parseInt(process.env.P_MAX, 10)
  : config.producer.defaults.maximum;

const producer = new Producer(pmin, pmax);
producer.connect(process.env.CONSUMER_URL || config.consumer.defaults.url,
  process.env.CONSUMER_PORT || config.consumer.defaults.port);

producer.socket.on('connect', () => {
  const interval = process.env.PRODUCER_INTERVAL !== undefined
    ? process.env.PRODUCER_INTERVAL : config.producer.defaults.interval;
  producer.startProduction(interval);
});

module.exports = producer;
