var FilteredBooleanQuery = require('../../layout/FilteredBooleanQuery');
var VariableStore = require('../../lib/VariableStore');

module.exports.tests = {};

module.exports.tests.base_render = function(test, common) {
  test('instance with nothing set should render to base request', function(t) {
    var query = new FilteredBooleanQuery();

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {}
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.tests.scores = function(test, common) {
  test('score with operator specified should be honored and in order', function(t) {
    var score_view1 = function(vs) {
      console.assert(vs !== null);
      return { 'score field 1': 'score value 1' };
    };

    var score_view2 = function(vs) {
      console.assert(vs !== null);
      return { 'score field 2': 'score value 2' };
    };

    var score_view3 = function(vs) {
      console.assert(vs !== null);
      return { 'score field 3': 'score value 3' };
    };

    var score_view4 = function(vs) {
      console.assert(vs !== null);
      return { 'score field 4': 'score value 4' };
    };

    var query = new FilteredBooleanQuery();
    query.score(score_view1, 'must');
    query.score(score_view2, 'should');
    query.score(score_view3, 'must');
    query.score(score_view4, 'should');

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          must: [
            { 'score field 1': 'score value 1'},
            { 'score field 3': 'score value 3'}
          ],
          should: [
            { 'score field 2': 'score value 2'},
            { 'score field 4': 'score value 4'}
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.deepEquals(actual, expected);
    t.end();

  });

  test('score without operator specified should be added as \'should\'', function(t) {
    var score_view = function(vs) {
      console.assert(vs !== null);
      return { 'score field': 'score value' };
    };

    var query = new FilteredBooleanQuery();
    query.score(score_view);

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: [
            { 'score field': 'score value'}
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.deepEquals(actual, expected);
    t.end();

  });

  test('score with non-must or -should operator specified should be added as \'should\'', function(t) {
    var score_view = function(vs) {
      console.assert(vs !== null);
      return { 'score field': 'score value' };
    };

    var query = new FilteredBooleanQuery();
    query.score(score_view, 'non must or should value');

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: [
            { 'score field': 'score value'}
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.deepEquals(actual, expected);
    t.end();

  });

  test('scores rendering to falsy values should not be added', function(t) {
    var score_views_called = 0;

    var query = new FilteredBooleanQuery();

    [
      { 'score field 1': 'score value 1' },
      false, '', 0, null, undefined, NaN,
      { 'score field 2': 'score value 2' },
    ].forEach(function(value) {
      query.score(function(vs) {
        // assert that `vs` was actually passed
        console.assert(vs !== null);
        // make a note that the view was actually called
        score_views_called++;
        return value;
      });
    });

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          should: [
            { 'score field 1': 'score value 1'},
            { 'score field 2': 'score value 2'}
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.equals(score_views_called, 8);
    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.tests.filter = function(test, common) {
  test('all filter views returning truthy values should be added in order to sort', function(t) {
    // the views assert that the VariableStore was passed, otherwise there's no
    // guarantee that it was actually passed
    var filter_views_called = 0;

    var query = new FilteredBooleanQuery();

    [
      { 'filter field 1': 'filter value 1' },
      false, '', 0, null, undefined, NaN,
      { 'filter field 2': 'filter value 2' },
    ].forEach(function(value) {
      query.filter(function(vs) {
        // assert that `vs` was actually passed
        console.assert(vs !== null);
        // make a note that the view was actually called
        filter_views_called++;
        return value;
      });
    });

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {
          filter: [
            { 'filter field 1': 'filter value 1'},
            { 'filter field 2': 'filter value 2'}
          ]
        }
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: ['_score']
    };

    t.equals(filter_views_called, 8);
    t.deepEquals(actual, expected);
    t.end();

  });
};

module.exports.tests.sort = function(test, common) {
  test('all sort views returning truthy values should be added in order to sort', function(t) {
    // the views assert that the VariableStore was passed, otherwise there's no
    // guarantee that it was actually passed
    var sort_views_called = 0;

    var query = new FilteredBooleanQuery();

    [
      { 'sort field 1': 'sort value 1' },
      false, '', 0, null, undefined, NaN,
      { 'sort field 2': 'sort value 2' },
    ].forEach(function(value) {
      query.sort(function(vs) {
        // assert that `vs` was actually passed
        console.assert(vs !== null);
        // make a note that the view was actually called
        sort_views_called++;
        return value;
      });
    });

    var vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');

    var actual = query.render(vs);

    var expected = {
      query: {
        bool: {}
      },
      size: { $: 'size value' },
      track_scores: { $: 'track_scores value' },
      sort: [
        '_score',
        { 'sort field 1': 'sort value 1'},
        { 'sort field 2': 'sort value 2'}
      ]
    };

    t.equals(sort_views_called, 8);
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
