
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('boundary:country') ||
      !vs.isset('admin:country_a:analyzer') ){
    return null;
  }

  // base view
  var view = { };

  // match query
  view.multi_match = {
    fields: [ 'parent.country_a', 'parent.dependency_a' ],
    analyzer: vs.var('admin:country_a:analyzer'),
    query: vs.var('boundary:country')
  };

  return view;
};
