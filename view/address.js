
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
        !vs.isset('address:'+property+':boost') ){
      return null;
    }

    // base view
    let view = { 'match': {} };

    // match query
    let section = view.match[ vs.var('address:'+property+':field') ] = {
      analyzer: vs.var('address:'+property+':analyzer'),
      boost: vs.var('address:'+property+':boost'),
      query: vs.var('input:'+property)
    };

    // optional 'cutoff_frequency' property
    if( vs.isset('address:'+property+':cutoff_frequency') ){
      section.cutoff_frequency = vs.var('address:'+property+':cutoff_frequency');
    }

    return view;
  };
};
