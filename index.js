
module.exports.Vars = require('./lib/VariableStore');
module.exports.Variable = require('./lib/Variable');

module.exports.layout = {
  FilteredBooleanQuery: require('./layout/FilteredBooleanQuery'),
  FallbackQuery: require('./layout/FallbackQuery'),
  StructuredFallbackQuery: require('./layout/StructuredFallbackQuery'),
  AddressesUsingIdsQuery: require('./layout/AddressesUsingIdsQuery'),
  VenuesQuery: require('./layout/VenuesQuery')
};

module.exports.view = {
  leaf: {
    match_all: require('./view/leaf/match_all'),
    match_phrase: require('./view/leaf/match_phrase'),
    match: require('./view/leaf/match')
  },
  focus: require('./view/focus'),
  focus_only_function: require('./view/focus_only_function'),
  popularity: require('./view/popularity'),
  population: require('./view/population'),
  popularity_only_function: require('./view/popularity_only_function'),
  population_only_function: require('./view/population_only_function'),
  ngrams: require('./view/ngrams'),
  phrase: require('./view/phrase'),
  address: require('./view/address'),
  admin: require('./view/admin'),
  admin_multi_match: require('./view/admin_multi_match'),
  multi_match: require('./view/multi_match'),
  categories: require('./view/categories'),
  boundary_circle: require('./view/boundary_circle'),
  boundary_rect: require('./view/boundary_rect'),
  boundary_country: require('./view/boundary_country'),
  sort_distance: require('./view/sort_distance'),
  sources: require('./view/sources'),
  layers: require('./view/layers'),
  boundary_gid: require('./view/boundary_gid')
};

module.exports.defaults = require('./defaults');
