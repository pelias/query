
var tape = require('tape');
var common = {};

var tests = [
  require('./layout/AddressesUsingIdsQuery.js'),
  require('./layout/FallbackQuery.js'),
  require('./layout/FilteredBooleanQuery.js'),
  require('./layout/StructuredFallbackQuery.js'),
  require('./layout/VenuesQuery.js'),
  require('./lib/leaf/terms.js'),
  require('./lib/Variable.js'),
  require('./lib/VariableStore.js'),
  require('./view/address.js'),
  require('./view/admin.js'),
  require('./view/admin_multi_match.js'),
  require('./view/boundary_circle.js'),
  require('./view/boundary_country.js'),
  require('./view/boundary_rect.js'),
  require('./view/categories.js'),
  require('./view/focus.js'),
  require('./view/focus_only_function.js'),
  require('./view/layers.js'),
  require('./view/multi_match.js'),
  require('./view/ngrams.js'),
  require('./view/phrase.js'),
  require('./view/popularity.js'),
  require('./view/popularity_only_function.js'),
  require('./view/population.js'),
  require('./view/population_only_function.js'),
  require('./view/sort_distance.js'),
  require('./view/sources.js'),
  require('./view/boundary_gid.js')
];

tests.map(function(t) {
  t.all(tape, common);
});
