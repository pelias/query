module.exports = function( property, value ){
  if( !property || !value) {
    return null;
  }

  const query = {
    terms: {
      [property]: value
    }
  };

  return query;
};
