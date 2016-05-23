/**
  this view is wrapped in a function so it can be re-used
**/

var multi_match = require('./multi_match');

/*
 * Match several admin fields against the same query
 */
module.exports = function( admin_properties, analyzer ){
  return function( vs ){

    // check which of the possible admin_properties are actually set
    // from the query
    var valid_admin_properties = admin_properties.filter(function(admin_property) {
      return admin_property &&
          vs.isset('input:'+admin_property) &&
          vs.isset('admin:'+admin_property+':field');
    });

    if (valid_admin_properties.length === 0) {
      return null;
    }

    // from the input parameters, generate a list of fields with boosts to
    // query against
    var fields_with_boosts = valid_admin_properties.map(function(admin_property) {
      var boost = 1;
      if (vs.isset('admin:' + admin_property + ':boost')) {
        boost = vs.var('admin:' + admin_property + ':boost');
      }

      return {
        field: vs.var('admin:' + admin_property + ':field'),
        boost: boost
      };
    });

    // the actual query text is simply taken from the first valid admin field
    // this assumes all the values would be the same, which is probably not true
    // TODO: handle the case where not all admin area input values are the same
    var queryVar = 'input:' + valid_admin_properties[0];

    // send the parameters to the standard multi_match view
    var view = multi_match(vs, fields_with_boosts, analyzer, queryVar);

    return view;
  };
};
