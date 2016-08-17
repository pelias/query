var GeodisambiguationQuery = require('../../layout/GeodisambiguationQuery');
var VariableStore = require('../../lib/VariableStore');
var diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  test('neighbourhood as most granular should only query neighbourhood value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

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

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse neighbourhood value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
        'coarse neighbourhood value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('borough as most granular should only query borough value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:borough', 'coarse borough value');
    vs.var('input:city', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse borough value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
        'coarse borough value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('city as most granular should only query city value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:locality', 'coarse city value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse city value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
        'coarse city value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('county as most granular should only query county value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:county', 'coarse county value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse county value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
        'coarse county value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('region as most granular should only query region value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:region', 'coarse region value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse region value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
        'coarse region value', ['parent.country', 'parent.country_a']));

    t.deepEquals(actual.size.toString(), 'size value');
    t.deepEquals(actual.track_scores.toString(), 'track_scores value');

    t.end();

  });

  test('country as most granular should only query country value across all coarse layers', function(t) {
    var query = new GeodisambiguationQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:country', 'coarse country value');

    var actual = query.render(vs);

    t.equals(actual.query.bool.should.length, 10);
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
    t.deepEquals(actual.query.bool.should[8], individualLayer('dependency',
        'coarse country value', ['parent.dependency', 'parent.dependency_a']));
    t.deepEquals(actual.query.bool.should[9], individualLayer('country',
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
        {
          multi_match: {
            query: value,
            type: 'phrase',
            fields: fields
          }
        }
      ],
      filter: {
        term: {
          layer: layer
        }
      }
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
