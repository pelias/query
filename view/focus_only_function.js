
module.exports = function( ){
  return function( vs ){

    // validate required params
    if( !vs.isset('focus:point:lat') ||
        !vs.isset('focus:point:lon') ||
        !vs.isset('centroid:field') ||
        !vs.isset('focus:weight') ||
        !vs.isset('focus:function') ||
        !vs.isset('focus:offset') ||
        !vs.isset('focus:scale') ||
        !vs.isset('focus:decay') ){
      return null;
    }

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

    return func;
  };
};
