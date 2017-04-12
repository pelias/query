module.exports = {
  query: {
    function_score: {
      query: {
        bool: {
          should: []
        }
      },
      // move to configuration
      max_boost: 20,
      functions: [],
      score_mode: 'avg',
      boost_mode: 'multiply'
    }
  },
  sort: [
    '_score'
  ]
};
