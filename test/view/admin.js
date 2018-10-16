var admin = require('../../view/admin')('asdf');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('input:asdf', 'input value');
  vs.var('admin:asdf:analyzer', 'analyzer value');
  vs.var('admin:asdf:field', 'field value');
  vs.var('admin:asdf:boost', 'boost value');
  vs.var('admin:cutoff_frequency', 'cutoff_frequency value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof admin, 'function', 'valid function');
    t.equal(admin.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.no_property = function(test, common) {
  ['', 0, false].forEach(function(falseyValue) {
    test('falsey property values should return null even if all other fields are present', function(t) {
      var admin = require('../../view/admin')(falseyValue);

      var vs = getBaseVariableStore();

      var actual = admin(vs);

      t.equal(actual, null, 'should have returned null');
      t.end();

    });

  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(admin(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all required values should return formed object', function(t) {
    var vs = getBaseVariableStore();

    var actual = admin(vs);

    var expected = {
      match: {
        'field value': {
          analyzer: {
            $: 'analyzer value'
          },
          boost: {
            $: 'boost value'
          },
          cutoff_frequency: {
            $: 'cutoff_frequency value'
          },
          query: {
            $: 'input value'
          }
        }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('admin ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
