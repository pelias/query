
module.exports = function( vs ){

  // validate required params
  if( !vs.isset('boundary:circle:lat') ||
      !vs.isset('boundary:circle:lon') ||
      !vs.isset('boundary:circle:radius') ||
      !vs.isset('boundary:circle:distance_type') ||
      !vs.isset('boundary:circle:optimize_bbox') ||
      !vs.isset('centroid:field') ){
    return null;
  }

  // base view
  var view = {
    geo_distance: {
      distance: vs.var('boundary:circle:radius'),
      distance_type: vs.var('boundary:circle:distance_type'),
      optimize_bbox: vs.var('boundary:circle:optimize_bbox')
    }
  };

  // centroid
  view.geo_distance[ vs.var('centroid:field') ] = {
    lat: vs.var('boundary:circle:lat'),
    lon: vs.var('boundary:circle:lon')
  };

  return view;
};
