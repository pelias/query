
/**
  And example of a reverse geocoding query to match and return
  the nearest record to our focus point.
**/

// this is our focus point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

var query = require('../index'),
    vs = new query.Vars( query.defaults );

/**
  build a query with 2 conditions:
  - (optional) geographic bounds
  - sort results by distance
**/
var q = new query.layout.FilteredBooleanQuery()
  .filter( query.view.boundary_circle )
  .sort( query.view.sort_distance );

// we only want 1 result
vs.var('size', 1);

// set bounding variables
vs.set({
  'boundary:circle:lat': focus.lat,
  'boundary:circle:lon': focus.lon,
  'boundary:circle:radius': '5km'
});

// set focus point
vs.set({
  'focus:point:lat': focus.lat,
  'focus:point:lon': focus.lon
});

// render the query
var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );