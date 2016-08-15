// This query is useful for querying a value across a number of different
// layers when the analysis engine returns exactly 1 thing.
//
// For example, libpostal identifies "Luxembourg" to be a country whereas anyone
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

function Layout(){
  this._score = [];
}

Layout.prototype.score = function( view, operator ){
  this._score.push([ view, operator === 'must' ? 'must': 'should' ]);
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

  var coarse_value = getCoarseValue(vs);

  // add coarse `should` query for each potential layer
  q.query.bool.should.push(addCoarseLayer('neighbourhood', coarse_value));
  q.query.bool.should.push(addCoarseLayer('borough', coarse_value));
  q.query.bool.should.push(addCoarseLayer('locality', coarse_value));
  q.query.bool.should.push(addCoarseLayer('localadmin', coarse_value));
  q.query.bool.should.push(addCoarseLayer('county', coarse_value));
  q.query.bool.should.push(addCoarseLayer('macrocounty', coarse_value));
  q.query.bool.should.push(addCoarseLayer('region', coarse_value));
  q.query.bool.should.push(addCoarseLayer('macroregion', coarse_value));
  q.query.bool.should.push(addCoarseLayer('dependency', coarse_value));
  q.query.bool.should.push(addCoarseLayer('country', coarse_value));

  // handle scoring views under 'query' section (both 'must' & 'should')
  if( this._score.length ){
    this._score.forEach( function( condition ){
      var view = condition[0], operator = condition[1];
      var rendered = view( vs );
      if( rendered ){
        if( !q.query.bool.hasOwnProperty( operator ) ){
          q.query.bool[ operator ] = [];
        }
        q.query.bool[ operator ].push( rendered );
      }
    });
  }

  return q;
};

Layout.base = function( vs ){
  return {
    query: {
      bool: {
        should: []
      }
    },
    size: vs.var('size'),
    track_scores: vs.var('track_scores'),
  };
};

module.exports = Layout;
