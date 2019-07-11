module.exports = function( property, value ){
  if( !property || !value) {
    return null;
  }
  var query = {
    terms:{}
  };

  query.terms[property] = value;

  return query;
};
