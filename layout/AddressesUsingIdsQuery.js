const _ = require('lodash');

function getBaseQuery(housenumber, street) {
  return {
    query: {
      function_score: {
        query: {
          filtered: {
            query: {
              bool: {
                _name: 'fallback.address',
                must: [
                  {
                    match_phrase: {
                      'address_parts.number': housenumber.toString()
                    }
                  },
                  {
                    match_phrase: {
                      'address_parts.street': street.toString()
                    }
                  }
                ],
                boost: 10
              }
            },
            filter: {
              bool: { }
            }
          }
        },
        functions: []
      }
    }
  };

}

function createShould(layer, ids) {
  const should = {
    terms: {}
  };

  should.terms[`parent.${layer}_id`] = ids;

  return should;

}

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

Layout.prototype.render = function( vs ){
  const q = getBaseQuery(vs.var('input:housenumber'), vs.var('input:street'));
  q.size = vs.var('size');
  q.track_scores = vs.var('track_scores');

  // if there are layer->id mappings, add the layers with non-empty ids
  if (vs.isset('input:layers')) {
    const layers_to_ids = JSON.parse(vs.var('input:layers'));

    const shoulds = _.keys(layers_to_ids).reduce((acc, layer) => {
      if (!_.isEmpty(layers_to_ids[layer])) {
        acc.push(createShould(layer, layers_to_ids[layer]));
      }
      return acc;
    }, []);

    q.query.function_score.query.filtered.filter.bool.should = shoulds;

  }

  // add all scores
  q.query.function_score.functions = _.compact(
    this._score.map((view) => {
      return view(vs);
    }
  ));

  // add all filters
  q.query.function_score.query.filtered.filter.bool.must = _.compact(
    this._filter.map((view) => {
      return view(vs);
    }
  ));

  q.query.function_score.query.filtered.filter.bool.must.push({
    term: {
      layer: 'address'
    }
  });

  return q;
};

module.exports = Layout;
