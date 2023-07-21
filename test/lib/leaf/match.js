const match = require('../../../lib/leaf/match');
const Variable = require('../../../lib/Variable');

module.exports.tests = {};

module.exports.tests.match = function(test, common) {
  test('null returned if property missing', function(t) {
    const query = match();

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if value missing', function(t) {
    const query = match('theproperty');

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('match query returned with property and value', function(t) {
    const query = match('theproperty', 'thevalue');

    const expected = {
      match: {
        theproperty: {
          query: 'thevalue'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query');
    t.end();
  });

  test('match query can handle optional boost parameter', function(t) {
    const query = match('property', 'value', { boost: 5});

    const expected = {
      match: {
        property: {
          query: 'value',
          boost: 5
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with boost');
    t.end();
  });

  test('match query can handle optional minimum_should_match parameter', function(t) {
    const query = match('property', 'value', { minimum_should_match: '25%'});

    const expected = {
      match: {
        property: {
          query: 'value',
          minimum_should_match: '25%'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with minimum_should_match');
    t.end();
  });

  test('match query can handle optional fuzziness parameter', function(t) {
    const query = match('property', 'value', { fuzziness: 1});

    const expected = {
      match: {
        property: {
          query: 'value',
          fuzziness: 1
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with fuzziness');
    t.end();
  });

  test('match query can handle optional operator parameter', function(t) {
    const query = match('property', 'value', { operator: 'and'});

    const expected = {
      match: {
        property: {
          query: 'value',
          operator: 'and'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with operator');
    t.end();
  });

  test('match query can handle optional analyzer parameter', function(t) {
    const query = match('property', 'value', { analyzer: 'standard'});

    const expected = {
      match: {
        property: {
          query: 'value',
          analyzer: 'standard'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with analyzer');
    t.end();
  });

  test('match query does not allow empty string as optional param value', function(t) {
    const query = match('property', 'value', { analyzer: ''});

    const expected = {
      match: {
        property: {
          query: 'value'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with out empty string value');
    t.end();
  });

  test('match query does not allow empty Variable as optional param value', function(t) {
    const query = match('property', 'value', { analyzer: new Variable() });

    const expected = {
      match: {
        property: {
          query: 'value'
        }
      }
    };

    t.deepEqual(query, expected, 'valid match query with out empty string value');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('lib/leaf/match ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
