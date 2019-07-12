module.exports = function( property, value, parameters ){
  if( !property || !value) {
    return null;
  }

  const query = {
    terms: {
      [property]: value
    }
  };

  if (parameters && parameters.boost) {
    query.terms.boost = parameters.boost;
  }

  return query;
};
