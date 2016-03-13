/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
import config from '../../../../config';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const GeneratorClass = require('../generator');
import NumericRangeError from '../../../common/lib/errors/NumericRangeError';
chai.use(sinonChai);

describe('generator', () => {
  describe('when provided valid range', () => {
    let generator;
    let randIntSpy;
    let randOpSpy;
    const valid = config.generator.test.ranges.valid;

    for (let i = 0; i < valid.length; i++) {
      const min = valid[i].min;
      const max = valid[i].max;
      describe('and generating', () => {
        beforeEach(() => {
          generator = new GeneratorClass(min, max);
          randIntSpy = sinon.spy(generator, 'randInt');
          randOpSpy = sinon.spy(generator, 'randOp');
        });

        describe('and given no operator', () => {
          let result;

          beforeEach(() => {
            result = generator.generate();
          });

          it('shoud return a valid expression', () => {
            expect(randOpSpy).to.have.been.calledOnce;
            expect(result).to.match(config.generator.test.regex);
          });

          it('shoud generate random numbers', () => {
            expect(randIntSpy).to.have.been.calledTwice;
          });
        });

        const validOperators = config.generator.operators;
        // Note: For loops faster than forEach in V8
        for (let i = 0; i < validOperators.length; i++) {
          const operator = validOperators[i];

          describe(`and given valid operator ${operator}`, () => {
            let result;

            beforeEach(() => {
              result = generator.generate(operator);
            });

            it(`shoud return a valid expression using operator ${operator}`, () => {
              expect(randOpSpy).to.not.have.been.called;
              expect(result).to.match(config.generator.test.regex);
            });

            it('shoud generate random numbers', () => {
              expect(randIntSpy).to.have.been.calledTwice;
            });
          });
        }

        const invalidOperators = config.generator.test.invalidOperators;
        // Note: For loops faster than forEach in V8
        for (let i = 0; i < invalidOperators.length; i++) {
          const operator = invalidOperators[i];

          describe(`and given invalid operator ${operator}`, () => {
            it('shoud throw error', () => {
              expect(generator.generate.bind(this, operator)).to
                .throw(Error, config.generator.messages.invalidOperator);
            });
          });
        }
      });
    }
  });

  describe('when provided invalid minimum', () => {
    it('should throw error', () => {
      const min = '';
      const max = config.producer.defaults.maximum;
      const err = config.generator.messages.numericRangeErrors.minimum;
      expect(() => new GeneratorClass(min, max)).to.throw(NumericRangeError, err);
    });
  });

  describe('when provided invalid maximum', () => {
    it('should throw error', () => {
      const min = config.producer.defaults.minimum;
      const max = '';
      const err = config.generator.messages.numericRangeErrors.maximum;
      expect(() => new GeneratorClass(min, max)).to.throw(NumericRangeError, err);
    });
  });

  describe('when provided minimum > maximum', () => {
    it('should throw error', () => {
      const min = 2;
      const max = 1;
      const err = config.generator.messages.numericRangeErrors.minGreaterThanMax;
      expect(() => new GeneratorClass(min, max)).to.throw(NumericRangeError, err);
    });
  });
});
