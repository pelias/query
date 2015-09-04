
var tape = require('tape');
var common = {};

var tests = [
  require('./lib/Variable.js'),
  require('./lib/VariableStore.js')
];

tests.map(function(t) {
  t.all(tape, common);
});
