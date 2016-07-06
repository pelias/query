var layers = require('../../view/layers');
var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof layers, 'function', 'valid function');
    t.equal(layers.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  test('layers not set in VariableStore should return null', function(t) {
    var vs = new VariableStore();

    t.equal(layers(vs), null, 'should have returned null');
    t.end();

  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = new VariableStore();
    vs.var('layers', 'layers value');

    var actual = layers(vs);

    var expected = {
      terms: {
        layer: { $: 'layers value' }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('layers ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
