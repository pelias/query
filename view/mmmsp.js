const multi_match = require('../../lib/leaf/multi_match');

module.exports = function( prefix ) {
  const fields_variable = `mmmsp:${prefix}:fields`;
  const input_variable = `mmmsp:${prefix}:input`;

  return {
    bool: {
      must: [
        multi_match('best_fields', vs.var(fields_variable), vs.var(input_variable));
      ],
      should: [
        multi_match('phrase', vs.var(fields_variable), vs.var(input_variable));
      ]
    }
  }
}
