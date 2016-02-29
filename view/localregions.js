
module.exports = function( types ){
  return function( vs ){

    // validate required params
    if( !vs.isset('focus:point:lat') ||
        !vs.isset('focus:point:lon') ||
        !vs.isset('centroid:field') ||
        !vs.isset('localregions:weight') ||
        !vs.isset('localregions:function') ||
        !vs.isset('localregions:offset') ||
        !vs.isset('localregions:scale') ||
        !vs.isset('localregions:decay') ){
      return null;
    }

    // base view
    var view = {
      function_score: {
        // filter: {
        //   'or': [
        //     { 'type': { 'value': 'locality' } },
        //     { 'type': { 'value': 'localadmin' } },
        //     { 'type': { 'value': 'neighbourhood' } }
        //   ]
        // },
        // max_boost: 2,
        functions: [],
        score_mode: 'first',
        boost_mode: 'replace'
      }
    };

    // a list of _types to target
    if( Array.isArray( types ) ){
      view.function_score.filter = {
        or: types.map( function( type ){
          return { type: { value: type } };
        })
      };
    }

    // decay function
    var func = { weight: vs.var('localregions:weight') };
    func[ vs.var('localregions:function') ] = {};
    func[ vs.var('localregions:function') ][ vs.var('centroid:field') ] = {
      origin: {
        lat: vs.var('focus:point:lat'),
        lon: vs.var('focus:point:lon')
      },
      offset: vs.var('localregions:offset'),
      scale: vs.var('localregions:scale'),
      decay: vs.var('localregions:decay')
    };
    view.function_score.functions.push( func );

    return view;
  };
};