
/**
  this view is wrapped in a function so it can be re-used for
  all the admin[property] fields.
**/

module.exports = function( property ){
  return function( vs ){

    // validate required params
    if( !property ||
        !vs.isset('input:'+property) ||
        !vs.isset('admin:'+property+':analyzer') ||
        !vs.isset('admin:'+property+':field') ||
        !vs.isset('admin:'+property+':boost') ){
      return null;
    }

    // base view
    let view = { 'match': {} };

    // match query
    let section = view.match[ vs.var('admin:'+property+':field') ] = {
      analyzer: vs.var('admin:'+property+':analyzer'),
      boost: vs.var('admin:'+property+':boost'),
      query: vs.var('input:'+property)
    };

    // optional 'cutoff_frequency' property
    if( vs.isset('admin:'+property+':cutoff_frequency') ){
      section.cutoff_frequency = vs.var('admin:'+property+':cutoff_frequency');
    }

    return view;
  };
};
