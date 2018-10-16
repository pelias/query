var address = require('../../view/address')('asdf');
var VariableStore = require('../../lib/VariableStore');

function getBaseVariableStore(toExclude) {
  var vs = new VariableStore();
  vs.var('input:asdf', 'input value');
  vs.var('address:asdf:analyzer', 'analyzer value');
  vs.var('address:asdf:field', 'field value');
  vs.var('address:asdf:boost', 'boost value');
  vs.var('address:cutoff_frequency', 'cutoff_frequency value');

  if (toExclude) {
    vs.unset(toExclude);
  }

  return vs;

}

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof address, 'function', 'valid function');
    t.equal(address.length, 1, 'takes 1 arg');
    t.end();
  });

};

module.exports.tests.no_property = function(test, common) {
  test('empty property should return null even if all other fields are present', function(t) {
    var vs = new VariableStore();
    vs.var('input:', 'input value');
    vs.var('address::analyzer', 'analyzer value');
    vs.var('address::field', 'field value');
    vs.var('address::boost', 'boost value');
    vs.var('address:cutoff_frequency', 'cutoff_frequency value');

    var falseyPropertyAddress = require('../../view/address')('');
    var actual = address(vs);

    t.equal(actual, null, 'should have returned null');
    t.end();

  });

  test('0 property should return null even if all other fields are present', function(t) {
    var vs = new VariableStore();
    vs.var('input:0', 'input value');
    vs.var('address:0:analyzer', 'analyzer value');
    vs.var('address:0:field', 'field value');
    vs.var('address:0:boost', 'boost value');
    vs.var('address:cutoff_frequency', 'cutoff_frequency value');

    var falseyPropertyAddress = require('../../view/address')(0);
    var actual = address(vs);

    t.equal(actual, null, 'should have returned null');
    t.end();

  });

  test('false property should return null even if all other fields are present', function(t) {
    var vs = new VariableStore();
    vs.var('input:false', 'input value');
    vs.var('address:false:analyzer', 'analyzer value');
    vs.var('address:false:field', 'field value');
    vs.var('address:false:boost', 'boost value');

    var falseyPropertyAddress = require('../../view/address')(false);
    var actual = address(vs);

    t.equal(actual, null, 'should have returned null');
    t.end();

  });

};

module.exports.tests.missing_variable_conditions = function(test, common) {
  var variables = Object.keys(getBaseVariableStore().export());

  variables.forEach(function(missing_variable) {
    test('missing required variable ' + missing_variable + ' should return null', function(t) {
      var vs = getBaseVariableStore(missing_variable);

      t.equal(address(vs), null, 'should have returned null for unset ' + missing_variable);
      t.end();

    });
  });

};

module.exports.tests.no_exceptions_conditions = function(test, common) {
  test('all required values should return formed object', function(t) {
    var vs = new VariableStore();
    vs.var('input:asdf', 'input value');
    vs.var('address:asdf:analyzer', 'analyzer value');
    vs.var('address:asdf:field', 'field value');
    vs.var('address:asdf:boost', 'boost value');
    vs.var('address:cutoff_frequency', 'cutoff_frequency value');

    var actual = address(vs);

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
    return tape('address ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
