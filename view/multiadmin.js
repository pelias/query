
/**
  this view is wrapped in a function so it can be re-used for
  all the multiadmin[property] fields.
**/

module.exports = function( property ){
  return function( vs ){

    // validate required params
    if( !property ||
        !vs.isset('input:'+property) ||
        !vs.isset('admin:'+property+':analyzer') ||
        !vs.isset('multiadmin:'+property+':fields') ||
        !vs.isset('admin:'+property+':boost') ){
      return null;
    }

    // base view
    var view = { "multi_match": {
      analyzer: vs.var('admin:'+property+':analyzer'),
      boost: vs.var('admin:'+property+':boost'),
      fields: vs.var('multiadmin:'+property+'fields'),
      query: vs.var('input:'+property)
    }};

    return view;
  };
};
