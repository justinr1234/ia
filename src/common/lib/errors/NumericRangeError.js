import { BaseError } from 'make-error';

export default class NumericRangeError extends BaseError {
  constructor(message, number1, number2) {
    super();
    this.message = message;
    this.number1 = number1;
    this.number2 = number2;
  }
}
