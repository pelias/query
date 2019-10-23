const multi_match = require('../../../lib/leaf/multi_match');
const Variable = require('../../../lib/Variable');

module.exports.tests = {};

module.exports.tests.multi_match = function(test, common) {
  test('null returned if property missing', function(t) {
    const query = multi_match();

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if fields are missing', function(t) {
    const query = multi_match('best_fields');

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if input is missing', function(t) {
    const query = multi_match('best_fields', ['fields']);

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if type is not supported', function(t) {
    const query = multi_match('type', ['fields'], 'input');

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('multi_match query returned with type, fields and input', function(t) {
    const query = multi_match('best_fields', ['fields'], 'input');

    const expected = {
      multi_match: {
        type: 'best_fields',
        fields: ['fields'],
        query: 'input'
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query');
    t.end();
  });

  test('multi_match query can handle optional boost parameter', function(t) {
    const query = multi_match('phrase', ['fields'], 'input', { boost: 5});


    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields'],
        query: 'input',
        boost: 5
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query with boost');
    t.end();
  });

  test('multi_match phrase query can handle optional slop parameter', function(t) {
    const query = multi_match('phrase', ['fields'], 'input', { slop: 1});

    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields'],
        query: 'input',
        slop: 1
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query with slop');
    t.end();
  });

  test('multi_match query can handle optional analyzer parameter', function(t) {
    const query = multi_match('phrase', ['fields'], 'input', { analyzer: 'customAnalyzer'});

    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields'],
        query: 'input',
        analyzer: 'customAnalyzer'
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query with analyzer');
    t.end();
  });

  test('multi_match query does not allow empty string as optional param input', function(t) {
    const query = multi_match('phrase', ['fields'], 'input', { slop: '' });

    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields'],
        query: 'input'
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query without empty string input');
    t.end();
  });

  test('multi_match query does not allow empty Variable as optional param input', function(t) {
    const query = multi_match('phrase', ['fields'], 'input', { analyzer: new Variable() });

    const expected = {
      multi_match: {
        type: 'phrase',
        fields: ['fields'],
        query: 'input'
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query with out empty string input');
    t.end();
  });

  test('multi_match query with type phrase_prefix should accept max_expansions', function(t) {
    const query = multi_match('phrase_prefix', ['fields'], 'input', { max_expansions: 25 });

    const expected = {
      multi_match: {
        type: 'phrase_prefix',
        fields: ['fields'],
        query: 'input',
        max_expansions: 25
      }
    };

    t.deepEqual(query, expected, 'valid multi_match query with out empty string input');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('lib/leaf/multi_match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
