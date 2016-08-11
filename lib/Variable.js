
/**
 A primitive Javascript variable wrapped in an Object so that it can be
 handled by reference instead of by value.

 This is useful as an inline variable placeholder where the value may or
 may not be known when the query is constructed.

 note: values must be a valid js primitive type (string,numeric,boolean),
 or an Array. No objects allowed.
 note: the object prototype contains custom serialization methods

 warning: using an instance of Variable() in a boolean operation will
 *always* yield true; regardless of the underlying value; because js.
 **/

var check = require('check-types');

function Variable(){
  this.$ = '';
}

Variable.prototype.set = function( val ){
  if( !check.nonEmptyString(val) && !check.number(val) && !check.boolean(val) && !check.array(val) ){
    throw new Error( 'invalid value, value must be valid js Variable' );
  }
  this.$ = val;
};

Variable.prototype.valueOf =
Variable.prototype.toString =
Variable.prototype.toJSON =
Variable.prototype.get = function(){
  return this.$;
};

module.exports = Variable;