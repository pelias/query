const match = require('../../lib/leaf/match');

module.exports = function( prefix ){
  return function( vs ){
    const input_variable = `match:${prefix}:input`;
    const field_variable = `match:${prefix}:field`;

    if( !vs.isset(input_variable) ||
      !vs.isset(field_variable) ) {
      return null;
    }

    const options = { };

    const optional_params = ['boost',
      'operator',
      'analyzer',
      'cutoff_frequency',
      'fuzziness',
      'max_expansions',
      'prefix_length',
      'fuzzy_transpositions',
      'minimum_should_match',
      'zero_terms_query'];

    optional_params.forEach(function(param) {
      const variable_name = `match:${prefix}:${param}`;
      if (vs.isset(variable_name)) {
        options[param] = vs.var(variable_name);
      }
    });

    return match(vs.var(field_variable), vs.var(input_variable), options);
  };
};
