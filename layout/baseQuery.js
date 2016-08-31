module.exports = {
  query: {
    function_score: {
      query: {
        filtered: {
          query: {
            bool: {
              should: []
            }
          },
          filter: {
            bool: {
              must: []
            }
          }
        }
      },
      max_boost: 20,
      functions: [],
      score_mode: 'avg',
      boost_mode: 'multiply'
    }
  }
};
