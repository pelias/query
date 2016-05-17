var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    var admin_multi_match = require('../../view/admin_multi_match');

    t.equal(typeof admin_multi_match, 'function', 'valid function');
    t.equal(admin_multi_match.length, 2, 'takes 2 args');
    t.end();
  });

};

module.exports.tests.invalid_admin_values = function(test, common) {
  test('empty admin_properties should return null', function(t) {
    var admin_multi_match = require('../../view/admin_multi_match')([]);

    var vs = new VariableStore();

    var actual = admin_multi_match(vs);

    t.equal(actual, null, 'should have returned null for unset query_var');
    t.end();

  });

  test('null in admin_properties should return null', function(t) {
    var vs = new VariableStore();
    vs.var('input:property1', 'property1 value');
    vs.var('admin:property1:field', 'property1_field value');
    vs.var('admin:property1:boost', 'property1_boost value');

    var admin_multi_match = require('../../view/admin_multi_match')([null]);

    var actual = admin_multi_match(vs);

    t.equal(actual, null);
    t.end();

  });

  test('admin_properties without input:<property> value not in vs should return null', function(t) {
    var vs = new VariableStore();
    vs.var('admin:property1:field', 'field value 1');
    vs.unset('input:property1');

    var admin_multi_match = require('../../view/admin_multi_match')(['property1']);

    var actual = admin_multi_match(vs);

    t.equal(actual, null);
    t.end();

  });

  test('admin_properties without admin:<property>:field value not in vs should return null', function(t) {
    var vs = new VariableStore();
    vs.var('input:property1', 'value 1');
    vs.unset('admin:property1:field');

    var admin_multi_match = require('../../view/admin_multi_match')(['property1']);

    var actual = admin_multi_match(vs);

    t.equal(actual, null);
    t.end();

  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = new VariableStore();
    vs.var('input:property1', 'property1 value');
    vs.var('admin:property1:field', 'property1_field value');
    vs.var('admin:property1:boost', 'property1_boost value');
    vs.var('input:property2', 'property2 value');
    vs.var('admin:property2:field', 'property2_field value');
    vs.var('admin:property2:boost', 'property2_boost value');

    var admin_multi_match = require('../../view/admin_multi_match')(['property1', 'property2'], 'analyzer value');

    var actual = admin_multi_match(vs);

    var expected = {
      'multi_match': {
        'fields': [
          'property1_field value^property1_boost value',
          'property2_field value^property2_boost value'
        ],
        'query': { $: 'property1 value' },
        'analyzer': 'analyzer value'
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

  test('boosts should default to 1 when not specified', function(t) {
    var vs = new VariableStore();
    vs.var('input:property1', 'property1 value');
    vs.var('admin:property1:field', 'property1_field value');
    // there is no boost

    var admin_multi_match = require('../../view/admin_multi_match')(['property1'], 'analyzer value');

    var actual = admin_multi_match(vs);

    var expected = {
      'multi_match': {
        'fields': [
          'property1_field value^1'
        ],
        'query': { $: 'property1 value' },
        'analyzer': 'analyzer value'
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('admin_multi_match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
