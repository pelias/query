var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    var sort_numeric_script = require('../../view/sort_numeric_script')(function() {});

    t.equal(typeof sort_numeric_script, 'function', 'valid function');
    t.equal(sort_numeric_script.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  test('null subview should return null', function(t) {
    var sort_numeric_script = require('../../view/sort_numeric_script')(null);

    var vs = new VariableStore();

    t.equal(sort_numeric_script(vs), null, 'should have returned null');
    t.end();

  });

};


module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var sort_numeric_script = require('../../view/sort_numeric_script')('script name value');

    var vs = new VariableStore();

    var actual = sort_numeric_script(vs);

    var expected = {
      _script: {
        file: 'script name value',
        type: 'number',
        order: 'desc'
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('sort_numeric_script ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
