const VariableStore = require('../../../lib/VariableStore');
const match = require('../../../view/leaf/match');

module.exports.tests = {};

module.exports.tests.base_usage = function(test, common) {
  test('input and field specified', function(t) {
    const vs = new VariableStore();

    vs.var('match:example:input', 'input value');
    vs.var('match:example:field', 'field value');

    const view = match('example')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      match: {
        ['field value']: {
          query: 'input value'
        }
      }
    };

    t.deepEqual(actual, expected, 'match view rendered as expected');
    t.end();
  });

  test('optional parameters specified', function(t) {
    const vs = new VariableStore();

    vs.var('match:example2:input', 'input value');
    vs.var('match:example2:field', 'field value');
    vs.var('match:example2:fuzziness', 2);
    vs.var('match:example2:analyzer', 'customAnalyzer');

    const view = match('example2')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      match: {
        ['field value']: {
          query: 'input value',
          fuzziness: 2,
          analyzer: 'customAnalyzer'
        }
      }
    };

    t.deepEqual(actual, expected, 'match view rendered with optional parameters');
    t.end();
  });
};

module.exports.tests.incorrect_usage = function(test, common) {
  test('no variables specified', function(t) {
    const vs = new VariableStore();

    const view = match('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });

  test('no input specified', function(t) {
    const vs = new VariableStore();
    vs.var('match:broken_example:field', 'field value');

    const view = match('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('view/leaf/match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
