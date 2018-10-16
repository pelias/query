
/**
  this view is wrapped in a function so it can be re-used for
  all the address[property] fields.
**/

module.exports = function( property ){
  return function( vs ){

    // validate required params
    if( !property ||
        !vs.isset('input:'+property) ||
        !vs.isset('address:'+property+':analyzer') ||
        !vs.isset('address:'+property+':field') ||
        !vs.isset('address:cutoff_frequency') ||
        !vs.isset('address:'+property+':boost') ){
      return null;
    }

    // base view
    var view = { 'match': {} };

    // match query
    view.match[ vs.var('address:'+property+':field') ] = {
      analyzer: vs.var('address:'+property+':analyzer'),
      boost: vs.var('address:'+property+':boost'),
      cutoff_frequency: vs.var('address:cutoff_frequency'),
      query: vs.var('input:'+property)
    };

    return view;
  };
};
