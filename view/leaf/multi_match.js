const multi_match = require('../../lib/leaf/multi_match');
const OPTIONAL_PARAMS = multi_match.OPTIONAL_PARAMS;

module.exports = function( prefix ){
  const type_variable = `multi_match:${prefix}:type`;
  const fields_variable = `multi_match:${prefix}:fields`;
  const input_variable = `multi_match:${prefix}:input`;

  return function( vs ){
    if( !vs.isset(fields_variable)||
      !vs.isset(input_variable) ) {
      return null;
    }

    // best_fields is the default value in ES
    const type = vs.isset(type_variable) ? vs.var(type_variable) : 'best_fields';
    const options = { };

    OPTIONAL_PARAMS[type].forEach(function(param) {
      const variable_name = `multi_match:${prefix}:${param}`;
      if (vs.isset(variable_name)) {
        options[param] = vs.var(variable_name);
      }
    });

    return multi_match(type, vs.var(fields_variable), vs.var(input_variable), options);
  };
};
