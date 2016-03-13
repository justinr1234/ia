/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
import config from '../../../../config';
import {
  expect
} from 'chai';
import evaluator from '../evaluator';
import EvaluationError from '../../../common/lib/errors/EvaluationError';

describe('evaluator', () => {
  describe('when started', () => {
    const regex = config.evaluator.regex;
    const valids = config.evaluator.test.expressions.valid;
    const invalids = config.evaluator.test.expressions.invalid;

    describe('and evaluating expressions', () => {
      // Note: For loops faster than forEach in V8
      for (let i = 0; i < valids.length; i++) {
        const val = valids[i];
        describe(`and given valid expression ${val.expression}`, () => {
          it(`should parse expression to be "${val.first}", "${
            val.operator}", "${val.second}"`,
            () => {
              const result = regex.exec(val.expression);
              expect(result).to.have.length(4);
              expect(parseInt(result[1], 10)).to.equal(val.first);
              expect(result[2]).to.equal(val.operator);
              expect(parseInt(result[3], 10)).to.equal(val.second);
            });
        });

        describe(`and computing valid expression ${val.expression}`, () => {
          it(`should evaluate to ${val.expression}${val.result}`, () => {
            expect(evaluator(val.expression)).to.equal(val.result);
          });
        });
      }

      // Note: For loops faster than forEach in V8
      for (let i = 0; i < invalids.length; i++) {
        const expression = invalids[i];
        describe(`and given invalid expression ${expression}`, () => {
          it('the regex should find no match', () => {
            expect(regex.exec(expression)).to.be.null;
          });
        });

        describe(`and computing invalid expression ${expression}`, () => {
          it('should throw error', () => {
            expect(evaluator.bind(this, expression))
              .to.throw(EvaluationError, config.evaluator.messages.evaluationError);
          });
        });
      }
    });
  });
});
