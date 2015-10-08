
module.exports = function( subview ){
  return function( vs ){

    // query section reduces the number of records which
    // the decay function is applied to.
    // we simply re-use the another view for the function query.
    if( !subview ){ return null; } // subview validation failed

    // validate required params
    if( !vs.isset('focus:point:lat') ||
        !vs.isset('focus:point:lon') ||
        !vs.isset('centroid:field') ||
        !vs.isset('function_score:score_mode') ||
        !vs.isset('function_score:boost_mode') ||
        !vs.isset('focus:weight') ||
        !vs.isset('focus:function') ||
        !vs.isset('focus:offset') ||
        !vs.isset('focus:scale') ||
        !vs.isset('focus:decay') ){
      return null;
    }

    // base view
    var view = {
      function_score: {
        query: subview( vs ),
        functions: [],
        score_mode: vs.var('function_score:score_mode'),
        boost_mode: vs.var('function_score:boost_mode')
      }
    };

    // decay function
    var func = { weight: vs.var('focus:weight') };
    func[ vs.var('focus:function') ] = {};
    func[ vs.var('focus:function') ][ vs.var('centroid:field') ] = {
      origin: {
        lat: vs.var('focus:point:lat'),
        lon: vs.var('focus:point:lon')
      },
      offset: vs.var('focus:offset'),
      scale: vs.var('focus:scale'),
      decay: vs.var('focus:decay')
    };
    view.function_score.functions.push( func );

    return view;
  };
};
