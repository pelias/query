var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('focus:point:lat', 'lat value');
  vs.var('focus:point:lon', 'lon value');
  vs.var('centroid:field', 'field value');
  vs.var('focus:weight', 'weight value');
  vs.var('focus:function', 'function value');
  vs.var('focus:offset', 'offset value');
  vs.var('focus:scale', 'scale value');
  vs.var('focus:decay', 'decay value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    var focus = require('../../view/focus_only_function')();

    t.equal(typeof focus, 'function', 'valid function');
    t.equal(focus.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable should return null', function(t) {
      var focus = require('../../view/focus_only_function')(function() {});

      var vs = getBaseVariableStore(missing_variable);

      t.equal(focus(vs), null, 'should have returned null');
      t.end();

    });
  });

};


module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var focus = require('../../view/focus_only_function')();

    var vs = getBaseVariableStore();

    var actual = focus(vs);

    var expected = {
            weight: { $: 'weight value' },
            'function value': {
              'field value': {
                'origin': {
                  'lat': { $: 'lat value' },
                  'lon': { $: 'lon value' }
                },
                'offset': { $: 'offset value' },
                'scale': { $: 'scale value' },
                'decay': { $: 'decay value' }
              }
            }
          };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('focus_only_function ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
