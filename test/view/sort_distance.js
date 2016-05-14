var sort_distance = require('../../view/sort_distance');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('focus:point:lat', 'lat value');
  vs.var('focus:point:lon', 'lon value');
  vs.var('sort:distance:order', 'order value');
  vs.var('sort:distance:distance_type', 'distance_type value');
  vs.var('centroid:field', 'field value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof sort_distance, 'function', 'valid function');
    t.equal(sort_distance.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(sort_distance(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all properties set should return valid object', function(t) {
    var vs = getBaseVariableStore();

    var actual = sort_distance(vs);

    var expected = {
      _geo_distance: {
        order: { $: 'order value' },
        distance_type: { $: 'distance_type value' },
        'field value': {
          lat: { $: 'lat value' },
          lon: { $: 'lon value' }
        }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('sort_distance ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
