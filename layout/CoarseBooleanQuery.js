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
            fields: [layer, layer+'_a']
          }
        },
        {
          match_phrase: {
            'name.default': coarse_value
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
  if (vs.isset('input:region_a')) {
    return vs.var('input:region_a').toString();
  }
  return vs.var('input:country_a').toString();
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
