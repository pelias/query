/***
 * // simple view for an arbitrary multi_match query
 *
 * params:
 * @fields_with_boosts: objects with a structure like
 * {
 *   field: 'fieldName',
 *   boost: 5 //optional
 * }
 * @analyzer: a string for the analyzer name
 * @query_var: the variable that stores the actual query
 *
 */
module.exports = function( vs, fields_with_boosts, analyzer, query_var ){
  // base view
  var view = { multi_match: {} };

  if (!vs.isset(query_var) || !analyzer) {
    return null;
  }

  // construct the field string (which contains the boost)
  // from the more friendly object representation
  var fields = fields_with_boosts.map(function(data) {
    var fieldString = data.field;
    var boost = data.boost || 1;
    return fieldString +'^' + boost;
  });

  view.multi_match.fields = fields;
  view.multi_match.query = vs.var(query_var);
  view.multi_match.analyzer = analyzer;

  if (vs.isset('multi_match:type')) {
    view.multi_match.type = vs.var('multi_match:type');
  }

  if (vs.isset('multi_match:operator')) {
    view.multi_match.operator = vs.var('multi_match:operator');
  }

  if (vs.isset('multi_match:cutoff_frequency')) {
    view.multi_match.cutoff_frequency = vs.var('multi_match:cutoff_frequency');
  }

  return view;
};
