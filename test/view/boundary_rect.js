var boundary_rect = require('../../view/boundary_rect');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('boundary:rect:top', 'top value');
  vs.var('boundary:rect:right', 'right value');
  vs.var('boundary:rect:bottom', 'bottom value');
  vs.var('boundary:rect:left', 'left value');
  vs.var('boundary:rect:type', 'type value');
  vs.var('centroid:field', 'field value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof boundary_rect, 'function', 'valid function');
    t.equal(boundary_rect.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(boundary_rect(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var vs = getBaseVariableStore();

    var actual = boundary_rect(vs);

    var expected = {
      geo_bounding_box: {
        type: { $: 'type value' },
        'field value': {
          top: { $: 'top value' },
          right: { $: 'right value' },
          bottom: { $: 'bottom value' },
          left: { $: 'left value' }
        }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('boundary_rect ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
