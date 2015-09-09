
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('focus:point:lat') ||
      !vs.isset('focus:point:lon') ||
      !vs.isset('sort:distance:order') ||
      !vs.isset('sort:distance:distance_type') ||
      !vs.isset('centroid:field') ){
    return null;
  }

  // base view
  var view = {
    _geo_distance: {
      order: vs.var('sort:distance:order'),
      distance_type: vs.var('sort:distance:distance_type')
    }
  };

  // centroid
  view._geo_distance[ vs.var('centroid:field') ] = {
    lat: vs.var('focus:point:lat'),
    lon: vs.var('focus:point:lon')
  };

  return view;
};