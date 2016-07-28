var FallbackQuery = require('../../layout/FallbackQuery');
var VariableStore = require('../../lib/VariableStore');
var diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  test('instance with nothing set should render to base request', function(t) {
    var query = new FallbackQuery();

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
    var query = new FallbackQuery();

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
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'neighbourhood'
                  }
                }
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

  test('VariableStore with query AND street should only add query', function(t) {
    var query = new FallbackQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:query', 'query value');
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
                    multi_match: {
                      query: 'query value',
                      type: 'phrase',
                      fields: ['phrase.default']
                    }
                  },
                  {
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'venue'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    match_phrase: {
                      'address_parts.number': 'house number value'
                    }
                  },
                  {
                    match_phrase: {
                      'address_parts.street': 'street value'
                    }
                  },
                  {
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'address'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'neighbourhood'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'borough'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'locality'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'region'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'country'
                  }
                }
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

  test('VariableStore with number+street and less granular fields should include all others', function(t) {
    var query = new FallbackQuery();

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
                    match_phrase: {
                      'address_parts.number': 'house number value'
                    }
                  },
                  {
                    match_phrase: {
                      'address_parts.street': 'street value'
                    }
                  },
                  {
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'address'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'neighbourhood value',
                      type: 'phrase',
                      fields: ['parent.neighbourhood', 'parent.neighbourhood_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'neighbourhood'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'borough value',
                      type: 'phrase',
                      fields: ['parent.borough', 'parent.borough_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a', 'parent.localadmin', 'parent.localadmin_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'borough'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'locality value',
                      type: 'phrase',
                      fields: ['parent.locality', 'parent.locality_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'locality'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'region value',
                      type: 'phrase',
                      fields: ['parent.region', 'parent.region_a']
                    }
                  },
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'region'
                  }
                }
              }
            },
            {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: 'country value',
                      type: 'phrase',
                      fields: ['parent.country', 'parent.country_a']
                    }
                  }
                ],
                filter: {
                  term: {
                    layer: 'country'
                  }
                }
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
