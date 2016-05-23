
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('boundary:country') ||
      !vs.isset('admin:country_a:analyzer') ||
      !vs.isset('admin:country_a:field') ){
    return null;
  }

  // base view
  var view = { 'match': {} };

  // match query
  view.match[ vs.var('admin:country_a:field') ] = {
    analyzer: vs.var('admin:country_a:analyzer'),
    query: vs.var('boundary:country')
  };

  return view;
};
