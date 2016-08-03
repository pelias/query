module.exports = function( vs ){

  // validate required params
  if( !vs.isset('categories:field') ||
    !vs.isset('input:categories') ){
    return null;
  }

  // base view
  var view = { terms: {} };

  var value = vs.var('input:categories').get();
  if (!(value instanceof Array)) {
    value = [ value ];
  }

  // terms query
  view.terms[ vs.var('categories:field') ] = value;

  return view;
};
