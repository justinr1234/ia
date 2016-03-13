export default {
  test: {
    messages: {
      prefix: '[Test] '
    }
  },
  producer: {
    defaults: {
      minimum: 0,
      maximum: 1000,
      interval: 1000
    },
    messages: {
      connecting: 'Connecting: ',
      connect: 'Connected: ',
      disconnect: 'Disconnected: ',
      response: 'Result: ',
      invalid: 'Invalid: ',
      error: 'Error: ',
      send: 'Send: ',
      prefix: '[P] '
    },
    test: {
      numberOfIntervals: 20,
      clockTickAmount: 500,
      validResult: {
        expression: '500+10=',
        result: 510
      },
      invalidExpression: 'a+n='
    }
  },
  generator: {
    operators: ['+', '-', '*', '/'],
    test: {
      invalidOperators: ['weradsfsae', '.', 'M', '~', '6'],
      ranges: {
        valid: [
          {
            min: 0,
            max: 500
          },
          {
            min: 50,
            max: 100
          },
          {
            min: 999,
            max: 1000
          }
        ],
        invalid: [
          [-1, 1],
          [999, 5000],
          ['asdf', 'asdf']
        ]
      },
      regex: /^[\-]{0,1}\d*[\+\-\*\/][\-]{0,1}\d*\=$/
    },
    messages: {
      invalidOperator: 'Invalid operator. Supported: +, -, *, /',
      numericRangeErrors: {
        minimum: 'Minimum invalid',
        maximum: 'Maximum invalid',
        minGreaterThanMax: 'Minimum must be less than Maximum'
      }
    }
  },
  consumer: {
    defaults: {
      url: 'http://localhost',
      port: 3000
    },
    test: {
      url: 'http://localhost',
      port: 4000,
      data: {
        valid: {
          expression: '23+56=',
          result: 79
        },
        invalid: {
          expression: 'x*y='
        }
      },
      socket: {
        retries: {
          max: 5,
          interval: 100
        }
      }
    },
    messages: {
      received: 'Received: ',
      response: 'Respond: ',
      invalid: 'Invalid: ',
      disconnect: 'Producer DISCONNECTED: ',
      connection: 'Producer CONNECTED: ',
      listening: 'Listening on port ',
      stopListening: 'Stopped listening on port ',
      prefix: '[C] '
    }
  },
  evaluator: {
    regex: /^([\-]{0,1}\d*)([\+\-\*\/])([\-]{0,1}\d*)\=$/,
    messages: {
      evaluationError: 'Error parsing expression'
    },
    test: {
      expressions: {
        valid: [
          {
            expression: '500+10=',
            first: 500,
            operator: '+',
            second: 10,
            result: 510
          },
          {
            expression: '500+-10=',
            first: 500,
            operator: '+',
            second: -10,
            result: 490
          },
          {
            expression: '-500+10=',
            first: -500,
            operator: '+',
            second: 10,
            result: -490
          },
          {
            expression: '-500+-10=',
            first: -500,
            operator: '+',
            second: -10,
            result: -510
          },
          {
            expression: '500-10=',
            first: 500,
            operator: '-',
            second: 10,
            result: 490
          },
          {
            expression: '500--10=',
            first: 500,
            operator: '-',
            second: -10,
            result: 510
          },
          {
            expression: '-500-10=',
            first: -500,
            operator: '-',
            second: 10,
            result: -510
          },
          {
            expression: '-500--10=',
            first: -500,
            operator: '-',
            second: -10,
            result: -490
          },
          {
            expression: '500*10=',
            first: 500,
            operator: '*',
            second: 10,
            result: 5000
          },
          {
            expression: '-500*10=',
            first: -500,
            operator: '*',
            second: 10,
            result: -5000
          },
          {
            expression: '500*-10=',
            first: 500,
            operator: '*',
            second: -10,
            result: -5000
          },
          {
            expression: '-500*-10=',
            first: -500,
            operator: '*',
            second: -10,
            result: 5000
          },
          {
            expression: '500/10=',
            first: 500,
            operator: '/',
            second: 10,
            result: 50
          },
          {
            expression: '500/-10=',
            first: 500,
            operator: '/',
            second: -10,
            result: -50
          },
          {
            expression: '-500/10=',
            first: -500,
            operator: '/',
            second: 10,
            result: -50
          },
          {
            expression: '-500/-10=',
            first: -500,
            operator: '/',
            second: -10,
            result: 50
          },
          {
            expression: '0/500=',
            first: 0,
            operator: '/',
            second: 500,
            result: 0
          },
          {
            expression: '500/0=',
            first: 500,
            operator: '/',
            second: 0,
            result: Infinity
          }
        ],
        invalid: [
          '500+234',
          'asdfasdf',
          '3454353453453434534',
          '*234*-013812/ddsfsdad!!',
          'sdf234234dsf',
          123123123123
        ]
      }
    }
  }
};
