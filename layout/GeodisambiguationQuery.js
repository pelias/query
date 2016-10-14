// This query is useful for querying a value across a number of different
// layers when the analysis engine returns exactly 1 thing.
//
// For example, libpostal identifies 'Luxembourg' to be a country whereas anyone
// who's aware of the technical debt in Europe knows that there is a place named
// Luxembourg is legitimately all of the following:
//
// - a country
// - a region in the country of Luxembourg
// - a locality in the region of Luxembourg in the country of Luxembourg
// - a region in the country of Belgium
//
// For another example, Lancaster is all of the following:
// - a city in Pennsylvania
// - a county in Pennsylvania
// - a city in Great Britain
// - a city in California
// - a city in Ohio
// - (many other cities)
//
// Yet one more example, Ontario is all of the following:
// - a province in Canada
// - a city in California
// - a city in Oregon
// - (many other cities)
//
// This Query module searches a value across all supported coarse layers:
// - neighbourhood
// - borough
// - locality
// - localadmin
// - county
// - macrocounty
// - region
// - macroregion
// - country
//

var _ = require('lodash');
var baseQuery = require('./baseQuery');

function Layout(){
  this._score = [];
  this._filter = [];
}

Layout.prototype.score = function( view ){
  this._score.push( view );
  return this;
};

Layout.prototype.filter = function( view ){
  this._filter.push( view );
  return this;
};

function addCoarseLayer(layer, coarse_value, fields) {
  var o = {
    bool: {
      must: [
        {
          multi_match: {
            query: coarse_value,
            type: 'phrase',
            fields: ['parent.' + layer, 'parent.' + layer + '_a']
          }
        }
      ],
      filter: {
        term: {
          layer: layer
        }
      }
    }
  };

  return o;

}

// helper method that which field to use based on availability
// use the most granular field that has a value
function getCoarseValue(vs) {
  var primacy = ['neighbourhood', 'borough', 'locality', 'county', 'region', 'country'];

  var mostGranularField = _.find(primacy, function(field) {
    return vs.isset('input:' + field);
  }) || 'country';

  return vs.var('input:' + mostGranularField).toString();

}

Layout.prototype.render = function( vs ){
  var q = Layout.base( vs );
  var funcScoreShould = q.query.function_score.query.filtered.query.bool.should;

  var coarse_value = getCoarseValue(vs);

  // add coarse `should` query for each potential layer
  funcScoreShould.push(addCoarseLayer('neighbourhood', coarse_value));
  funcScoreShould.push(addCoarseLayer('borough', coarse_value));
  funcScoreShould.push(addCoarseLayer('locality', coarse_value));
  funcScoreShould.push(addCoarseLayer('localadmin', coarse_value));
  funcScoreShould.push(addCoarseLayer('county', coarse_value));
  funcScoreShould.push(addCoarseLayer('macrocounty', coarse_value));
  funcScoreShould.push(addCoarseLayer('region', coarse_value));
  funcScoreShould.push(addCoarseLayer('macroregion', coarse_value));
  funcScoreShould.push(addCoarseLayer('dependency', coarse_value));
  funcScoreShould.push(addCoarseLayer('country', coarse_value));

  // handle scoring views under 'query' section (both 'must' & 'should')
  if( this._score.length ){
    this._score.forEach( function( view ){
      var rendered = view( vs );
      if( rendered ){
        q.query.function_score.functions.push( rendered );
      }
    });
  }

  // handle filter views under 'filter' section (only 'must' is allowed here)
  if( this._filter.length ){
    this._filter.forEach( function( view ){
      var rendered = view( vs );
      if( rendered ){
        q.query.function_score.query.filtered.filter.bool.must.push( rendered );
      }
    });
  }

  return q;
};

Layout.base = function( vs ){
  var baseQueryCopy = _.cloneDeep(baseQuery);

  baseQueryCopy.size = vs.var('size');
  baseQueryCopy.track_scores = vs.var('track_scores');

  return baseQueryCopy;
};

module.exports = Layout;
