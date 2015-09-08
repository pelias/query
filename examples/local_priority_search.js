
/**
  And example of a linguistic search which ranks local records
  higher than those far away (but does not exclude them)
**/

// this is our target point (somewhere in London)
var focus = { lat: 51.5, lon: -0.06 };

var query = require('../index'),
    vs = new query.Vars( query.defaults );

/**
  build a query with 2 conditions:
  - the linguistic matching strategy for scoring (phrase)
  - the geographic decay function (focus)
**/
var q = new query.layout.FilteredBooleanQuery()
  .score( query.view.phrase )
  .score( query.view.focus );

/**
  configure implementation-specific settings:
  - phrase settings
  - focus settings
**/
vs.set({
  'phrase:field': 'phrase.default',
  'phrase:analyzer': 'standard',
  'focus:function': 'gauss',
  'focus:offset': '10km',
  'focus:scale': '100km',
  'focus:decay': 0.4
});

/**
  set the user-specific variables:
  - the input text provided by the user
  - the input point to use for localization
**/
vs.var( 'input:name', 'union square' );
vs.var('focus:point:lat', focus.lat);
vs.var('focus:point:lon', focus.lon);

// render the query
var rendered = q.render( vs );
console.log( JSON.stringify( rendered, null, 2 ) );