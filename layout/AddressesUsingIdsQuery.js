'use strict';

const _ = require('lodash');
const Query = require('./Query');

const baseQuery = {
  query: {
    function_score: {
      query: {
        bool: {
          minimum_number_should_match: 1,
          should: [],
          filter: {
            bool: {
              minimum_number_should_match: 1
            }
          }
        }
      },
      functions: []
    }
  }
};

function createShould(layer, ids) {
  // create an object initialize with terms.'parent.locality_id' (or whatever)
  return _.set({}, ['terms', `parent.${layer}_id`], ids);
}

function createAddressShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.address',
      must: [
        {
          match_phrase: {
            'address_parts.number': vs.var('input:housenumber')
          }
        },
        {
          match_phrase: {
            'address_parts.street': vs.var('input:street')
          }
        }
      ],
      filter: {
        term: {
          layer: 'address'
        }
      }
    }
  };

  if (vs.isset('boost:address')) {
    should.bool.boost = vs.var('boost:address');
  }

  return should;

}

function createStreetShould(vs) {
  const should = {
    bool: {
      _name: 'fallback.street',
      must: [
        {
          match_phrase: {
            'address_parts.street': vs.var('input:street')
          }
        }
      ],
      filter: {
        term: {
          layer: 'street'
        }
      }
    }
  };

  if (vs.isset('boost:street')) {
    should.bool.boost = vs.var('boost:street');
  }

  return should;

}

class AddressesUsingIdsQuery extends Query {
  constructor() {
    super();
  }

  render(vs) {
    const q = _.cloneDeep(baseQuery);

    // add housenumber/street if both are available
    if (vs.isset('input:housenumber')) {
      q.query.function_score.query.bool.should.push(
        createAddressShould(vs));
    }

    // always add street (otherwise this wouldn't be happening)
    q.query.function_score.query.bool.should.push(
      createStreetShould(vs));

    q.size = vs.var('size');
    q.track_scores = vs.var('track_scores');

    // if there are layer->id mappings, add the layers with non-empty ids
    if (vs.isset('input:layers')) {
      const layers_to_ids = JSON.parse(vs.var('input:layers'));

      const id_filters = _.keys(layers_to_ids).reduce((acc, layer) => {
        if (!_.isEmpty(layers_to_ids[layer])) {
          acc.push(createShould(layer, layers_to_ids[layer]));
        }
        return acc;
      }, []);

      q.query.function_score.query.bool.filter.bool.should = id_filters;

    }

    // add all scores
    q.query.function_score.functions =
      _.compact(this._score.map(view => view(vs)));

    // add all filters
    q.query.function_score.query.bool.filter.bool.must =
      _.compact(this._filter.map(view => view(vs)));

    return q;
  }

}

module.exports = AddressesUsingIdsQuery;
