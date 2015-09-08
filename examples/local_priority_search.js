
/**
  And example of a linguistic search which ranks local records
  higher than those far away (but does not exclude them)
**/

// this is our target point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

var query = require('../index'),
    vs = new query.Vars( query.defaults ),
    q = new query.layout.FilteredBooleanQuery();

// the input text provided by the user
vs.var( 'input:name', 'union square' );

// the field on which to match and analyzer to use
vs.var( 'phrase:field', 'phrase.default' );
vs.var( 'phrase:analyzer', 'standard' );

// the linguistic matching strategy to use for scoring
q.score( query.view.phrase );

// the input point to use for localization
vs.var('focus:point:lat', focus.lat);
vs.var('focus:point:lon', focus.lon);

// we can (optionally) change the decay arc
vs.var('focus:function', 'gauss');
vs.var('focus:offset', '10km');
vs.var('focus:scale', '100km');
vs.var('focus:decay', 0.4);

// apply the geographic decay function
q.score( query.view.focus );

// render the query
var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );