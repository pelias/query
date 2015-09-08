
var query = require('../index'),
    vs = new query.Vars( query.defaults ),
    q = new query.layout.FilteredBooleanQuery();

vs.var( 'input:name', 'hackney city farm' );
vs.set({ 'focus:point:lat': 1, 'focus:point:lon': 2 });
vs.set({ 'input:housenumber': 1, 'input:street': 'foo street' });
vs.set({ 'boundary:circle:lat': 1, 'boundary:circle:lon': 2 });

vs.set({
  'boundary:rect:top': 1,
  'boundary:rect:right': 2,
  'boundary:rect:bottom': 2,
  'boundary:rect:left': 2
});

vs.set({ 'boundary:country': 'USA' });
vs.set({ 'input:admin2': 'New York' });

// mandatory matches
q.score( query.view.boundary_country, 'must' )
 .score( query.view.ngrams, 'must' );

// scoring boost
q.score( query.view.phrase )
 .score( query.view.focus );

// address components
q.score( query.view.address('housenumber') )
 .score( query.view.address('street') )
 .score( query.view.address('postcode') );

// admin components
q.score( query.view.admin('alpha3') )
 .score( query.view.admin('admin0') )
 .score( query.view.admin('admin1') )
 .score( query.view.admin('admin1_abbr') )
 .score( query.view.admin('admin2') )
 .score( query.view.admin('local_admin') )
 .score( query.view.admin('locality') )
 .score( query.view.admin('neighborhood') );

// non-scoring hard filters
q.filter( query.view.boundary_circle )
 .filter( query.view.boundary_rect );

// sorting 'tie-breakers'
q.sort( query.view.sort_distance );

var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );