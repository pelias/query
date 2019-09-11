module.exports = function( property, value, params ) {
  if( !property || !value) {
    return null;
  }

  const query = {
    match_phrase: {
      [property]: {
        query: value
      }
    }
  };

  const optional_params = ['boost', 'slop', 'analyzer'];

  optional_params.forEach(function(param) {
    if (params && params[param]) {
      query.match_phrase[property][param] = params[param];
    }
  });

  return query;
};
