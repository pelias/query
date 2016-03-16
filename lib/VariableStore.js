
/**
  A simple dictionary of Variable() objects

  note: you may inject your own variables when calling the constructor
**/

var check = require('check-types'),
    Variable = require('./Variable');

function VariableStore( vars ){
  this._vars = {};
  if( check.assigned( vars ) ){
    this.set( vars );
  }
}

/**
  var() can be used as *both* a getter *or* a setter (as per jquery)
  depending on how many arguments are set.

  var vs = new VariableStore();

  // to get a variable:
  var a = vs.var('foo');

  // to set a variable:
  vs.var('foo','bar');

  // or
  vs.var('foo').set('bar');
**/
VariableStore.prototype.var = function( key, val ){
  if( !check.nonEmptyString( key ) ){
    throw new Error( 'invalid query variable, key must be valid string' );
  }
  // init variable
  if( !this._vars.hasOwnProperty( key ) ){
    this._vars[ key ] = new Variable();
  }
  // setter
  if( check.assigned( val ) ){
    this._vars[ key ].set( val );
  }
  // getter
  return this._vars[ key ];
};

/**
  check if a key has been set (has a value)
**/
VariableStore.prototype.isset = function( key ){
  if( !check.nonEmptyString( key ) ){
    throw new Error( 'invalid key, must be valid string' );
  }
  // key not set
  if( !this._vars.hasOwnProperty( key ) ){
    return false;
  }
  // true if value is set else false
  return this._vars[ key ].get() !== '';
};

/**
  delete a variable by key
**/
VariableStore.prototype.unset = function( key ){
  if( !check.nonEmptyString( key ) ){
    throw new Error( 'invalid key, must be valid string' );
  }
  // key not set
  if( !this._vars.hasOwnProperty( key ) ){
    return false;
  }
  // delete variable
  delete this._vars[ key ];
  return true;
};

/**
  import variables from a plain-old-javascript-object
**/
VariableStore.prototype.set = function( pojo ){
  if( !check.object( pojo ) ){
    throw new Error( 'invalid object' );
  }
  for( var attr in pojo ){
    this.var( attr ).set( pojo[attr] );
  }
};

/**
  export variables for debugging purposes
**/
VariableStore.prototype.export = function(){
  var out = {};
  for( var v in this._vars ){
    out[ v ] = this._vars[v].get();
  }
  return out;
};

module.exports = VariableStore;
