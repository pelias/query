const AddressesUsingIdsQuery = require('../../layout/AddressesUsingIdsQuery');
const VariableStore = require('../../lib/VariableStore');
const diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = (test, common) => {
  test('VariableStore without admins should not add any shoulds', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:unit', 'unit value');
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

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

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

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

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
