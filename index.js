
module.exports.Vars = require('./lib/VariableStore');
module.exports.Variable = require('./lib/Variable');

module.exports.layout = {
  FilteredBooleanQuery: require('./layout/FilteredBooleanQuery')
};

module.exports.view = {
  focus: require('./view/focus'),
  ngrams: require('./view/ngrams'),
  phrase: require('./view/phrase'),
  address: require('./view/address'),
  admin: require('./view/admin'),
  boundary_circle: require('./view/boundary_circle'),
  boundary_rect: require('./view/boundary_rect'),
  boundary_country: require('./view/boundary_country'),
  sort_distance: require('./view/sort_distance'),
  sort_numeric_script: require('./view/sort_numeric_script')
};

module.exports.defaults = require('./defaults');