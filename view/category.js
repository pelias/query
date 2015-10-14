module.exports = function( vs ){

  // validate required params
  if( !vs.isset('category:field') ||
      !vs.isset('category:categories') ){
    return null;
  }

  // base view
  var view = { "terms": {} };

  // terms query
  view.terms[ vs.var('category:field') ] = vs.var('category:categories');

  return view;
};