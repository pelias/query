
module.exports = function( types ){
  return function( vs ){

    // validate required params
    if( !vs.isset('popularity:field') ||
        !vs.isset('popularity:modifier'),
        !vs.isset('popularity:max_boost') ){
      return null;
    }

    // base view
    var view = {
      function_score: {
        query: {
          'filtered': {
            'filter': {
              'exists': {
                'field': vs.var('popularity:field')
              }
            }
          }
        },
        // filter: {
        //   'or': [
        //     { 'type': { 'value': 'admin0' } },
        //     { 'type': { 'value': 'admin1' } },
        //     { 'type': { 'value': 'admin2' } }
        //   ]
        // },
        max_boost: vs.var('popularity:max_boost'),
        functions: [],
        score_mode: 'first',
        boost_mode: 'replace',
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

    view.function_score.functions.push({
      field_value_factor: {
        modifier: vs.var('popularity:modifier'),
        field: vs.var('popularity:field')
      },
      weight: vs.var('popularity:weight')
    });

  return view;
  };
};