const _ = require('lodash');
import NumericRangeError from '../../common/lib/errors/NumericRangeError';
import config from '../../../config';

const operators = config.generator.operators;
const messages = config.generator.messages;

/*
 * Purpose: Generate a random arithmetic expression of the form "a<expression>b="
 *  where <expression> is one of +, -, *, /
 */
export default class GeneratorService {
  /*
   * @param min {integer} Lowest integer to generate (inclusive)
   * @param max {integer} Largest integer to genereate (inclusive)
   */
  constructor(min, max) {
    this.min = min;
    this.max = max;
    if (!this.validNumber(min)) {
      throw new NumericRangeError(messages.numericRangeErrors.minimum, min, max);
    }
    if (!this.validNumber(max)) {
      throw new NumericRangeError(messages.numericRangeErrors.maximum, min, max);
    }
    if (min >= max) {
      throw new NumericRangeError(messages.numericRangeErrors.minGreaterThanMax, min, max);
    }
  }

  /*
   * Purpose: Uses lodash to validate the type of the object is "Number"
   */
  validNumber(num) {
    return !_.isNaN(num) && _.isNumber(num);
  }

  randInt() {
    return Math.floor(Math.random() * (this.max - this.min) + this.min);
  }

  randOp() {
    return operators[Math.floor(Math.random() * operators.length)];
  }

	/*
	 * @param operator {string} Operator to use or random if none provided
   * @returns {string}
	 */
  generate(op) {
    if (!op) { op = this.randOp(); } else { op = op.toString(); }
    if (operators.indexOf(op) === -1) { throw new Error(messages.invalidOperator); }

    const firstNumber = this.randInt().toString();
    const secondNumber = this.randInt().toString();
    return `${firstNumber}${op}${secondNumber}=`;
  }
}
