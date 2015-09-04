
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('boundary:country') ||
      !vs.isset('admin:alpha3:analyzer') ||
      !vs.isset('admin:alpha3:field') ){
    return null;
  }

  // base view
  var view = { "match": {} };

  // match query
  view.match[ vs.var('admin:alpha3:field') ] = {
    analyzer: vs.var('admin:alpha3:analyzer'),
    query: vs.var('boundary:country')
  };

  return view;
};