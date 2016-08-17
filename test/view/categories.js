var categories = require('../../view/categories');
var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof categories, 'function', 'valid function');
    t.equal(categories.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  test('categories not set in VariableStore should return null', function(t) {
    var vs = new VariableStore();

    t.equal(categories(vs), null, 'should have returned null');
    t.end();

  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = new VariableStore();
    vs.var('categories:field', 'category');
    vs.var('input:categories', 'categories value');

    var actual = categories(vs);

    var expected = {
      terms: {
        category: ['categories value']
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

  test('array of categories, all fields available should populate all fields', function(t) {
    var vs = new VariableStore();
    vs.var('categories:field', 'category');
    vs.var('input:categories', ['foo', 'bar', 'baz']);

    var actual = categories(vs);

    var expected = {
      terms: {
        category: ['foo', 'bar', 'baz']
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('categories ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
