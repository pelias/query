const match_phrase = require('../../../lib/leaf/match_phrase');
const Variable = require('../../../lib/Variable');

module.exports.tests = {};

module.exports.tests.match_phrase = function(test, common) {
  test('null returned if property missing', function(t) {
    const query = match_phrase();

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if value missing', function(t) {
    const query = match_phrase('theproperty');

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('match_phrase query returned with property and value', function(t) {
    const query = match_phrase('theproperty', 'thevalue');

    const expected = {
      match_phrase: {
        theproperty: {
          query: 'thevalue'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query');
    t.end();
  });

  test('match_phrase query can handle optional boost parameter', function(t) {
    const query = match_phrase('property', 'value', { boost: 5});

    const expected = {
      match_phrase: {
        property: {
          query: 'value',
          boost: 5
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query with boost');
    t.end();
  });

  test('match_phrase query can handle optional slop parameter', function(t) {
    const query = match_phrase('property', 'value', { slop: 1});

    const expected = {
      match_phrase: {
        property: {
          query: 'value',
          slop: 1
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query with slop');
    t.end();
  });

  test('match_phrase query can handle optional analyzer parameter', function(t) {
    const query = match_phrase('property', 'value', { analyzer: 1});

    const expected = {
      match_phrase: {
        property: {
          query: 'value',
          analyzer: 1
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query with analyzer');
    t.end();
  });

  test('match_phrase query does not allow empty string as optional param value', function(t) {
    const query = match_phrase('property', 'value', { slop: '' });

    const expected = {
      match_phrase: {
        property: {
          query: 'value'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query without empty string value');
    t.end();
  });

  test('match_phrase query does not allow empty Variable as optional param value', function(t) {
    const query = match_phrase('property', 'value', { analyzer: new Variable() });

    const expected = {
      match_phrase: {
        property: {
          query: 'value'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match_phrase query with out empty string value');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('lib/leaf/match_phrase ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
