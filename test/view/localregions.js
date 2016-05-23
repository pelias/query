var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('focus:point:lat', 'lat value');
  vs.var('focus:point:lon', 'lon value');
  vs.var('centroid:field', 'field value');
  vs.var('localregions:weight', 'weight value');
  vs.var('localregions:function', 'function value');
  vs.var('localregions:offset', 'offset value');
  vs.var('localregions:scale', 'scale value');
  vs.var('localregions:decay', 'decay value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    var localregions = require('../../view/localregions')(function() {});

    t.equal(typeof localregions, 'function', 'valid function');
    t.equal(localregions.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable should return null', function(t) {
      var localregions = require('../../view/localregions')(function() {});

      var vs = getBaseVariableStore(missing_variable);

      t.equal(localregions(vs), null, 'should have returned null');
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var localregions = require('../../view/localregions')();

    var vs = getBaseVariableStore();

    var actual = localregions(vs);

    var expected = {
      function_score: {
        functions: [
          {
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
          }
        ],
        score_mode: 'first',
        boost_mode: 'replace'
      }

    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

  test('types should be added as a filter', function(t) {
    var localregions = require('../../view/localregions')(['type1', 'type2', 'type3']);

    var vs = getBaseVariableStore();

    var actual = localregions(vs);

    var expected = {
      function_score: {
        filter: {
          'or': [
            { 'type': { 'value': 'type1' }},
            { 'type': { 'value': 'type2' }},
            { 'type': { 'value': 'type3' }},
          ]
        },
        functions: [
          {
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
          }
        ],
        score_mode: 'first',
        boost_mode: 'replace'
      }

    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('localregions ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
