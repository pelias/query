/*
 * Boost results that match one of the the given **values** in the supplied
 * **field** by **boost**
 */
module.exports = function( field, values, boost ){
  var body = {
    terms: {},
    boost: boost
  };

  body.terms[field] = values;

  return body;
};
