const _ = require('lodash');
const query = _.cloneDeep(require('./fallbackQuery1.json'));
const jpath = 'query.function_score.query.bool.should[0].bool.must[0].multi_match.fields';

_.set(query, jpath, _.get(query, jpath).concat(
  'phrase.foo',
  'phrase.foo_*'
));

module.exports = query;
