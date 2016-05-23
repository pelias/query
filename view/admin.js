
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
        (!vs.isset('admin:'+property+':field') && !vs.isset('admin:'+property+':multifield')) ||
        !vs.isset('admin:'+property+':boost') ){
      return null;
    }

    var view;

    if(vs.isset('admin:'+property+':multifield')) {
      view = { 'multi_match': { // multi_match query
	analyzer: vs.var('admin:'+property+':analyzer'),
	boost: vs.var('admin:'+property+':boost'),
	query: vs.var('input:'+property),
	fields: vs.var('admin:'+property+':multifield')
      }};
    }
    else {
      view = { 'match': {} };

      // match query
      view.match[ vs.var('admin:'+property+':field') ] = {
	analyzer: vs.var('admin:'+property+':analyzer'),
	boost: vs.var('admin:'+property+':boost'),
	query: vs.var('input:'+property)
      };
    }

    return view;
  };
};
