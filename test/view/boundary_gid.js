var boundary_gid = require('../../view/boundary_gid');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('boundary:gid', 'boundary_gid');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: constructor', function(t) {
    t.equal(typeof boundary_gid, 'function', 'valid function');
    t.equal(boundary_gid.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(boundary_gid(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('boundary:gid should return when set', function(t) {
    var vs = getBaseVariableStore();

    var actual = boundary_gid(vs);

    var expected = {
      multi_match: {
        fields: ['parent.*_id'],
        query: { $: 'boundary_gid' }
      }
    };

    t.deepEquals(actual, expected, 'should have returned object');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('boundary_gid ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
