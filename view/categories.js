const terms = require('../lib/leaf/terms');

function asArray( value ){
  return ( value instanceof Array ) ? value : [ value ];
}

module.exports = function( vs ){

  // validate required params
  if( !vs.isset('categories:field') ||
    ( !vs.isset('input:categories') && !vs.isset('input:not_categories') ) ){
    return null;
  }

  const field = vs.var('categories:field').get();

  const must = [];
  const must_not = [];

  if( vs.isset('input:categories') ){
    must.push( terms( field, asArray( vs.var('input:categories').get() ) ) );
  }

  if( vs.isset('input:not_categories') ){
    must_not.push( terms( field, asArray( vs.var('input:not_categories').get() ) ) );
  }

  // only exclusions provided, no inclusions
  if( !must.length ){
    return { bool: { must_not: must_not } };
  }

  // only inclusions provided, no exclusions
  if( !must_not.length ){
    return must[0];
  }

  // both inclusions and exclusions provided
  return { bool: { must: must, must_not: must_not } };
};
