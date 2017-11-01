'use strict';

const _ = require('lodash');
const Query = require('./Query');

class VenuesQuery extends Query {
  constructor() {
    super();
  }

  render(vs) {
    // establish a base query with 'name' must condition and size/track_scores
    const base = {
      query: {
        function_score: {
          query: {
            bool: {
              must: [
                {
                  match_phrase: {
                    'name.default': {
                      query: vs.var('input:query'),
                      analyzer: 'standard'
                    }
                  }
                }
              ],
              filter: {
                bool: {
                  must: [
                    {
                      term: {
                        layer: 'venue'
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      size: vs.var('size'),
      track_scores: vs.var('track_scores')
    };

    // add any scores (_.compact removes falsey values from arrays)
    if (!_.isEmpty(this._score)) {
      base.query.function_score.functions = _.compact(this._score.map(view => view(vs)));
    }

    // add any filters
    if (!_.isEmpty(this._filter)) {
      // add filter.bool.must, creating intermediate objects if they don't exist
      //  using _.set does away with the need to check for object existence
      // _.compact removes falsey values from arrays
      base.query.function_score.query.bool.filter.bool.must = _.concat(
        base.query.function_score.query.bool.filter.bool.must,
        _.compact(this._filter.map(view => view(vs))));

    }

    return base;
  }

}

module.exports = VenuesQuery;
