
var Variable = require('../../lib/Variable');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof Variable, 'function', 'valid function');
    t.equal(Variable.length, 0, 'takes 0 args');
    t.end();
  });
  test('interface: set', function(t) {
    t.equal(typeof Variable.prototype.set, 'function', 'valid function');
    t.equal(Variable.prototype.set.length, 1, 'takes 1 args');
    t.end();
  });
  test('instantiate', function(t) {
    var v = new Variable();
    t.equal(v.$, '', 'default value');
    t.end();
  });
};

module.exports.tests.set = function(test, common) {
  test('set: invalid value', function(t) {
    var v = new Variable();
    t.throws(function(){
      v.set();
    });
    t.throws(function(){
      v.set('');
    });
    t.throws(function(){
      v.set({ foo: 'bar' });
    });
    t.throws(function(){
      v.set( null );
    });
    t.end();
  });
  test('set: valid value', function(t) {
    var v = new Variable();

    v.set('a');
    t.equal(v.$, 'a', 'string');

    v.set('a b');
    t.equal(v.$, 'a b', 'string');

    v.set(1);
    t.equal(v.$, 1, 'number');

    v.set(0);
    t.equal(v.$, 0, 'number');

    v.set(1.1);
    t.equal(v.$, 1.1, 'float');

    v.set(false);
    t.equal(v.$, false, 'boolean');

    v.set([1, 2, 3]);
    t.isEquivalent(v.$, [1, 2, 3], 'array');

    v.set(['a', 'b']);
    t.deepEqual(v.$, ['a', 'b'], 'array');

    t.end();
  });
};

module.exports.tests.get = function(test, common) {
  test('get', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(v.get(), 1.1, 'get');
    t.end();
  });
};

module.exports.tests.valueOf = function(test, common) {
  test('valueOf', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(v.valueOf(), 1.1, 'valueOf');
    t.end();
  });
  test('valueOf: coercion', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(1+v, 2.1, 'coercion');
    t.end();
  });
};

module.exports.tests.toString = function(test, common) {
  test('toString', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(v.toString(), 1.1, 'toString');
    t.end();
  });
  test('toString: coercion', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(''+v, '1.1', 'coercion');
    t.end();
  });
  test('toString: array', function(t) {
    var v = new Variable();
    v.set([1, 2, 3]);
    t.equal(''+v.toString(), '1,2,3', 'array');
    t.end();
  });
};

module.exports.tests.toJSON = function(test, common) {
  test('toJSON', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal(v.toJSON(), 1.1, 'toJSON');
    t.end();
  });
  test('toJSON: stringify', function(t) {
    var v = new Variable();
    v.set(1.1);
    t.equal( JSON.stringify({ test: v }), '{"test":1.1}', 'stringify');
    t.end();
  });
  test('toJSON: array', function(t) {
    var v = new Variable();
    v.set([1, 2, 3]);
    t.equal(JSON.stringify({ test: v }), '{"test":[1,2,3]}', 'array');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('Variable ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
