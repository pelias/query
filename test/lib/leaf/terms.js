const terms = require('../../../lib/leaf/terms');

module.exports.tests = {};

module.exports.tests.terms = function(test, common) {
  test('null returned if property missing', function(t) {
    const query = terms();

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('null returned if value missing', function(t) {
    const query = terms('theproperty');

    t.equal(null, query, 'null query returned');
    t.end();
  });

  test('terms query returned with property and value', function(t) {
    const query = terms('theproperty', 'thevalue');

    const expected = {
      terms: {
        theproperty: 'thevalue'
      }
    };

    t.deepEqual(query, expected, 'valid terms query');
    t.end();
  });
};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('lib/leaf/terms ' + name, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
