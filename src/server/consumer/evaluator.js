import EvaluationError from '../../common/lib/errors/EvaluationError';
import config from '../../../config';

// expression is a string
// Returns a match of the form "a<operator>b="
// Where <operator> is +, -, *, /
// matches[0] = Full string of characters matched
// matches[1] = Group 1 = ([\-]{0,1}\d*) = Match integers
// matches[2] = Group 2 = ([\+\-\*\/]) = Match operators +, -, *, /
// matches[3] = Group 3 = ([\-]{0,1}\d*) = Match integers
export default expression => {
  const matches = config.evaluator.regex.exec(expression);

  if (!matches || matches.length !== 4) {
    throw new EvaluationError(config.evaluator.messages.evaluationError, expression);
  }

  const first = parseInt(matches[1], 10);
  const operator = matches[2];
  const second = parseInt(matches[3], 10);

  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '/':
      return first / second;
    case '*':
      return first * second;
    default:
      return first + second;
  }
};
