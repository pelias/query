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
          term: { layer: layer }
        },
        {
          multi_match: {
            query: coarse_value,
            fields: ['parent.' + layer, 'parent.' + layer + '_a']
          }
        }
      ]
    }
  };

  return o;

}

function getCoarseValue(vs) {
  if (vs.isset('input:neighbourhood')) {
    return vs.var('input:neighbourhood').toString();
  }
  if (vs.isset('input:borough')) {
    return vs.var('input:borough').toString();
  }
  if (vs.isset('input:locality')) {
    return vs.var('input:locality').toString();
  }
  if (vs.isset('input:county')) {
    return vs.var('input:county').toString();
  }
  if (vs.isset('input:region')) {
    return vs.var('input:region').toString();
  }
  return vs.var('input:country').toString();
}

Layout.prototype.render = function( vs ){
  var q = Layout.base( vs );

  var coarse_value = getCoarseValue(vs);

  q.query.bool.should.push(addCoarseLayer('neighbourhood', coarse_value));
  q.query.bool.should.push(addCoarseLayer('borough', coarse_value));
  q.query.bool.should.push(addCoarseLayer('locality', coarse_value));
  q.query.bool.should.push(addCoarseLayer('localadmin', coarse_value));
  q.query.bool.should.push(addCoarseLayer('county', coarse_value));
  q.query.bool.should.push(addCoarseLayer('macrocounty', coarse_value));
  q.query.bool.should.push(addCoarseLayer('region', coarse_value));
  q.query.bool.should.push(addCoarseLayer('macroregion', coarse_value));
  q.query.bool.should.push(addCoarseLayer('country', coarse_value));

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
