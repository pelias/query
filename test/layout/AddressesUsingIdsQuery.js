const AddressesUsingIdsQuery = require('../../layout/AddressesUsingIdsQuery');
const VariableStore = require('../../lib/VariableStore');
const bboxDefaults = {
  'admin:macrocounty:bbox_enabled': true,
  'admin:macrocounty:bbox_scale': 1.5,
  'admin:county:bbox_enabled': true,
  'admin:county:bbox_scale': 1.5,
  'admin:localadmin:bbox_enabled': true,
  'admin:localadmin:bbox_scale': 1.5,
  'admin:locality:bbox_enabled': true,
  'admin:locality:bbox_scale': 1.5,
  'admin:neighbourhood:bbox_enabled': true,
  'admin:neighbourhood:bbox_scale': 1.5,
};

module.exports.tests = {};

module.exports.tests.base_render = (test, common) => {
  test('VariableStore without admins should not add any shoulds', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:postcode', 'postcode value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/no_layers.json');

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('defined address and street boosts should be set in query', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('boost:address', 17);
    vs.var('boost:street', 19);

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/no_layers_with_boosts.json');

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('street slop should be set in query', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('address:street:slop', 3);

    const actual = JSON.parse(JSON.stringify(query.render(vs)));

    const expected_query_clause = {
      match_phrase: {
        'address_parts.street': {
          query: 'street value',
          slop: 3
        }
      }
    };

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // use this object as a starting point for finding all the individual street queries to check
    const bool_query = actual.query.function_score.query.bool;

    const street_fallback_query_clause = bool_query.should[0].bool.must[0];
    const address_fallback_query_clause = bool_query.should[1].bool.must[2];

    t.deepEquals(street_fallback_query_clause, expected_query_clause);
    t.deepEquals(address_fallback_query_clause, expected_query_clause);
    t.end();

  });

  test('VariableStore without housenumber should not add must for address', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/no_housenumber.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('VariableStore with admins should only use non-empty id arrays', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('input:layers', {
      layer1: [1, 2, 3],
      layer2: [],
      layer3: undefined,
      layer4: [4]
    });

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/with_layers.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('VariableStore with housenumber and no unit should not query on unit, only housenumbers', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/housenumber_no_units.json');

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });
  test('VariableStore with unit and no housenumber should neither query on the unit nor the housenumber, only the street', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/unit_no_housenumber.json');

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('VariableStore with housenumber and no postcode should not query on postcode, only housenumbers', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/housenumber_no_units.json');

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });
  test('VariableStore with postcode and no housenumber should neither query on the postcode nor the housenumber, only the street', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:postcode', 'postcode value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/unit_no_housenumber.json');

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });
};

module.exports.tests.render_with_scores = (test, common) => {
  test('all scores should be added as functions', (t) => {
    // ensures that score functions are called
    t.plan(4);

    const query = new AddressesUsingIdsQuery();
    query.score((vs) => {
      t.pass('score was called');
      return { 'score field 1': 'score value 1' };
    });
    query.score((vs) => {
      t.pass('score was called');
      return false;
    });
    query.score((vs) => {
      t.pass('score was called');
      return { 'score field 2': 'score value 2' };
    });

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/with_scores.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

};

module.exports.tests.render_with_filters = (test, common) => {
  test('all filters should be added as musts', (t) => {
    // ensures that filter functions are called
    t.plan(4);

    const query = new AddressesUsingIdsQuery();
    query.filter((vs) => {
      t.pass('filter was called');
      return { 'filter field 1': 'filter value 1' };
    });
    query.filter((vs) => {
      t.pass('filter was called');
      return false;
    });
    query.filter((vs) => {
      t.pass('filter was called');
      return { 'filter field 2': 'filter value 2' };
    });

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/with_filters.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('non-id filters should be added alongside id filters', (t) => {
    // ensures that filter functions are called
    t.plan(2);

    const query = new AddressesUsingIdsQuery();
    query.filter((vs) => {
      t.pass('filter was called');
      return { 'filter field 1': 'filter value 1' };
    });

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('input:layers', {
      layer1: [1, 2, 3],
    });

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/with_layers_and_filters.json');

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

  test('VariableStore with admins and bboxes should generate queries with both, ignoring point queries, ignoring country', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore(bboxDefaults);
    vs.var('size', 'size value');
    vs.var('centroid:field', 'center_point');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('input:layers:ids', {
      locality: [1, 2, 3],
      country: [],
      neighbourhood: undefined,
      region: [4]
    });

    vs.var('input:layers:bounding_boxes', {
      locality: [{
        min_lon: 1,
        min_lat: 2,
        max_lon: 3,
        max_lat: 4,
      }, {
        min_lon: 1,
        min_lat: 2,
        max_lon: 1,
        max_lat: 2,
      }],
      country: [{
        min_lon: 5,
        min_lat: 6,
        max_lon: 7,
        max_lat: 8,
      }],
      neighbourhood: [],
      localadmin: undefined,
      region: [4]
    });

    const actual = query.render(vs);
    const expected = require('../fixtures/addressesUsingIdsQuery/with_layers_and_bboxes.json');

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();
  });

  test('VariableStore should scale bboxes if scaling factor is set', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore(bboxDefaults);
    vs.var('size', 'size value');
    vs.var('admin:locality:bbox_scale', 2);
    vs.var('centroid:field', 'center_point');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('input:layers:ids', {
      locality: [1, 2, 3],
      county: [],
      country: undefined,
      region: [4]
    });

    vs.var('input:layers:bounding_boxes', {
      locality: [{
        min_lon: 1,
        min_lat: 2,
        max_lon: 3,
        max_lat: 4,
      }, {
        min_lon: 1,
        min_lat: 2,
        max_lon: 1,
        max_lat: 2,
      }],
      country: [],
      neighbourhood: undefined,
      region: [4]
    });

    const actual = query.render(vs);

    const expected = require('../fixtures/addressesUsingIdsQuery/with_layers_and_bboxes_scaled.json');
    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    function approxeq(v1, v2, epsilon) {
      return Math.abs(v1 - v2) < epsilon;
    }

    const scaled_bbox = actual.query.function_score.query.bool.filter.bool.should[0].bool.should[0].geo_bounding_box.center_point;

    // Scaling is a messy float operation, so use approx matchers to make sure we scaled appropriately
    //"geo_bounding_box":{"center_point":{"top":5.000000000000001,"right":4.001221291680963,"bottom":0.999999999999999,"left":-0.001221291680963077}}
    t.ok(approxeq(scaled_bbox.top, 5, 0.01));
    t.ok(approxeq(scaled_bbox.right, 4, 0.01));
    t.ok(approxeq(scaled_bbox.bottom, 1, 0.01));
    t.ok(approxeq(scaled_bbox.left, 0, 0.01));

    // And also delete the field from both exepected and actual so we're not doing deepEquality on floats
    delete actual.query.function_score.query.bool.filter.bool.should[0].bool.should[0].geo_bounding_box.center_point;
    delete expected.query.function_score.query.bool.filter.bool.should[0].bool.should[0].geo_bounding_box.center_point;

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();
  });

};

module.exports.all = (tape, common) => {
  function test(name, testFunction) {
    return tape(`AddressesUsingIdsQuery ${name}`, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
