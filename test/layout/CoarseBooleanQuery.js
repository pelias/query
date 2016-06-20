var CoarseBooleanQuery = require('../../layout/CoarseBooleanQuery');
var VariableStore = require('../../lib/VariableStore');
var diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  // test('instance with nothing set should render to base request', function(t) {
  //   var query = new CoarseBooleanQuery();
  //
  //   var vs = new VariableStore();
  //   vs.var('size', 'size value');
  //   vs.var('track_scores', 'track_scores value');
  //
  //   var actual = query.render(vs);
  //
  //   var expected = {
  //     query: {
  //       bool: {
  //         should: []
  //       }
  //     },
  //     size: { $: 'size value' },
  //     track_scores: { $: 'track_scores value' }
  //   };
  //
  //   t.deepEquals(actual, expected);
  //   t.end();
  //
  // });

  test('VariableStore with neighbourhood-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:neighbourhood', 'coarse neighbourhood value');
    vs.var('input:borough', 'coarse borough value');
    vs.var('input:city', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:state', 'coarse state value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse neighbourhood value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse neighbourhood value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse neighbourhood value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse neighbourhood value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse neighbourhood value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse neighbourhood value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse neighbourhood value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse neighbourhood value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse neighbourhood value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with borough-only should only include borough parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:borough', 'coarse borough value');
    vs.var('input:city', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:state', 'coarse state value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse borough value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse borough value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse borough value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse borough value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse borough value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse borough value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse borough value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse borough value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse borough value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with locality-only should only include city parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:locality', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:state', 'coarse state value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse city value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse city value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse city value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse city value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse city value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse city value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse city value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse city value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse city value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with county-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:state', 'coarse state value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse county value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse county value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse county value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse county value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse county value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse county value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse county value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse county value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse county value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with region-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:region_a', 'coarse state value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse state value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse state value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse state value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse state value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse state value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse state value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse state value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse state value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse state value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with country-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:country_a', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse country value', ['neighbourhood', 'neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse country value', ['borough', 'borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse country value', ['locality', 'locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse country value', ['localadmin', 'localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse country value', ['county', 'county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse country value', ['macrocounty', 'macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse country value', ['region', 'region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse country value', ['macroregion', 'macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse country value', ['country', 'country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

};

function individualLayer(layer, value, fields) {
  return {
    bool: {
      must: [
        { term: { layer: layer } },
        { multi_match: { query: value, fields: fields }},
        { match_phrase: { 'phrase.default': value } }
      ]
    }
  };

}

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('address ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
