
module.exports = function( subview ){
  return function( vs ){

    // query section reduces the number of records which
    // the decay function is applied to.
    // we simply re-use the another view for the function query.
    if( !subview ){ return null; } // subview validation failed

    // validate required params
    if( !vs.isset('popularity:field') ||
        !vs.isset('popularity:modifier') ||
        !vs.isset('popularity:max_boost') ){
      return null;
    }

    // base view
    var view = {
      function_score: {
        query: subview( vs ),
        max_boost: vs.var('popularity:max_boost'),
        functions: [],
        score_mode: 'first',
        boost_mode: 'replace'
      }
    };

    view.function_score.functions.push({
      field_value_factor: {
        modifier: vs.var('popularity:modifier'),
        field: vs.var('popularity:field'),
        missing: 1
      },
      weight: vs.var('popularity:weight')
    });

  return view;
  };
};
