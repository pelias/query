const terms = require('../lib/leaf/terms');

module.exports = function( vs ){
  if( !vs.isset('layers')) {
    return null;
  }

  return terms('layer', vs.var('layers'));
};
