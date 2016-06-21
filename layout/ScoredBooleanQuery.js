function Layout(){
  this._score = [];
}

Layout.prototype.score = function( view, operator ){
  this._score.push([ view, operator === 'must' ? 'must': 'should' ]);
  return this;
};

function addPrimary(value, layer, fields) {
  return {
    bool: {
      must: [
        {
          term: { layer: layer }
        },
        {
          match_phrase: {
            'phrase.default': value
          }
        },
        {
          multi_match: {
            'query': value,
            'fields': fields
          }
        }
      ]
    }
  };

}

function addMultiMatch(value, fields) {
  return {
      multi_match: {
        'query': value,
        'fields': fields
      }
  };

}

function addNeighbourhood(vs) {
  var o = addPrimary(vs.var('input:neighbourhood').toString(),
            'neighbourhood', ['neighbourhood', 'neighbourhood_a']);

  if (vs.isset('input:borough')) {
    o.bool.must.push(addMultiMatch(vs.var('input:borough').toString(), ['borough', 'borough_a']));
  }

  if (vs.isset('input:locality')) {
    o.bool.must.push(addMultiMatch(vs.var('input:locality').toString(), ['locality', 'locality_a', 'localadmin', 'localadmin_a']));
  }

  if (vs.isset('input:region')) {
    o.bool.must.push(addMultiMatch(vs.var('input:region').toString(), ['region', 'region_a']));
  }

  if (vs.isset('input:country')) {
    o.bool.must.push(addMultiMatch(vs.var('input:country').toString(), ['country', 'country_a']));
  }

  return o;

}

function addBorough(vs) {
  var o = addPrimary(vs.var('input:borough').toString(),
            'borough', ['borough', 'borough_a']);

  if (vs.isset('input:locality')) {
    o.bool.must.push(addMultiMatch(vs.var('input:locality').toString(), ['locality', 'locality_a', 'localadmin', 'localadmin_a']));
  }

  if (vs.isset('input:region')) {
    o.bool.must.push(addMultiMatch(vs.var('input:region').toString(), ['region', 'region_a']));
  }

  if (vs.isset('input:country')) {
    o.bool.must.push(addMultiMatch(vs.var('input:country').toString(), ['country', 'country_a']));
  }

  return o;

}

function addLocality(vs) {
  var o = addPrimary(vs.var('input:locality').toString(),
            'locality', ['locality', 'locality_a']);

  if (vs.isset('input:region')) {
    o.bool.must.push(addMultiMatch(vs.var('input:region').toString(), ['region', 'region_a']));
  }

  if (vs.isset('input:country')) {
    o.bool.must.push(addMultiMatch(vs.var('input:country').toString(), ['country', 'country_a']));
  }

  return o;

}

function addRegion(vs) {
  var o = addPrimary(vs.var('input:region').toString(),
            'region', ['region', 'region_a']);

  if (vs.isset('input:country')) {
    o.bool.must.push(addMultiMatch(vs.var('input:country').toString(), ['country', 'country_a']));
  }

  return o;

}

function addCountry(vs) {
  var o = addPrimary(vs.var('input:country').toString(),
            'country', ['country', 'country_a']);

  return o;

}

Layout.prototype.render = function( vs ){
  var q = Layout.base( vs );

  // if (vs.isset('input:housenumber') && vs.isset('input:street')) {
  //   var o = {
  //     bool: {
  //       must: [
  //         {
  //           term: { layer: 'address' }
  //         },
  //         {
  //           match_phrase: {
  //             street: vs.var('input:street').toString()
  //           }
  //         },
  //         {
  //           match_phrase: {
  //             housenumber: vs.var('input:housenumber').toString()
  //           }
  //         },
  //         // {
  //         //   match_phrase: {
  //         //     'name.default': vs.var('input:housenumber').toString() + ' ' + vs.var('input:street').toString()
  //         //   }
  //         // }
  //
  //       ]
  //     }
  //   };
  //
  //   q.query.bool.should.push(o);
  //
  // }
  if (vs.isset('input:neighbourhood')) {
    q.query.bool.should.push(addNeighbourhood(vs));
  }
  if (vs.isset('input:borough')) {
    q.query.bool.should.push(addBorough(vs));
  }
  if (vs.isset('input:locality')) {
    q.query.bool.should.push(addLocality(vs));
  }
  if (vs.isset('input:region')) {
    q.query.bool.should.push(addRegion(vs));
  }
  if (vs.isset('input:country')) {
    q.query.bool.should.push(addCountry(vs));
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
