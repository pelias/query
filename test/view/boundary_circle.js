var boundary_circle = require('../../view/boundary_circle');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('boundary:circle:lat', 'lat value');
  vs.var('boundary:circle:lon', 'lon value');
  vs.var('boundary:circle:radius', 'radius value');
  vs.var('boundary:circle:distance_type', 'distance_type value');
  vs.var('boundary:circle:optimize_bbox', 'optimize_bbox value');
  vs.var('centroid:field', 'field value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof boundary_circle, 'function', 'valid function');
    t.equal(boundary_circle.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(boundary_circle(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = getBaseVariableStore();

    var actual = boundary_circle(vs);

    var expected = {
      geo_distance: {
        distance: { $: 'radius value' },
        distance_type: { $: 'distance_type value' },
        optimize_bbox: { $: 'optimize_bbox value' },
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
    return tape('boundary_circle ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
