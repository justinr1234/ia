require('babel-register');
require('babel-polyfill');

const Consumer = require('./consumer');
const config = require('../../../config');

/*
 * Environment Variables (fallback to config file for defaults)
 *   PORT - Port to start consumer listening on
 */

const consumer = new Consumer();
consumer.listen(process.env.PORT || config.consumer.defaults.port);

module.exports = consumer;
