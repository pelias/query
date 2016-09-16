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
      // move to configuration
      max_boost: 20,
      functions: [],
      score_mode: 'avg',
      boost_mode: 'multiply'
    }
  },
  sort: [
    {
      population: {
        order: 'desc'
      }
    },
    {
      popularity: {
        order: 'desc'
      }
    },
    '_score'
  ]
};
