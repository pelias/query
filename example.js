
var query = require('./index');
var defaults = require('./defaults');

/**
  === input params ===

  input:name: 'hackney city farm'

  focus:point:lat: 1.1
  focus:point:lon: 2.2

  input:housenumber: 101
  input:street: "hackney road"
  input:postcode: "E81DN"

  input:alpha3: "GBR"
  input:admin0: "hackney"
  input:admin1: "hackney"
  input:admin1_abbr: "hackney"
  input:admin2: "hackney"
  input:local_admin: "hackney"
  input:locality: "hackney"
  input:neighborhood: "hackney"

  boundary:circle:lat: 1
  boundary:circle:lon: 2
  boundary:circle:radius: "50km"

  boundary:rect:top: 1
  boundary:rect:right: 2
  boundary:rect:bottom: 2
  boundary:rect:left: 1

  boundary:country: "USA"
**/

var vs = new query.Vars( defaults );
var q = new query.layout.FilteredBooleanQuery();

vs.var( 'input:name','hackney city farm' );
vs.set({ 'focus:point:lat': 1, 'focus:point:lon': 2 });
vs.set({ 'input:housenumber': 1, 'input:street': 'foo street' });
vs.set({ 'boundary:circle:lat': 1, 'boundary:circle:lon': 2 });

vs.set({
  'boundary:rect:top': 1,
  'boundary:rect:right': 2,
  'boundary:rect:bottom': 2,
  'boundary:rect:left': 2
});

vs.set({
  'boundary:country': 'USA'
});

vs.set({
  'input:admin2': 'New York'
});

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

var rendered = q.render( vs );

console.log( JSON.stringify( rendered, null, 2 ) );