var multi_match = require('../../view/multi_match');
var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof multi_match, 'function', 'valid function');
    t.equal(multi_match.length, 4, 'takes 4 args');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  test('missing query_var in VariableStore should return null', function(t) {
    var vs = new VariableStore();

    var actual = multi_match(vs, [], 'analyzer value', 'query var');

    t.equal(actual, null, 'should have returned null for unset query_var');
    t.end();

  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = new VariableStore();
    vs.var('query var', 'query value');

    var fields_with_boosts = [
      { field: 'field 1', boost: 'boost value 1'},
      { field: 'field 2'},
      { field: 'field 3', boost: 'boost value 3'}
    ];

    var actual = multi_match(vs, fields_with_boosts, 'analyzer value', 'query var');

    var expected = {
      multi_match: {
        fields: [
          'field 1^boost value 1',
          'field 2^1',
          'field 3^boost value 3'
        ],
        query: { $: 'query value' },
        analyzer: 'analyzer value'
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('multi_match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
