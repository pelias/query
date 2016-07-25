var CoarseBooleanQuery = require('../../layout/GeodisambiguationQuery');
var VariableStore = require('../../lib/VariableStore');
var diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  test('VariableStore with neighbourhood-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:neighbourhood', 'coarse neighbourhood value');
    vs.var('input:borough', 'coarse borough value');
    vs.var('input:city', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse neighbourhood value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse neighbourhood value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse neighbourhood value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse neighbourhood value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse neighbourhood value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse neighbourhood value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse neighbourhood value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse neighbourhood value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse neighbourhood value', ['parent.country', 'parent.country_a']));

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
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse borough value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse borough value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse borough value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse borough value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse borough value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse borough value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse borough value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse borough value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse borough value', ['parent.country', 'parent.country_a']));

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
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse city value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse city value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse city value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse city value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse city value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse city value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse city value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse city value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse city value', ['parent.country', 'parent.country_a']));

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
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse county value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse county value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse county value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse county value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse county value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse county value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse county value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse county value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse county value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with region-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse region value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse region value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse region value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse region value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse region value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse region value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse region value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse region value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse region value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('VariableStore with country-only should only include neighbourhood parts and no fallbacks', function(t) {
    var query = new CoarseBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 9);
    t.deepEquals(actual.query.bool.should[0], individualLayer('neighbourhood',
        'coarse country value', ['parent.neighbourhood', 'parent.neighbourhood_a']));
    t.deepEquals(actual.query.bool.should[1], individualLayer('borough',
        'coarse country value', ['parent.borough', 'parent.borough_a']));
    t.deepEquals(actual.query.bool.should[2], individualLayer('locality',
        'coarse country value', ['parent.locality', 'parent.locality_a']));
    t.deepEquals(actual.query.bool.should[3], individualLayer('localadmin',
        'coarse country value', ['parent.localadmin', 'parent.localadmin_a']));
    t.deepEquals(actual.query.bool.should[4], individualLayer('county',
        'coarse country value', ['parent.county', 'parent.county_a']));
    t.deepEquals(actual.query.bool.should[5], individualLayer('macrocounty',
        'coarse country value', ['parent.macrocounty', 'parent.macrocounty_a']));
    t.deepEquals(actual.query.bool.should[6], individualLayer('region',
        'coarse country value', ['parent.region', 'parent.region_a']));
    t.deepEquals(actual.query.bool.should[7], individualLayer('macroregion',
        'coarse country value', ['parent.macroregion', 'parent.macroregion_a']));
    t.deepEquals(actual.query.bool.should[8], individualLayer('country',
        'coarse country value', ['parent.country', 'parent.country_a']));

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
        { multi_match: { query: value, fields: fields }}
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
