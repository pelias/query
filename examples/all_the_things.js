
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
vs.set({ 'input:county': 'New York' });

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
q.score( query.view.admin('country_a') )
 .score( query.view.admin('country') )
 .score( query.view.admin('region') )
 .score( query.view.admin('region_a') )
 .score( query.view.admin('county') )
 .score( query.view.admin('localadmin') )
 .score( query.view.admin('locality') )
 .score( query.view.admin('neighbourhood') );

// non-scoring hard filters
q.filter( query.view.boundary_circle )
 .filter( query.view.boundary_rect );

// sorting 'tie-breakers'
q.sort( query.view.sort_distance );

var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );