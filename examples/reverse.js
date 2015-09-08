
/**
  And example of a reverse geocoding query to match and return
  the nearest record to our focus point.
**/

// this is our focus point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

var query = require('../index'),
    vs = new query.Vars( query.defaults ),
    q = new query.layout.FilteredBooleanQuery();

// we only want 1 result
vs.var('size', 1);

// we can (optionally set an outer bounds to the query)
vs.var('boundary:circle:lat', focus.lat);
vs.var('boundary:circle:lon', focus.lon);
vs.var('boundary:circle:radius', '5km');
q.filter( query.view.boundary_circle );

// sort results so the nearest one comes first
vs.var('focus:point:lat', focus.lat);
vs.var('focus:point:lon', focus.lon);
q.sort( query.view.sort_distance );

// render the query
var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );