var ngrams = require('../../view/ngrams');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('input:name', 'name value');
  vs.var('ngram:analyzer', 'analyzer value');
  vs.var('ngram:field', 'field value');
  vs.var('ngram:boost', 'boost value');
  vs.var('ngram:cutoff_frequency', 'cutoff_frequency value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof ngrams, 'function', 'valid function');
    t.equal(ngrams.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(ngrams(vs), null, 'should have returned null');
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var actual = ngrams(getBaseVariableStore());

    var expected = {
      match: {
        'field value': {
          analyzer: { $: 'analyzer value' },
          boost: { $: 'boost value' },
          cutoff_frequency: { $: 'cutoff_frequency value' },
          query: { $: 'name value' }
        }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.tests.fuzziness_variable = function(test, common) {
  test('fuzziness variable should be presented in query', function(t) {
    var store = getBaseVariableStore();
    store.var('ngram:fuzziness', 'fuzziness value');

    var actual = ngrams(store);

    var expected = {
      match: {
        'field value': {
          analyzer: { $: 'analyzer value' },
          boost: { $: 'boost value' },
          query: { $: 'name value' },
          cutoff_frequency: { $: 'cutoff_frequency value' },
          fuzziness: { $: 'fuzziness value' }
        }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object with fuzziness field');
    t.end();

  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('ngrams ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
