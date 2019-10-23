const MATCH_PARAMS = [
  'tie_breaker', 'analyzer', 'boost', 'operator', 'minimum_should_match', 'fuzziness',
  'lenient', 'prefix_length', 'max_expansions', 'rewrite', 'zero_terms_query', 'cutoff_frequency'
];
const PHRASE_PARAMS = ['analyzer', 'boost', 'lenient', 'slop', 'zero_terms_query'];
const OPTIONAL_PARAMS = {
  'best_fields': MATCH_PARAMS,
  'most_fields': MATCH_PARAMS,
  'cross_fields': ['analyzer', 'boost', 'operator', 'minimum_should_match', 'lenient', 'zero_terms_query', 'cutoff_frequency'],
  'phrase': PHRASE_PARAMS,
  'phrase_prefix': PHRASE_PARAMS.concat('max_expansions')
};

module.exports = function( type, fields, value, params ) {
  if( !type || !value || !OPTIONAL_PARAMS[type] ) {
    return null;
  }

  const query = {
    multi_match: {
      type: type,
      query: value,
      fields: fields
    }
  };

  OPTIONAL_PARAMS[type].forEach(function(param) {
    if (params && params[param] && params[param].toString() !== '') {
      query.multi_match[param] = params[param];
    }
  });

  return query;
};

module.exports.OPTIONAL_PARAMS = OPTIONAL_PARAMS;