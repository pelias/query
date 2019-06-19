
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('boundary:circle:lat') ||
      !vs.isset('boundary:circle:lon') ||
      !vs.isset('boundary:circle:radius') ||
      !vs.isset('boundary:circle:distance_type') ||
      !vs.isset('centroid:field') ){
    return null;
  }

  // base view
  var view = {
    geo_distance: {
      distance: vs.var('boundary:circle:radius'),
      distance_type: vs.var('boundary:circle:distance_type'),
    }
  };

  // centroid
  view.geo_distance[ vs.var('centroid:field') ] = {
    lat: vs.var('boundary:circle:lat'),
    lon: vs.var('boundary:circle:lon')
  };

  return view;
};
