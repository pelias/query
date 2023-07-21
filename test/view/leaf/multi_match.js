const VariableStore = require('../../../lib/VariableStore');
const multi_match = require('../../../view/leaf/multi_match');

module.exports.tests = {};

module.exports.tests.base_usage = function(test, common) {
  test('input and fields specified', function(t) {

    const vs = new VariableStore();
    vs.var('multi_match:example:input', 'input value');
    vs.var('multi_match:example:fields', ['fields', 'values']);

    const view = multi_match('example')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      multi_match: {
        type: 'best_fields',
        fields: ['fields', 'values'],
        query: 'input value'
      }
    };

    t.deepEqual(actual, expected, 'multi_match view rendered as expected');
    t.end();
  });

  test('optional fields specified', function(t) {
    const vs = new VariableStore();
    vs.var('multi_match:example2:input', 'input value');
    vs.var('multi_match:example2:fields', ['fields', 'values']);
    vs.var('multi_match:example2:analyzer', 'customAnalyzer');

    const view = multi_match('example2')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      multi_match: {
        type: 'best_fields',
        fields: ['fields', 'values'],
        query: 'input value',
        analyzer: 'customAnalyzer',
      }
    };

    t.deepEqual(actual, expected, 'multi_match view rendered as expected');
    t.end();
  });

  test('specific multi_match type', function(t) {
    const vs = new VariableStore();
    vs.var('multi_match:example2:input', 'input value');
    vs.var('multi_match:example2:type', 'phrase');
    vs.var('multi_match:example2:fields', ['fields', 'values']);
    vs.var('multi_match:example2:analyzer', 'customAnalyzer');
    vs.var('multi_match:example2:slop', 3);

    const view = multi_match('example2')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields', 'values'],
        query: 'input value',
        analyzer: 'customAnalyzer',
        slop: 3
      }
    };

    t.deepEqual(actual, expected, 'multi_match view rendered as expected');
    t.end();
  });
};

module.exports.tests.incorrect_usage = function(test, common) {
  test('no variables specified', function(t) {
    const vs = new VariableStore();

    const view = multi_match('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });

  test('no input specified', function(t) {
    const vs = new VariableStore();
    vs.var('multi_match:broken_example:fields', 'fields value');

    const view = multi_match('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('leaf/multi_match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
