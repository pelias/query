const VenuesQuery = require('../../layout/VenuesQuery');
const VariableStore = require('../../lib/VariableStore');
const diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = (test, common) => {
  test('VariableStore without admins should not add any shoulds', t => {
    const query = new VenuesQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:query', 'query value');

    const actual = query.render(vs);
    const expected = require('../fixtures/venuesQuery/base_render.json');

    // console.error(JSON.stringify(actual, null, 2));
    // console.error(JSON.stringify(expected, null, 2));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

};

module.exports.tests.render_with_scores = (test, common) => {
  test('all scores should be added as functions', t => {
    // ensures that score functions are called
    t.plan(4);

    const query = new VenuesQuery();
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
    vs.var('input:query', 'query value');

    const actual = query.render(vs);
    const expected = require('../fixtures/venuesQuery/with_scores.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

};

module.exports.tests.render_with_filters = (test, common) => {
  test('all filters should be added as musts', t => {
    // ensures that filter functions are called
    t.plan(4);

    const query = new VenuesQuery();
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
    vs.var('input:query', 'query value');

    const actual = query.render(vs);
    const expected = require('../fixtures/venuesQuery/with_filters.json');

    // console.error(`actual:   ${JSON.stringify(actual)}`);
    // console.error(`expected: ${JSON.stringify(expected)}`);

    // marshall/unmarshall to handle toString's internally
    t.deepEquals(JSON.parse(JSON.stringify(actual)), expected);
    t.end();

  });

};

module.exports.all = (tape, common) => {
  function test(name, testFunction) {
    return tape(`VenuesQuery ${name}`, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
