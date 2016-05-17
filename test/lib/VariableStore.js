
var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: contructor', function(t) {
    t.equal(typeof VariableStore, 'function', 'valid function');
    t.equal(VariableStore.length, 1, 'takes 1 args');
    t.end();
  });
  test('interface: var', function(t) {
    t.equal(typeof VariableStore.prototype.var, 'function', 'valid function');
    t.equal(VariableStore.prototype.var.length, 2, 'takes 2 args');
    t.end();
  });
  test('interface: isset', function(t) {
    t.equal(typeof VariableStore.prototype.isset, 'function', 'valid function');
    t.equal(VariableStore.prototype.isset.length, 1, 'takes 1 args');
    t.end();
  });
  test('interface: unset', function(t) {
    t.equal(typeof VariableStore.prototype.unset, 'function', 'valid function');
    t.equal(VariableStore.prototype.unset.length, 1, 'takes 1 args');
    t.end();
  });
  test('interface: set', function(t) {
    t.equal(typeof VariableStore.prototype.set, 'function', 'valid function');
    t.equal(VariableStore.prototype.set.length, 1, 'takes 1 args');
    t.end();
  });
  test('instantiate', function(t) {
    var vs = new VariableStore();
    t.deepEqual(vs._vars, {}, 'default value');
    t.end();
  });
  test('instantiate: with values', function(t) {
    var vs = new VariableStore({ a: 'b', c: 'd' });
    t.equal(Object.keys(vs._vars).length, 2, 'init value');
    t.end();
  });
};

module.exports.tests.var = function(test, common) {
  test('var: invalid key', function(t) {
    var vs = new VariableStore();
    t.throws(function(){
      vs.var();
    });
    t.throws(function(){
      vs.var('');
    });
    t.throws(function(){
      vs.var(1);
    });
    t.throws(function(){
      vs.var({ foo: 'bar' });
    });
    t.throws(function(){
      vs.var( null );
    });
    t.throws(function(){
      vs.var([ 'a' ]);
    });
    t.end();
  });
  test('var: valid key', function(t) {
    var vs = new VariableStore();

    vs.var('a');
    t.true(vs._vars.hasOwnProperty('a'));

    vs.var('b b');
    t.true(vs._vars.hasOwnProperty('b b'));

    t.end();
  });
  test('var: create placeholder', function(t) {
    var vs = new VariableStore();

    var placeholder = vs.var('a');
    t.equal(vs._vars.a.get(), '');
    t.equal(placeholder.get(), '');

    t.end();
  });
  test('var: assign value to existing key', function(t) {
    var vs = new VariableStore();

    vs.var('a');
    vs.var('a','b');
    t.equal(vs._vars.a.get(), 'b');

    t.end();
  });
  test('var: assign value to new key', function(t) {
    var vs = new VariableStore();

    vs.var('a','b');
    t.equal(vs._vars.a.get(), 'b');

    t.end();
  });
  test('var: placeholder updates with new value', function(t) {
    var vs = new VariableStore();

    var placeholder = vs.var('a','b');
    vs.var('a').set('z');
    t.equal(placeholder.get(), 'z');

    t.end();
  });
};

module.exports.tests.isset = function(test, common) {
  test('isset: invalid key', function(t) {
    var vs = new VariableStore();
    t.throws(function(){
      vs.isset();
    });
    t.throws(function(){
      vs.isset('');
    });
    t.throws(function(){
      vs.isset(1);
    });
    t.throws(function(){
      vs.isset({ foo: 'bar' });
    });
    t.throws(function(){
      vs.isset( null );
    });
    t.throws(function(){
      vs.isset([ 'a' ]);
    });
    t.end();
  });
  test('isset: value set', function(t) {
    var vs = new VariableStore();

    vs.var('a');
    t.false(vs.isset('a'));

    vs.var('b','test');
    vs.unset('b');
    t.false(vs.isset('b'));

    vs.var('c',false);
    t.true(vs.isset('c'));

    vs.var('d','test');
    t.true(vs.isset('d'));

    t.end();
  });
};

module.exports.tests.unset = function(test, common) {
  test('unset: invalid key', function(t) {
    var vs = new VariableStore();
    t.throws(function(){
      vs.unset();
    });
    t.throws(function(){
      vs.unset('');
    });
    t.throws(function(){
      vs.unset(1);
    });
    t.throws(function(){
      vs.unset({ foo: 'bar' });
    });
    t.throws(function(){
      vs.unset( null );
    });
    t.throws(function(){
      vs.unset([ 'a' ]);
    });
    t.end();
  });
  test('unset: key not found', function(t) {
    var vs = new VariableStore();

    t.false(vs.unset('a'));

    t.end();
  });
  test('unset: key found', function(t) {
    var vs = new VariableStore();

    vs.var('a','b');
    t.equal(Object.keys(vs._vars).length, 1);

    t.true(vs.unset('a'));
    t.equal(Object.keys(vs._vars).length, 0);

    t.end();
  });
};

module.exports.tests.set = function(test, common) {
  test('set: invalid key', function(t) {
    var vs = new VariableStore();
    t.throws(function(){
      vs.set();
    });
    t.throws(function(){
      vs.set('');
    });
    t.throws(function(){
      vs.set(1);
    });
    t.throws(function(){
      vs.set('bar');
    });
    t.throws(function(){
      vs.set( null );
    });
    t.throws(function(){
      vs.set([ 'a' ]);
    });
    t.end();
  });
  test('set: valid pojo', function(t) {
    var vs = new VariableStore();

    vs.set({ a: 'b', c: 'd' });
    t.equal(Object.keys(vs._vars).length, 2);
    t.equal(vs.var('a').get(), 'b');
    t.equal(vs.var('c').get(), 'd');

    t.end();
  });
};

module.exports.tests.export = function(test, common) {
  test('export', function(t) {
    var vs = new VariableStore();

    t.deepEqual(vs.export(), {});

    vs.var('a',1.1);
    t.deepEqual(vs.export(), {a: 1.1});

    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('VariableStore ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
