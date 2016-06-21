var ScoredBooleanQuery = require('../../layout/ScoredBooleanQuery');
var VariableStore = require('../../lib/VariableStore');
var diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  test('instance with nothing set should render to base request', function(t) {
    var query = new ScoredBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: []
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' }
    };

    t.deepEquals(actual, expected);
    t.end();

  });

  test('VariableStore with neighbourhood-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new ScoredBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:neighbourhood', 'neighbourhood value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: [
            {
              bool: {
                must: [
                  {
                    term: { layer: 'neighbourhood' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'neighbourhood value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'neighbourhood value',
                      'fields': ['neighbourhood', 'neighbourhood_a']
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' }
    };

    t.deepEquals(actual, expected);
    t.end();

  });

  test('VariableStore with neighbourhood and other fields should include all others', function(t) {
    var query = new ScoredBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'house number value');
    vs.var('input:street', 'street value');
    vs.var('input:neighbourhood', 'neighbourhood value');
    vs.var('input:borough', 'borough value');
    vs.var('input:locality', 'locality value');
    vs.var('input:region', 'region value');
    vs.var('input:country', 'country value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: [
            {
              bool: {
                must: [
                  {
                    term: { layer: 'neighbourhood' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'neighbourhood value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'neighbourhood value',
                      'fields': ['neighbourhood', 'neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'borough value',
                      'fields': ['borough', 'borough_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'locality value',
                      'fields': ['locality', 'locality_a', 'localadmin', 'localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'region value',
                      'fields': ['region', 'region_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'country value',
                      'fields': ['country', 'country_a']
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    term: { layer: 'borough' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'borough value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'borough value',
                      'fields': ['borough', 'borough_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'locality value',
                      'fields': ['locality', 'locality_a', 'localadmin', 'localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'region value',
                      'fields': ['region', 'region_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'country value',
                      'fields': ['country', 'country_a']
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    term: { layer: 'locality' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'locality value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'locality value',
                      'fields': ['locality', 'locality_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'region value',
                      'fields': ['region', 'region_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'country value',
                      'fields': ['country', 'country_a']
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    term: { layer: 'region' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'region value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'region value',
                      'fields': ['region', 'region_a']
                    }
                  },
                  {
                    multi_match: {
                      'query': 'country value',
                      'fields': ['country', 'country_a']
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    term: { layer: 'country' }
                  },
                  {
                    match_phrase: {
                      'phrase.default': 'country value'
                    }
                  },
                  {
                    multi_match: {
                      'query': 'country value',
                      'fields': ['country', 'country_a']
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' }
    };

    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('address ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
