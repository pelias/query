var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('population:field', 'field value');
  vs.var('population:modifier', 'modifier value');
  vs.var('population:max_boost', 'max_boost value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    var population = require('../../view/population')(function() {});

    t.equal(typeof population, 'function', 'valid function');
    t.equal(population.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  test('null subview should return null', function(t) {
    var population = require('../../view/population')(null);

    var vs = getBaseVariableStore();

    t.equal(population(vs), null, 'should have returned null');
    t.end();

  });

  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable should return null', function(t) {
      var population = require('../../view/population')(function() {});

      var vs = getBaseVariableStore(missing_variable);

      t.equal(population(vs), null, 'should have returned null');
      t.end();

    });
  });

};


module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all fields available should populate all fields', function(t) {
    var subview = function(vs) {
      return {
        'subview field': 'subview value'
      };
    };

    var population = require('../../view/population')(subview);

    var vs = getBaseVariableStore();
    vs.var('population:weight', 17);

    var actual = population(vs);

    var expected = {
      function_score: {
        query: {
          'subview field': 'subview value'
        },
        max_boost: { $: 'max_boost value' },
        functions: [
          {
            field_value_factor: {
              'modifier': { $: 'modifier value' },
              'field': { $: 'field value' },
              'missing': 1
            },
            weight: { $: 17 }
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
    return tape('population ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
