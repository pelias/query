const match_phrase = require('../../lib/leaf/match_phrase');

const optional_params = ['boost', 'slop', 'analyzer'];

module.exports = function( prefix ){
  return function( vs ){

    const input_variable = `match_phrase:${prefix}:input`;
    const field_variable = `match_phrase:${prefix}:field`;

    if( !vs.isset(input_variable) ||
      !vs.isset(field_variable) ) {
      return null;
    }

    const options = { };

    optional_params.forEach(function(param) {
      const variable_name = `match_phrase:${prefix}:${param}`;
      if (vs.isset(variable_name)) {
        options[param] = vs.var(variable_name);
      }
    });

    return match_phrase(vs.var(field_variable), vs.var(input_variable), options);
  };
};
