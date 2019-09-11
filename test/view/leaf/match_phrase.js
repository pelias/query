const VariableStore = require('../../../lib/VariableStore');
const match_phrase = require('../../../view/leaf/match_phrase');

module.exports.tests = {};

module.exports.tests.base_usage = function(test, common) {
  test('input and field specified', function(t) {

    const vs = new VariableStore();
    vs.var('match_phrase:example:input', 'input value');
    vs.var('match_phrase:example:field', 'field value');

    const view = match_phrase('example')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      match_phrase: {
        ['field value']: {
          query: 'input value'
        }
      }
    };

    t.deepEqual(actual, expected, 'match_phrase view rendered as expected');
    t.end();
  });

  test('optional fields specified', function(t) {
    const vs = new VariableStore();
    vs.var('match_phrase:example2:input', 'input value');
    vs.var('match_phrase:example2:field', 'field value');
    vs.var('match_phrase:example2:slop', 3);
    vs.var('match_phrase:example2:analyzer', 'customAnalyzer');

    const view = match_phrase('example2')(vs);

    const actual = JSON.parse(JSON.stringify(view));

    const expected = {
      match_phrase: {
        ['field value']: {
          query: 'input value',
          slop: 3,
          analyzer: 'customAnalyzer'
        }
      }
    };

    t.deepEqual(actual, expected, 'match_phrase view rendered as expected');
    t.end();
  });
};

module.exports.tests.incorrect_usage = function(test, common) {
  test('no variables specified', function(t) {
    const vs = new VariableStore();

    const view = match_phrase('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });

  test('no input specified', function(t) {
    const vs = new VariableStore();
    vs.var('match_phrase:broken_example:field', 'field value');

    const view = match_phrase('broken_example')(vs);

    t.equal(view, null, 'should return null');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('leaf/match_phrase ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
