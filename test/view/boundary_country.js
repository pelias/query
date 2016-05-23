var boundary_country = require('../../view/boundary_country');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('boundary:country', 'boundary_country');
  vs.var('admin:country_a:analyzer', 'country_a_analyzer');
  vs.var('admin:country_a:field', 'country_a_field');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof boundary_country, 'function', 'valid function');
    t.equal(boundary_country.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(boundary_country(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('no boundary:country should return null', function(t) {
    var vs = getBaseVariableStore();

    var actual = boundary_country(vs);

    var expected = {
      match: {
        country_a_field: {
          analyzer: {
            $: 'country_a_analyzer'
          },
          query: {
            $: 'boundary_country'
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
    return tape('boundary_country ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
