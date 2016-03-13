import { BaseError } from 'make-error';

export default class EvaluationError extends BaseError {
  constructor(message, expression) {
    super();
    this.message = message;
    this.expression = expression;
  }
}
